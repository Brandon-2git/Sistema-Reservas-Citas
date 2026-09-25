# routers/usuario_routes.py 
from flask import Blueprint, request, jsonify  # Blueprint: agrupa rutas; request: lee lo que manda el cliente; jsonify: arma la respuesta JSON
from pydantic import ValidationError            # excepcion que lanza Pydantic cuando los datos no cumplen el schema

from schemas.usuario_schema import UsuarioUpdateRequest  # DTOs de alta y de edicion
from services import usuario_service  # logica de negocio de usuarios

# agrupa las rutas relacionadas con usuarios
usuario_bp = Blueprint("usuarios", __name__)

# Metodo GET que obtiene los usuarios mediante el servicio
@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    tipo = request.args.get("tipo")
    usuarios = usuario_service.listar_usuarios(tipo)
    resultado = [
        {
            "id": u.id,
            "nombre": u.nombre,
            "correo": u.correo,
            "telefono": u.telefono,
            "tipo": u.tipo,
            "activo": u.activo
        }
        for u in usuarios
    ]
    return jsonify(resultado), 200

# Metodo PATCH que actualiza los datos de un usuario
@usuario_bp.route("/usuarios/<int:usuario_id>", methods=["PATCH"])
def modificar_usuario(usuario_id):
    try:
        datos = UsuarioUpdateRequest(**request.get_json())  # valida el JSON recibido contra el DTO
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    # exclude_unset=True: solo incluye los campos que el cliente realmente mando,
    # para no sobreescribir con None los campos que no se querian tocar
    usuario, error = usuario_service.actualizar_usuario(usuario_id, datos.model_dump(exclude_unset=True))
    if error:
        return jsonify({"error": error}), 404

    return jsonify({"mensaje": "usuario actualizado"}), 200