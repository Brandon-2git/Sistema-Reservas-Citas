
from werkzeug.security import generate_password_hash
from models.medico import Medico
from repositories import usuario_repository

# Lista los usuarios, con opcion de filtrar por tipo
def listar_usuarios(tipo=None):
    return usuario_repository.listar_todos(tipo)

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