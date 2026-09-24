#services/paciente_service.py

from werkzeug.security import generate_password_hash  # hashea la contrasena antes de guardarla
from models.paciente import Paciente                    # entidad Paciente (hereda de Usuario)
from repositories import usuario_repository              # acceso a datos, compartido con otras HU de Usuario
from repositories import paciente_repository  # para crear_paciente (operacion propia de Paciente)


def registrar_paciente(datos):
    if usuario_repository.obtener_por_correo(["correo"]):
        return None, "Ya existe un usuario con ese correo"

    paciente = Paciente(
        nombre=datos["nombre"],
        apellidoPaterno=datos["apellidoPaterno"],
        apellidoMaterno=datos.get("apellidoMaterno"),
        fechaNacimiento=datos.get("fechaNacimiento"),
        correo=datos["correo"],
        telefono=datos.get("telefono"),
        contrasena=generate_password_hash(datos["contrasena"]),
    )

    paciente_repository.crear_paciente(paciente)
    return paciente, None