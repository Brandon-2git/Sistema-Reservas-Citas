
from werkzeug.security import generate_password_hash
from models.medico import Medico
from repositories import usuario_repository

# Lista los usuarios, con opcion de filtrar por tipo
def listar_usuarios(tipo=None):
    return usuario_repository.listar_todos(tipo)

# Registra un nuevo m´dico y valida que su correo no esté registrado
def registrar_medico(datos):
    if usuario_repository.obtener_por_correo(datos["correo"]):
        return None, "Ya existe un usuario con ese correo"

    medico = Medico(
        nombre=datos["nombre"],
        apellidoPaterno=datos["apellidoPaterno"],
        apellidoMaterno=datos.get("apellidoMaterno"),
        correo=datos["correo"],
        telefono=datos.get("telefono"),
        contrasena=generate_password_hash(datos["contrasena"]),
        cedulaProfesional=datos["cedulaProfesional"],
        consultorio=datos.get("consultorio"),
        especialidadId=datos.get("especialidadId"),
        horasMaximas=datos.get("horasMaximas"),
    )
    usuario_repository.crear_medico(medico)
    return medico, None

# Actualiza los datos permitidos de un usuario existente
def actualizar_usuario(usuario_id, datos):
    usuario = usuario_repository.obtener_por_id(usuario_id)
    if not usuario:
        return None, "Usuario no encontrado"

    # actualiza únicamente los campos enviados
    for campo in ["nombre", "apellidoPaterno", "apellidoMaterno", "telefono", "activo"]:
        if campo in datos:
            setattr(usuario, campo, datos[campo])

    usuario_repository.guardar_cambios()
    return usuario, None