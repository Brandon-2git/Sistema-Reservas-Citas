from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest
from app.services.auth_service import AuthService
from app.database.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])
auth_service = AuthService()

# Endpoint POST /api/auth/login
@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # ¡El Router hace lo menos posible! Solo recibe la petición y se la pasa al Service
    token = auth_service.authenticate(db, request)
    
    # Si el Service dice que falló (retornó None), lanzamos un error 401 para que el Frontend lo sepa
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Si todo salió bien, le mandamos el token al Frontend
    return token
