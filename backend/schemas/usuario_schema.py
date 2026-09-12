
#valida los datos requridos para registrar un médico
def validar_alta_medico(datos):
    campos_obligatorios = ["nombre", "apellidoPaterno", "correo", "contrasena", "cedulaProfesional"]
    if not datos:
        return False, "No se recibieron datos"
    for campo in campos_obligatorios:
        if not datos.get(campo):
            return False, f"El campo '{campo}' es obligatorio"
    return True, None