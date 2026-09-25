import jwt
import os
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from repositories import usuario_repository

# Obtenemos la llave secreta del archivo .env. Esta llave es vital para que nadie 
# pueda falsificar nuestros tokens.
SECRET_KEY = os.getenv("SECRET_KEY")

#sValida las credenciales y genera un token JWT para el usuario
def iniciar_sesion(correo, contrasena):
    # busca el usuario por correo
    usuario = usuario_repository.obtener_por_correo(correo) 

    #Verifica la contraseña
    # check_password_hash toma la contraseña encriptada de la BD y la compara 
    # con la que escribió el usuario.
    # Si el usuario NO existe (None) O la contraseña está mal, rechazamos el login.
    if not usuario or not check_password_hash(usuario.contrasena, contrasena):
        # Retornamos (Token=None, Error="Mensaje")
        return None, "Correo o contrasena incorrectos"

    #Verifica que la contraseña este activa
    # Verificar que el usuario no este baneado o desactivado
    if not usuario.activo:
        return None, "Esta cuenta esta desactivada"

    # Genera un token con jwt con id, tipo y expiración
    token = jwt.encode(
        {
            "id": usuario.id,           # Guardamos quién es
            "tipo": usuario.tipo,       # Guardamos si es paciente, médico, etc.
            "exp": datetime.utcnow() + timedelta(hours=8) # El token expira en 8 horas
        },
        SECRET_KEY,                     # Sellamos el token con nuestra llave secreta
        algorithm="HS256"               # Algoritmo matemático seguro para la firma
    )
    
    # Retornamos (Token=El token generado, Error=None)
    return token, None