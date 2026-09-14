from pydantic import BaseModel, EmailStr #BaseModel -- clase base para DTOs; EmailStr -- valida formato de correo
from typing import Optional # Optional -- marca un campo como no obligatorio 

class MedicoCreateRequest(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: Optional[str] = None
    correo: EmailStr
    telefono: Optional[str] = None
    contrasena: str
    cedulaProfesional: str
    consultorio: Optional[int] = None
    especialidadId: Optional[int] = None
    horasMaximas: Optional[int] = None