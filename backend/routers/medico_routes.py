#routers/medico_routes.py

from flask import Blueprint, request, jsonify   # Blueprint agrupa rutas; request lee el JSON; jsonify arma la respuesta
from pydantic import ValidationError            # error cuando el DTO no valida

from schemas.medico_schema import MedicoCreateRequest
from services import medico_service


medico_bp = Blueprint("medicos", __name__)

#Metodo post para registrar un medico
@medico_bp.route("/usuarios/medicos", methods=["POST"])
def registrar_medico():
    try:
        datos = MedicoCreateRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    medico, error = medico_service.registrar_medico(datos.model_dump())
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"mensaje": "Medico registrado", "id":medico.id}), 201