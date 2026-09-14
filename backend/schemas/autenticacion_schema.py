# Schemas/autenticacion_schema.py

# BaseModel -- clase para crear dtos, EmailStr -- valida que el texto tenga formato de correo
from pydantic import BaseModel, EmailStr

# DTO de entrada: datos que el cliente debe mandar para iniciar sesion
class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str