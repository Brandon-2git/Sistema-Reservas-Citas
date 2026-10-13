# services/calendario_laboral_service.py
from models.calendario_laboral import CalendarioLaboral

from repositories import calendario_laboral_repository
from repositories import medico_repository

from pydantic import ValidationError
from schemas.calendario_laboral_schema import (
    CalendarioLaboralCreateRequest,
)

DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]

# El router compara contra esta constante para responder 404 en lugar de 400
MEDICO_NO_ENCONTRADO = "Medico no encontrado"


def _vigencias_se_cruzan(inicio_a, fin_a, inicio_b, fin_b):
    # fin vacio = sin fecha de termino
    termina_antes_b = fin_a is not None and fin_a < inicio_b
    termina_antes_a = fin_b is not None and fin_b < inicio_a
    return not termina_antes_b and not termina_antes_a


def _horas_se_cruzan(inicio_a, fin_a, inicio_b, fin_b):
    # Dos bloques pegados (uno termina a las 13:00 y el otro empieza a las 13:00) no se cruzan
    return inicio_a < fin_b and inicio_b < fin_a


# funcion que permite registrar un bloque de horario a un medico
def registrar_bloque(medico_id, datos):
    if not medico_repository.obtener_por_id(medico_id):
        return None, MEDICO_NO_ENCONTRADO

    existentes = calendario_laboral_repository.listar_por_medico_y_dia(
        medico_id, datos["diaSemana"]
    )
    for e in existentes:
        if _vigencias_se_cruzan(
            datos["fechaInicioVigencia"], datos.get("fechaFinVigencia"),
            e.fechaInicioVigencia, e.fechaFinVigencia,
        ) and _horas_se_cruzan(
            datos["horaInicio"], datos["horaFin"], e.horaInicio, e.horaFin,
        ):
            return None, (
                "El horario se cruza con otro ya registrado "
                f"({e.diaSemana} de {e.horaInicio:%H:%M} a {e.horaFin:%H:%M})"
            )

    bloque = CalendarioLaboral(
        medico_id=medico_id,
        diaSemana=datos["diaSemana"],
        horaInicio=datos["horaInicio"],
        horaFin=datos["horaFin"],
        fechaInicioVigencia=datos["fechaInicioVigencia"],
        fechaFinVigencia=datos.get("fechaFinVigencia"),
    )
    calendario_laboral_repository.crear_bloque(bloque)
    return bloque, None


# funcion que devuelve el horario de un medico, ordenado por dia y hora.
# Si se manda una fecha, solo incluye los bloques vigentes ese dia.
def listar_calendario(medico_id, fecha=None):
    if not medico_repository.obtener_por_id(medico_id):
        return None, MEDICO_NO_ENCONTRADO

    bloques = calendario_laboral_repository.listar_por_medico(medico_id)

    if fecha:
        bloques = [
            b for b in bloques
            if b.fechaInicioVigencia <= fecha
            and (b.fechaFinVigencia is None or b.fechaFinVigencia >= fecha)
        ]

    bloques.sort(
        key=lambda b: (DIAS.index(b.diaSemana), b.horaInicio, b.fechaInicioVigencia)
    )
    return [b.to_dict() for b in bloques], None



from pydantic import ValidationError
from schemas.calendario_laboral_schema import (
    CalendarioLaboralCreateRequest,
)


# Busca el bloque y comprueba que pertenezca al médico.
def _obtener_bloque(medico_id, bloque_id):
    if not medico_repository.obtener_por_id(medico_id):
        return None, MEDICO_NO_ENCONTRADO

    bloque = calendario_laboral_repository.obtener_bloque_por_id(
        medico_id, bloque_id
    )

    if not bloque:
        return None, "Bloque de horario no encontrado"

    return bloque, None


def modificar_bloque(medico_id, bloque_id, cambios):
    bloque, error = _obtener_bloque(medico_id, bloque_id)

    if error:
        return None, error

    # Combinar los campos actuales con los enviados en el PATCH.
    datos_actuales = {
        "diaSemana": bloque.diaSemana,
        "horaInicio": bloque.horaInicio,
        "horaFin": bloque.horaFin,
        "fechaInicioVigencia": bloque.fechaInicioVigencia,
        "fechaFinVigencia": bloque.fechaFinVigencia,
    }
    datos_actuales.update(cambios)

    # Validar el bloque completo, no solamente los campos modificados.
    try:
        datos_validados = CalendarioLaboralCreateRequest(
            **datos_actuales
        ).model_dump()
    except ValidationError as e:
        return None, e.errors(
            include_url=False,
            include_context=False,
            include_input=False,
        )

    # Revisar cruces con otros bloques del mismo médico y día.
    existentes = calendario_laboral_repository.listar_por_medico_y_dia(
        medico_id, datos_validados["diaSemana"]
    )

    for otro in existentes:
        if otro.id == bloque.id:
            continue

        if _vigencias_se_cruzan(
            datos_validados["fechaInicioVigencia"],
            datos_validados["fechaFinVigencia"],
            otro.fechaInicioVigencia,
            otro.fechaFinVigencia,
        ) and _horas_se_cruzan(
            datos_validados["horaInicio"],
            datos_validados["horaFin"],
            otro.horaInicio,
            otro.horaFin,
        ):
            return None, (
                "El horario se cruza con otro ya registrado "
                f"({otro.diaSemana} de "
                f"{otro.horaInicio:%H:%M} a {otro.horaFin:%H:%M})"
            )

    # Aplicar los cambios solamente después de validar todo.
    bloque.diaSemana = datos_validados["diaSemana"]
    bloque.horaInicio = datos_validados["horaInicio"]
    bloque.horaFin = datos_validados["horaFin"]
    bloque.fechaInicioVigencia = datos_validados["fechaInicioVigencia"]
    bloque.fechaFinVigencia = datos_validados["fechaFinVigencia"]

    calendario_laboral_repository.actualizar_bloque(bloque)

    return bloque, None


def eliminar_bloque(medico_id, bloque_id):
    bloque, error = _obtener_bloque(medico_id, bloque_id)

    if error:
        return False, error

    calendario_laboral_repository.eliminar_bloque(bloque)

    return True, None
