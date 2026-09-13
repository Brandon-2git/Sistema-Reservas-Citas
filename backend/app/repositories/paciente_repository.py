from sqlalchemy.orm import Session
from app.models.paciente import Paciente

# Esta es la única capa que tiene permiso de hablar con la base de datos
class PacienteRepository:
    
    # Buscamos si existe un paciente con ese correo
    # Le pasamos la sesión de la DB (db) y el correo a buscar
    def get_paciente_by_email(self, db: Session, email: str):
        # Hacemos un "SELECT * FROM pacientes WHERE email = '...'"
        return db.query(Paciente).filter(Paciente.email == email).first()
