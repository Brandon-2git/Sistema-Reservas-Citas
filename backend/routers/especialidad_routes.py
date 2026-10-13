# routers/especialidad_routes.py
from flask import Blueprint, request, jsonify
from pydantic import ValidationError

from schemas.especialidad_schema import EspecialidadCreateRequest
from services import especialidad_service

especialidad_bp = Blueprint("especialidad", __name__)

@especialidad_bp.route("/especialidades", methods=["POST"])
def registrar_especialidad():
    try:
        datos = EspecialidadCreateRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    especialidad, error = especialidad_service.registrar_especialidad(datos.model_dump())
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"mensaje": "especialidad", "id":especialidad.id}), 201

@especialidad_bp.route("/especialidades", methods=["GET"])
def listar_especialidad():
    especialidades = especialidad_service.listar_especialidades_con_medicos()
    return jsonify(especialidades), 200


@especialidad_bp.route("/especialidades/<int:especialidad_id>/medicos", methods=["GET"])
def listar_medicos_de_especialidad(especialidad_id):
    medicos, error = especialidad_service.listar_medicos_de_especialidad(especialidad_id)
    if error:
        return jsonify({"error": error}), 404

    return jsonify(medicos), 200