
from flask import Blueprint, request, jsonify
from schemas.autenticacion_schema import validar_login
from services import autenticacion_service

autenticacion_bp = Blueprint("autenticacion", __name__)

@autenticacion_bp.route("/login", methods=["POST"])
def login():
    datos = request.get_json()

    valido, error = validar_login(datos)
    if not valido:
        return jsonify({"error": error}), 400

    token, error = autenticacion_service.iniciar_sesion(datos["correo"], datos["contrasena"])
    if error:
        return jsonify({"error": error}), 401

    return jsonify({"token": token}), 200