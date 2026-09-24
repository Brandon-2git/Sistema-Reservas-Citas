from flask import Blueprint, jsonify, request
from datetime import date
from pydantic import ValidationError

from schemas.cita_schema import CitaCreateRequest
from services import cita_service

citas_bp = Blueprint("citas_bp", __name__, url_prefix="/api")

ESPECIALIDADES_DATA = [
    {
        "id": 1,
        "nombre": "Medicina General",
        "descripcion": "Consultas generales y seguimiento de salud integral para toda la familia",
        "medicos": 4,
        "icono": "🩺",
        "doctores": ["Dr. Roberto Silva", "Dra. Carmen Soto", "Dr. Alejandro Ramos", "Dra. Laura Vega"]
    },
    {
        "id": 2,
        "nombre": "Cardiología",
        "descripcion": "Diagnóstico, prevención y tratamiento avanzado de enfermedades del corazón",
        "medicos": 3,
        "icono": "❤️",
        "doctores": ["Dr. Roberto Silva", "Dr. Hugo Morales", "Dra. Patricia Reyes"]
    },
    {
        "id": 3,
        "nombre": "Dermatología",
        "descripcion": "Cuidado clínico y estético de la piel, cabello y uñas",
        "medicos": 2,
        "icono": "🧴",
        "doctores": ["Dra. Sofía Martínez", "Dr. Fernando Ortiz"]
    },
    {
        "id": 4,
        "nombre": "Neurología",
        "descripcion": "Tratamiento de afecciones del sistema nervioso central y periférico",
        "medicos": 3,
        "icono": "🧠",
        "doctores": ["Dr. Carlos Herrera", "Dra. Marcela Campos", "Dr. Esteban Solís"]
    },
    {
        "id": 5,
        "nombre": "Ortopedia",
        "descripcion": "Lesiones musculares, fracturas y afecciones del sistema musculoesquelético",
        "medicos": 2,
        "icono": "🦴",
        "doctores": ["Dr. Javier Mendoza", "Dra. Gabriela Torres"]
    },
    {
        "id": 6,
        "nombre": "Pediatría",
        "descripcion": "Atención médica preventiva y especializada de niños y adolescentes",
        "medicos": 3,
        "icono": "👶",
        "doctores": ["Dra. Andrea Morales", "Dr. Ricardo Cruz", "Dra. Mónica Paz"]
    },
    {
        "id": 7,
        "nombre": "Ginecología",
        "descripcion": "Salud integral de la mujer, control prenatal y cuidado ginecológico",
        "medicos": 2,
        "icono": "🌸",
        "doctores": ["Dra. Elena Vázquez", "Dra. Lucía Navarro"]
    }
]

@citas_bp.route("/especialidades", methods=["GET"])
def obtener_especialidades():
    """Retorna el catálogo de especialidades médicas con médicos disponibles."""
    return jsonify(ESPECIALIDADES_DATA), 200

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
