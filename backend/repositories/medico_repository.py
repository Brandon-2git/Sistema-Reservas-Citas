from database.database import db      # para hacer commit
from models.medico import Medico       # entidad Medico

def crear_medico(medico):
    db.session.add(medico)
    db.session.commit()
    return medico