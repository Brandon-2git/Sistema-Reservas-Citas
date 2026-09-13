from pydantic import BaseModel, EmailStr

# Este es el esquema que valida lo que nos envía el frontend
class LoginRequest(BaseModel):
    # Usamos EmailStr para que pydantic valide automáticamente si es un correo real (con @ y todo)
    email: EmailStr
    # La contraseña en texto plano que el usuario escribe en el formulario
    password: str
