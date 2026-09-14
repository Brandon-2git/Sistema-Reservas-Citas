# schemas/paciente_schema.py

from pydantic import BaseModel, EmailStr  # BaseModel: clase base para DTOs; EmailStr: valida formato de correo
from typing import Optional               # Optional: marca un campo como no obligatorio
from datetime import date


class PacienteRegistroRequest(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: Optional[str] = None
    fechaNacimiento: Optional[date] = None
    correo: EmailStr
    contrasena: str
    telefono: Optional[str] = None