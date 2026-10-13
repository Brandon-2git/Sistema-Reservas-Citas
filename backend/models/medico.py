from database.database import db
from models.usuario import Usuario

medico_especialidad = db.Table(
    "medico_especialidad",
    db.Column("medico_id", db.Integer, db.ForeignKey("medico.id"), primary_key=True),
    db.Column("especialidad_id", db.Integer, db.ForeignKey("especialidad.id"), primary_key=True),
)

class Medico(Usuario):
    __tablename__ = "medico"

    id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        primary_key=True
    )

    cedulaProfesional = db.Column(db.String(50), nullable=True)
    consultorio = db.Column(db.String(50), nullable=True)
    horasMaximas = db.Column(db.Integer, nullable =True)

    especialidades = db.relationship(
        "Especialidad",
        secondary=medico_especialidad,
        backref="medicos",
    )

    __mapper_args__ = {
        "polymorphic_identity": "medico"
    }