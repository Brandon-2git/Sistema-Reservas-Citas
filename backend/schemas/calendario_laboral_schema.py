# schemas/calendario_laboral_schema.py
import unicodedata
from datetime import date, time
from typing import Literal, Optional

from pydantic import BaseModel, field_validator, model_validator

DiaSemana = Literal[
    "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"
]


class CalendarioLaboralCreateRequest(BaseModel):
    diaSemana: DiaSemana
    horaInicio: time
    horaFin: time
    fechaInicioVigencia: date
    fechaFinVigencia: Optional[date] = None

    @field_validator("diaSemana", mode="before")
    @classmethod
    def normalizar_dia(cls, valor):
        # Acepta "Miércoles", " MIERCOLES " o "miercoles" y lo deja como "miercoles"
        if isinstance(valor, str):
            texto = unicodedata.normalize("NFD", valor.strip().lower())
            return "".join(c for c in texto if unicodedata.category(c) != "Mn")
        return valor

    @model_validator(mode="after")
    def validar_rangos(self):
        if self.horaFin <= self.horaInicio:
            raise ValueError("horaFin debe ser posterior a horaInicio")

        if self.fechaFinVigencia and self.fechaFinVigencia < self.fechaInicioVigencia:
            raise ValueError(
                "fechaFinVigencia no puede ser anterior a fechaInicioVigencia"
            )

        return self

    
class CalendarioLaboralUpdateRequest(BaseModel):
    diaSemana: Optional[DiaSemana] = None
    horaInicio: Optional[time] = None
    horaFin: Optional[time] = None
    fechaInicioVigencia: Optional[date] = None
    fechaFinVigencia: Optional[date] = None

    @field_validator("diaSemana", mode="before")
    @classmethod
    def normalizar_dia(cls, valor):
        if isinstance(valor, str):
            texto = unicodedata.normalize("NFD", valor.strip().lower())
            return "".join(
                c for c in texto
                if unicodedata.category(c) != "Mn"
            )
        return valor

    @model_validator(mode="after")
    def validar_campos(self):
        if not self.model_fields_set:
            raise ValueError("Debes enviar al menos un campo para modificar")

        return self
