from database.database import db
from models.usuario import Usuario

class Paciente(Usuario):
    __tablename__ = "paciente"

    id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"), # une esta tabla con usuarios.id
        primary_key=True
    )

    inasistencias = db.Column(db.Integer, default=0) # cuenta las citas no atendidas

    __mapper_args__ = {
    "polymorphic_identity": "paciente", # SQLAlchemy sabe que este registro es un Paciente
    }