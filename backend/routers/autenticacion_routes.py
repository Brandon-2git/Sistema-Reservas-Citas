#routers/autenticacion_routes.py

from flask import Blueprint, request, jsonify            # Blueprint: agrupa rutas; request: lee lo que manda el cliente; jsonify: arma la respuesta JSON
from pydantic import ValidationError                     # excepcion que lanza pyndatic cuando los datos no cumplen el schema
from schemas.autenticacion_schema import LoginRequest   # DTO que valida correo y contrasena
from services import autenticacion_service               # Logica de negocio del login


autenticacion_bp = Blueprint("autenticacion", __name__)  # agrupa todas las rutas de autenticacion bajo un mismo nombre
# Creamos el Blueprint
# que se va a encargar EXCLUSIVAMENTE de las rutas de autenticación.

# Metodo post para login y SOLO aceptará peticiones POST
@autenticacion_bp.route("/login", methods=["POST"])
def login():
    try:
        # request.get_json() atrapa los datos que mandó el Frontend.
        # Los pasamos a "LoginRequest" para que Pydantic los valide inmediatamente.
        datos = LoginRequest(**request.get_json())
    except ValidationError as e:
        # Si falta el correo o la contraseña, Pydantic lanza un error.
        # Aquí lo atrapamos y le decimos al Frontend: "Oye, me mandaste mal los datos (HTTP 400)"
        return jsonify({"error": e.errors()}), 400

    #Ya sabemos que los datos son válidos
    # El Service hará todo el trabajo pesado y nos devolverá un token o un error.
    token, error= autenticacion_service.iniciar_sesion(datos.correo, datos.contrasena)
    if error:
        # Si el Service nos devolvió un error (ej. contraseña incorrecta), 
        # le contestamos al Frontend con un HTTP 401 (No Autorizado)
        return jsonify({"error": error}), 401

    # Si no hubo error, significa que el Service nos devolvió un token válido.
    # Se lo enviamos al Frontend con un HTTP 200 (OK). ¡Login exitoso!
    return jsonify({"token": token}), 200
