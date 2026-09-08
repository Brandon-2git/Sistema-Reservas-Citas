from database.database import db
from models.usuario import Usuario

class Paciente(Usuario):
    __tablename__ = "paciente"

    id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        primary_key=True
    )