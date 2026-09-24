#backend/schemas/usuario_schemas.py
from pydantic import BaseModel, EmailStr #BaseModel -- clase base para DTOs; EmailStr -- valida formato de correo
from typing import Optional # Optional -- marca un campo como no obligatorio 

class UsuarioUpdateRequest(BaseModel):
    nombre: Optional[str] = None
    apellidoPaterno: Optional[str] = None
    apellidoMaterno: Optional[str] = None
    telefono: Optional[str] = None
    activo: Optional[bool] = None