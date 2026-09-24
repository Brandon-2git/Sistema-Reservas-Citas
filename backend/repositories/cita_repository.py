from database.database import db
from models.cita import Cita

def crear_cita(cita):
    db.session.add(cita)
    db.session.commit()
    return cita

def obtener_todas_las_citas():
    return Cita.query.order_by(Cita.fecha.asc(), Cita.hora.asc()).all()

def obtener_citas_por_fecha(fecha):
    return Cita.query.filter_by(fecha=fecha).order_by(Cita.hora.asc()).all()

def obtener_citas_por_medico(medico_nombre=None, fecha=None):
    query = Cita.query
    if medico_nombre:
        query = query.filter(Cita.medico.ilike(f"%{medico_nombre}%"))
    if fecha:
        query = query.filter_by(fecha=fecha)
    return query.order_by(Cita.hora.asc()).all()
