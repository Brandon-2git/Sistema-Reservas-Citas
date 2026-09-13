from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.repositories.paciente_repository import PacienteRepository
from app.schemas.auth_schema import LoginRequest

# Configuración para nuestro Token (¡Leí que en el futuro esto debería ir en el .env, pero por ahora lo pongo aquí para que nos funcione rápido!)
SECRET_KEY = "una-clave-super-secreta-para-firmar-tokens"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Herramienta para verificar las contraseñas encriptadas con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
repo = PacienteRepository()

class AuthService:

    def verify_password(self, plain_password, hashed_password):
        # Compara la contraseña que escribieron con la que está guardada y encriptada en MySQL
        return pwd_context.verify(plain_password, hashed_password)

    def create_access_token(self, data: dict):
        # Creamos un Token JWT que expirará en 30 minutos
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def authenticate(self, db: Session, login_data: LoginRequest):
        # 1. Le pedimos al repositorio que busque al usuario
        user = repo.get_paciente_by_email(db, email=login_data.email)
        
        # 2. Si no existe o la contraseña no coincide, fallamos
        if not user or not self.verify_password(login_data.password, user.hashed_password):
            return None
            
        # 3. Si todo está bien, generamos el Token y lo regresamos
        access_token = self.create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
