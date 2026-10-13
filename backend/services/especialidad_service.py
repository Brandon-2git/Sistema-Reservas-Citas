# services/especialidad_service.py
from models.especialidad import Especialidad

from repositories import especialidad_repository


# funcion que permite registrar una especialidad
def registrar_especialidad(datos):
    if especialidad_repository.obtener_por_nombre(datos["nombre"]):
        return None, "Ya existe una especialidad con ese nombre"

    especialidad = Especialidad(
        nombre=datos["nombre"],
        descripcion=datos.get("descripcion"),
        icono=datos.get("icono"),
    )
    especialidad_repository.crear_especialidad(especialidad)
    return especialidad, None


# funcion que devuelve todas las especialidades
def listar_especialidades():
    return especialidad_repository.listar_especialidades()

# funcion que devuelve las especialidades con la cantidad y los nombres de sus medicos
def listar_especialidades_con_medicos():
    
    resultado = []
    for especialidad in especialidad_repository.listar_especialidades():
        activos = [m for m in especialidad.medicos if m.activo]
        resultado.append({
            "id": especialidad.id,
            "nombre": especialidad.nombre,
            "descripcion": especialidad.descripcion,
            "icono": especialidad.icono,
            "medicos": len(activos),
            "doctores": [f"{m.nombre} {m.apellidoPaterno}" for m in activos],
        })
    return resultado

# funcion que devuelve los medicos activos de una especialidad
def listar_medicos_de_especialidad(especialidad_id):
    especialidad = especialidad_repository.obtener_por_id(especialidad_id)
    if not especialidad:
        return None, "Especialidad no encontrada"

    medicos = sorted(
        (m for m in especialidad.medicos if m.activo),
        key=lambda m: (m.apellidoPaterno.lower(), m.nombre.lower()),
    )

    return [
        {
            "id": m.id,
            "nombre": m.nombre,
            "apellidoPaterno": m.apellidoPaterno,
            "apellidoMaterno": m.apellidoMaterno,
            "consultorio": m.consultorio,
        }
        for m in medicos
    ], None