# schemas/autenticacion_schema.py

# BaseModel -- clase para crear dtos, EmailStr -- valida que el texto tenga formato de corre
# EmailStr: verifica si un texto tiene forma 
# de correo electrónico (ej. que tenga un "@" y un ".com").
from pydantic import BaseModel, EmailStr

# DTO de entrada: datos que el cliente debe mandar para iniciar sesion
# DTO de entrada (Data Transfer Object): 
class LoginRequest(BaseModel):
    # Si el Frontend manda "juan" en vez de "juan@mail.com", Pydantic lo bloquea.
    correo: EmailStr
    # Obliga a que la contraseña venga y sea texto.
    contrasena: str
