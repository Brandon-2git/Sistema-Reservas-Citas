from database.database import db
from models.usuario import Usuario

class Administrador(Usuario):
    __tablename__ = "administrador"

    id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        primary_key=True
    )

    __mapper_args__ = {
        "polymorphic_identity": "administrador",
    }