# repositories/calendario_laboral_repository.py
from database.database import db
from models.calendario_laboral import CalendarioLaboral


def crear_bloque(bloque):
    db.session.add(bloque)
    db.session.commit()
    return bloque


def listar_por_medico(medico_id):
    return CalendarioLaboral.query.filter_by(medico_id=medico_id).all()


def listar_por_medico_y_dia(medico_id, dia_semana):
    return CalendarioLaboral.query.filter_by(
        medico_id=medico_id, diaSemana=dia_semana
    ).all()

def obtener_bloque_por_id(medico_id, bloque_id):
    return CalendarioLaboral.query.filter_by(
        id=bloque_id,
        medico_id=medico_id,
    ).first()

def actualizar_bloque(bloque):
    db.session.commit()
    return bloque

def eliminar_bloque(bloque):
    db.session.delete(bloque)
    db.session.commit()