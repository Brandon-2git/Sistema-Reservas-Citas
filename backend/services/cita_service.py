from datetime import datetime, date
from models.cita import Cita
from repositories import cita_repository

def registrar_cita(datos):
    fecha_val = datos["fecha"]
    if isinstance(fecha_val, str):
        try:
            fecha_val = datetime.strptime(fecha_val, "%Y-%m-%d").date()
        except ValueError:
            return None, "Formato de fecha inválido. Debe ser YYYY-MM-DD"

    nueva_cita = Cita(
        paciente=datos["paciente"].strip(),
        telefono=datos["telefono"].strip(),
        especialidad=datos["especialidad"].strip(),
        medico=datos["medico"].strip(),
        fecha=fecha_val,
        hora=datos["hora"].strip(),
        motivo=datos["motivo"].strip(),
        nota=datos.get("nota"),
        duracion=datos.get("duracion", 45),
        estado="Confirmada",
        estado_class="confirmada",
        es_siguiente=False
    )

    cita_guardada = cita_repository.crear_cita(nueva_cita)
    return cita_guardada, None

def listar_citas(fecha=None, medico=None):
    if fecha and medico:
        citas = cita_repository.obtener_citas_por_medico(medico_nombre=medico, fecha=fecha)
    elif fecha:
        citas = cita_repository.obtener_citas_por_fecha(fecha=fecha)
    elif medico:
        citas = cita_repository.obtener_citas_por_medico(medico_nombre=medico)
    else:
        citas = cita_repository.obtener_todas_las_citas()
    return [c.to_dict() for c in citas]
