#routers/autenticacion_routes.py

from flask import Blueprint, request, jsonify            # Blueprint: agrupa rutas; request: lee lo que manda el cliente; jsonify: arma la respuesta JSON
from pydantic import ValidationError                     # excepcion que lanza pyndatic cuando los datos no cumplen el schema
from schemas.autenticacion_schema import LoginRequest   # DTO que valida correo y contrasena
from services import autenticacion_service               # logica de negocio del login

autenticacion_bp = Blueprint("autenticacion", __name__)  # agrupa todas las rutas de autenticacion bajo un mismo nombre

# Metodo post para login
@autenticacion_bp.route("/login", methods=["POST"])
def login():
    try:
        datos = LoginRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    token, error= autenticacion_service.iniciar_sesion(datos.correo, datos.contrasena)
    if error:
        return jsonify({"error": error}), 401

    return jsonify({"token": token}), 200