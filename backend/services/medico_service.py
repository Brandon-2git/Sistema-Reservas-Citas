#services/medico_service.py
from werkzeug.security import generate_password_hash
from models.medico import Medico

from repositories import usuario_repository   # para obtener_por_correo (generico)
from repositories import medico_repository    # para crear_medico (especifico)
from repositories import especialidad_repository

#funcion que permite registrar un medico
def registrar_medico(datos):
    if usuario_repository.obtener_por_correo(datos["correo"]):
        return None, "Ya existe un usuario con ese correo"

    ids = datos.get("especialidadIds", [])
    especialidades = especialidad_repository.obtener_por_ids(ids) if ids else []
    faltantes = set(ids) - {e.id for e in especialidades}
    if faltantes:
        return None, f"Especialidades inexistentes: {sorted(faltantes)}"
    
    medico = Medico(
        nombre=datos["nombre"],
        apellidoPaterno=datos["apellidoPaterno"],
        apellidoMaterno=datos.get("apellidoMaterno"),
        correo=datos["correo"],
        telefono=datos.get("telefono"),
        contrasena=generate_password_hash(datos["contrasena"]),
        cedulaProfesional=datos["cedulaProfesional"],
        consultorio=datos.get("consultorio"),
        horasMaximas=datos.get("horasMaximas"),
        especialidades=especialidades,
    )
    medico_repository.crear_medico(medico)
    return medico, None