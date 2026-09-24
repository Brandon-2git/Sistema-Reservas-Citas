from database.database import db
from datetime import datetime

class Cita(db.Model):
    __tablename__ = "citas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    paciente = db.Column(db.String(150), nullable=False)
    telefono = db.Column(db.String(30), nullable=False)
    especialidad = db.Column(db.String(100), nullable=False)
    medico = db.Column(db.String(150), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    motivo = db.Column(db.String(255), nullable=False)
    nota = db.Column(db.Text, nullable=True)
    duracion = db.Column(db.Integer, default=45)
    estado = db.Column(db.String(50), default="Confirmada")
    estado_class = db.Column(db.String(50), default="confirmada")
    es_siguiente = db.Column(db.Boolean, default=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "paciente": self.paciente,
            "telefono": self.telefono,
            "especialidad": self.especialidad,
            "medico": self.medico,
            "fecha": str(self.fecha) if self.fecha else None,
            "hora": self.hora,
            "motivo": self.motivo,
            "nota": self.nota,
            "duracion": self.duracion,
            "estado": self.estado,
            "estado_class": self.estado_class,
            "es_siguiente": self.es_siguiente,
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
