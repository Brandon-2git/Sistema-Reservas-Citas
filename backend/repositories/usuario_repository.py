from database.database import db
from models.usuario import Usuario
from models.medico import Medico

#busca un usuario por su correo electronico
def obtener_por_correo(correo):
    return Usuario.query.filter_by(correo=correo).first()

#busca un usuario por su ID
def obtener_por_id(usuario_id):
    return Usuario.query.get(usuario_id)

#obtiene todos los usuarioa, opcionalmentte filtrados por el tipo
def listar_todos(tipo=None):
    query = Usuario.query
    if tipo:
        query=query.filter_by(tipo=tipo)
    return query.all()

#Guarda un nuevo usuario en la base de datos
def guardar(usuario):
    db.session.add(usuario)
    db.session.commit()
    return usuario

#confirma y guarda los cambios pendientes en al base de datos
def guardar_cambios():
    db.session.commit()

