from flask import Blueprint, jsonify, request
from datetime import date
from pydantic import ValidationError

from schemas.cita_schema import CitaCreateRequest
from services import cita_service

citas_bp = Blueprint("citas_bp", __name__, url_prefix="/api")

@citas_bp.route("/citas", methods=["POST"])
def registrar_cita():
    """Registra una nueva cita médica en la base de datos a partir del formulario."""
    try:
        datos = CitaCreateRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    cita, error = cita_service.registrar_cita(datos.model_dump())
    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "mensaje": "Cita registrada con éxito",
        "cita": cita.to_dict()
    }), 201

@citas_bp.route("/citas", methods=["GET"])
def obtener_citas():
    """Retorna las citas médicas almacenadas en la base de datos."""
    fecha = request.args.get("fecha")
    medico = request.args.get("medico")
    citas = cita_service.listar_citas(fecha=fecha, medico=medico)
    return jsonify(citas), 200

@citas_bp.route("/agenda/<int:medico_id>", methods=["GET"])
def obtener_agenda_medico(medico_id):
    """Retorna la agenda de citas para un médico específico desde la base de datos."""
    fecha = request.args.get("fecha")
    citas = cita_service.listar_citas(fecha=fecha)
    return jsonify({
        "medico_id": medico_id,
        "fecha": fecha or str(date.today()),
        "citas": citas
    }), 200

@citas_bp.route("/agenda", methods=["GET"])
def obtener_agenda_general():
    """Retorna la agenda de citas generales desde la base de datos."""
    fecha = request.args.get("fecha")
    medico = request.args.get("medico")
    citas = cita_service.listar_citas(fecha=fecha, medico=medico)
    return jsonify({
        "fecha": fecha or str(date.today()),
        "citas": citas
    }), 200
