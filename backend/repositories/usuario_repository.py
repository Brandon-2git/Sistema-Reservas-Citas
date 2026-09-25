
from database.database import db
from models.usuario import Usuario
from models.medico import Medico



# Busca un usuario en la base de datos MySQL por su correo electrónico.
def obtener_por_correo(correo):
    # Usuario.query mira la tabla de usuarios
    # filter_by(correo=correo): "Busca a todos los que tengan este correo"
    # first(): "Dame solo el primero que encuentres (o None si no hay nadie)"
    return Usuario.query.filter_by(correo=correo).first()

# Busca un usuario por su ID unico en la base de datos
def obtener_por_id(usuario_id):
    # Usuario.query.get: busca el registro utilizando directamente la llave primaria (ID)
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

