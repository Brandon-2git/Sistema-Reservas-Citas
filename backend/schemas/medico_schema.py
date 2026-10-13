from pydantic import BaseModel, EmailStr, Field, PositiveInt, field_validator #BaseModel -- clase base para DTOs; EmailStr -- valida formato de correo
from typing import Optional, List # Optional -- marca un campo como no obligatorio 

class MedicoCreateRequest(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: Optional[str] = None
    correo: EmailStr
    telefono: Optional[str] = None
    contrasena: str
    cedulaProfesional: str
    consultorio: Optional[str] = Field(default=None, max_length=50)
    especialidadIds: List[PositiveInt] = Field(default_factory=list)
    horasMaximas: Optional[int] = None

    @field_validator("especialidadIds")
    @classmethod
    def quitar_repetidos(cls, ids):
        return list(dict.fromkeys(ids))