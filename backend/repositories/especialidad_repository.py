# repositories/especialidad_repository.py
from database.database import db
from models.especialidad import Especialidad


def crear_especialidad(especialidad):
    db.session.add(especialidad)
    db.session.commit()
    return especialidad


def obtener_por_nombre(nombre):
    return Especialidad.query.filter_by(nombre=nombre).first()


def listar_especialidades():
    return Especialidad.query.order_by(Especialidad.nombre).all()

def obtener_por_ids(ids):
    return Especialidad.query.filter(Especialidad.id.in_(ids)).all()

def obtener_por_id(especialidad_id):
    return db.session.get(Especialidad, especialidad_id)
