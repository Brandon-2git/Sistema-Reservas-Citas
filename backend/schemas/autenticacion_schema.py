#Valida los datos del inicio de sesión
def validar_login(datos):
    if not datos:
        return False, "No se recibieron datos"
    if not datos.get("correo") or not datos.get("contrasena"):
        return False, "Correo y contrasena son obligatorios"
    return True, None