# schemas/especialidad_schema.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class EspecialidadCreateRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(min_length=1, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=255)
    icono: Optional[str] = Field(default=None, max_length=16)