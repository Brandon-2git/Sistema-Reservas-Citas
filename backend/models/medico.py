from database.database import db
from models.usuario import Usuario

class Medico(Usuario):
    __tablename__ = "medico"

    id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        primary_key=True
    )

    cedulaProfesional = db.Column(db.String(50), nullable=True)
    consultorio = db.Column(db.String(50), nullable=True)
    especialidadId = db.Column(db.String(50), nullable=True)
    horasMaximas = db.Column(db.Integer, nullable =True)

    __mapper_args__ = {
        "polymorphic_identity": "medico"
    }