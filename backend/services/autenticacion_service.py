import jwt
import os
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from repositories import usuario_repository

SECRET_KEY = os.getenv("SECRET_KEY")

#sValida las credenciales y genera un token JWT para el usuario
def iniciar_sesion(correo, contrasena):
    # busca el usuario por correo
    usuario = usuario_repository.obtener_por_correo(correo) 

    #Verifica la contraseña
    if not usuario or not check_password_hash(usuario.contrasena, contrasena):
        return None, "Correo o contrasena incorrectos"

    #Verifica que la contraseña este activa
    if not usuario.activo:
        return None, "Esta cuenta esta desactivada"

    # Genera un token con jwt con id, tipo y expiración
    token = jwt.encode(
        {"id": usuario.id, "tipo": usuario.tipo, "exp": datetime.utcnow() + timedelta(hours=8)},
        SECRET_KEY,
        algorithm="HS256" #algoritmo que firma y verifica el JWT usando una clave secreta
    )
    return token, None