# models/calendario_laboral.py
from database.database import db


class CalendarioLaboral(db.Model):
    __tablename__ = "calendario_laboral"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    medico_id = db.Column(db.Integer, db.ForeignKey("medico.id"), nullable=False)
    diaSemana = db.Column(db.String(10), nullable=False)
    horaInicio = db.Column(db.Time, nullable=False)
    horaFin = db.Column(db.Time, nullable=False)
    fechaInicioVigencia = db.Column(db.Date, nullable=False)
    fechaFinVigencia = db.Column(db.Date, nullable=True)

    medico = db.relationship("Medico", backref="calendarios")

    def to_dict(self):
        return {
            "id": self.id,
            "medicoId": self.medico_id,
            "diaSemana": self.diaSemana,
            "horaInicio": self.horaInicio.strftime("%H:%M"),
            "horaFin": self.horaFin.strftime("%H:%M"),
            "fechaInicioVigencia": self.fechaInicioVigencia.isoformat(),
            "fechaFinVigencia": (
                self.fechaFinVigencia.isoformat() if self.fechaFinVigencia else None
            ),
        }