# routers/calendario_laboral_routes.py
from datetime import date

from flask import Blueprint, request, jsonify
from pydantic import ValidationError


from schemas.calendario_laboral_schema import (
    CalendarioLaboralCreateRequest,
    CalendarioLaboralUpdateRequest,
)
from services import calendario_laboral_service

calendario_bp = Blueprint("calendario", __name__)


@calendario_bp.route("/medicos/<int:medico_id>/calendario", methods=["POST"])
def registrar_bloque(medico_id):
    cuerpo = request.get_json(silent=True)
    if not isinstance(cuerpo, dict):
        return jsonify({"error": "El cuerpo debe ser un objeto JSON"}), 400

    try:
        datos = CalendarioLaboralCreateRequest(**cuerpo)
    except ValidationError as e:
        return jsonify({
            "error": e.errors(include_url=False, include_context=False, include_input=False)
        }), 400

    bloque, error = calendario_laboral_service.registrar_bloque(
        medico_id, datos.model_dump()
    )
    if error == calendario_laboral_service.MEDICO_NO_ENCONTRADO:
        return jsonify({"error": error}), 404
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"mensaje": "Horario registrado", "id": bloque.id}), 201


@calendario_bp.route("/medicos/<int:medico_id>/calendario", methods=["GET"])
def listar_calendario(medico_id):
    fecha = None
    texto_fecha = request.args.get("fecha")
    if texto_fecha:
        try:
            fecha = date.fromisoformat(texto_fecha)
        except ValueError:
            return jsonify({"error": "fecha debe tener el formato AAAA-MM-DD"}), 400

    bloques, error = calendario_laboral_service.listar_calendario(medico_id, fecha)
    if error:
        return jsonify({"error": error}), 404

    return jsonify(bloques), 200


@calendario_bp.route(
    "/medicos/<int:medico_id>/calendario/<int:bloque_id>",
    methods=["PATCH"],
)
def modificar_bloque(medico_id, bloque_id):
    cuerpo = request.get_json(silent=True)

    if not isinstance(cuerpo, dict):
        return jsonify({
            "error": "El cuerpo debe ser un objeto JSON"
        }), 400

    try:
        datos = CalendarioLaboralUpdateRequest(**cuerpo)
    except ValidationError as e:
        return jsonify({
            "error": e.errors(
                include_url=False,
                include_context=False,
                include_input=False,
            )
        }), 400

    bloque, error = calendario_laboral_service.modificar_bloque(
        medico_id,
        bloque_id,
        datos.model_dump(exclude_unset=True),
    )

    if error == calendario_laboral_service.MEDICO_NO_ENCONTRADO:
        return jsonify({"error": error}), 404

    if error == "Bloque de horario no encontrado":
        return jsonify({"error": error}), 404

    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "mensaje": "Horario actualizado",
        "bloque": bloque.to_dict(),
    }), 200


@calendario_bp.route(
    "/medicos/<int:medico_id>/calendario/<int:bloque_id>",
    methods=["DELETE"],
)
def eliminar_bloque(medico_id, bloque_id):
    eliminado, error = calendario_laboral_service.eliminar_bloque(
        medico_id, bloque_id
    )

    if error == calendario_laboral_service.MEDICO_NO_ENCONTRADO:
        return jsonify({"error": error}), 404

    if error:
        return jsonify({"error": error}), 404

    return jsonify({"mensaje": "Horario eliminado"}), 200
