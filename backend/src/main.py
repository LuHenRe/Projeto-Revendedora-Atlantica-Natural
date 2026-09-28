from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import auth

app = FastAPI(
    title="Vitrine Virtual API",
    description="Backend para o Hub Híbrido de Curadoria",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Atualizar para a URL do frontend em prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bem vindo à API da Vitrine Virtual"}

app.include_router(auth.router, prefix="/admin", tags=["Admin"])
