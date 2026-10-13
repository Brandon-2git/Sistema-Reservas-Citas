# models/especialidad.py

from database.database import db

class Especialidad(db.Model):
    __tablename__ = "especialidad"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.String(255), nullable=True)
    icono = db.Column(db.String(16), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "icono": self.icono,
        }