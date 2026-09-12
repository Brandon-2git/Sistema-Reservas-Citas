
from flask import Blueprint, request, jsonify
from schemas.usuario_schema import validar_alta_medico
from services import usuario_service

# agrupa las rutas relacionadas con usuarios
usuario_bp = Blueprint("usuarios", __name__) 

#Metodo get que obtiene los usuarios mediante el servicio
@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    tipo = request.args.get("tipo")
    usuarios = usuario_service.listar_usuarios(tipo)
    resultado = [
        {"id": u.id, "nombre": u.nombre, "correo": u.correo, "tipo": u.tipo, "activo": u.activo}
        for u in usuarios
    ]
    return jsonify(resultado), 200

#Metodo Post que regirtra un medico
@usuario_bp.route("/usuarios/medicos", methods=["POST"])
def registrar_medico():
    datos = request.get_json()
    valido, error = validar_alta_medico(datos)
    if not valido:
        return jsonify({"error": error}), 400

    medico, error = usuario_service.registrar_medico(datos)
    if error:
        return jsonify({"error":error}), 400

    return jsonify({"mensaje": "Medico registrado", "id": medico.id}), 201

#Metodo Patch que actualiza los datos de un usuario
@usuario_bp.route("/usuarios/<int:usuario_id>", methods=["PATCH"])
def modificar_usuario(usuario_id):
    datos = request.get_json()
    usuario, error = usuario_service.actualizar_usuario(usuario_id, datos)
    if error:
        return jsonify({"error": error}), 404
    
    return jsonify({"mensaje": "usuario actualizado"}), 200
