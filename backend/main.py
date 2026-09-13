from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routers import auth_router

# ¡Este truco lo aprendí de la documentación! 
# Crea las tablas en MySQL automáticamente basándose en nuestros Modelos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Reservas - Clínica")

# Configuración de CORS para que tu frontend en HTML nos pueda mandar datos 
# sin que el navegador nos bloquee por "seguridad".
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitimos de todas partes (solo por ahora que estamos probando)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos el Router que acabo de hacer a la aplicación principal
app.include_router(auth_router.router)

@app.get("/")
def read_root():
    return {"message": "¡El servidor está vivo!"}

# Esto permite que podamos encender el servidor corriendo "python main.py"
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
