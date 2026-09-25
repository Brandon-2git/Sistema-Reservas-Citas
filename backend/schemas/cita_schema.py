from pydantic import BaseModel, Field
from typing import Optional

class CitaCreateRequest(BaseModel):
    paciente: str = Field(..., min_length=1)
    telefono: str = Field(..., min_length=1)
    especialidad: str = Field(..., min_length=1)
    medico: str = Field(..., min_length=1)
    fecha: str = Field(..., min_length=1)
    hora: str = Field(..., min_length=1)
    motivo: str = Field(..., min_length=1)
    nota: Optional[str] = None
    duracion: Optional[int] = 45
