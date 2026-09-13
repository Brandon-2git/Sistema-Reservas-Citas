from sqlalchemy import Column, Integer, String
from app.database.database import Base

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    # El correo debe ser único para que dos personas no se registren con el mismo
    email = Column(String(100), unique=True, index=True, nullable=False)
    # Guardamos la contraseña encriptada, nunca en texto plano
    hashed_password = Column(String(255), nullable=False)
