# rputers/paciente_routes.py

from flask import Blueprint, request, jsonify  # Blueprint agrupa rutas; request lee el JSON; jsonify arma la respuesta
from pydantic import ValidationError            # error cuando el DTO no valida

from schemas.paciente_schema import PacienteRegistroRequest
from services import paciente_service

paciente_bp = Blueprint("pacientes", __name__)

# Metodo post para crear un paciente
@paciente_bp.route("/pacientes/registro", methods=["POST"])
def registrar_paciente():
    try:
        datos = PacienteRegistroRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    paciente, error = paciente_service.registrar_paciente(datos.model_dump())
    if error:
        return jsonify({"error", error}), 400

    return jsonify({"mensaje": "Registro exitoso", "id": paciente.id}), 201
    