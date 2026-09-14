# repositories/paciente_repository.py

from database.database import db          # para hacer commit
from models.paciente import Paciente        # entidad Paciente

def crear_paciente(paciente):
    db.session.add(paciente)
    db.session.commit()
    return paciente