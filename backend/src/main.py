import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.core.config import settings
from src.api.routes import auth, categorias, produtos, produtos_matriz

app = FastAPI(
    title="Vitrine Virtual API",
    description="Backend para o Hub Híbrido de Curadoria",
    version="1.0.0"
)

# Diretório para servir arquivos de uploads estáticos (fotos de produtos)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(os.path.join(UPLOAD_DIR, "produtos"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

def _normalize_origin(origin: str) -> str:
    cleaned = origin.strip().rstrip("/")
    if cleaned and not cleaned.startswith(("http://", "https://")):
        return f"https://{cleaned}"
    return cleaned


# CORS config: permite desenvolvimento local, Vercel e Render
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if settings.FRONTEND_URL:
    origins.append(_normalize_origin(settings.FRONTEND_URL))
if settings.CORS_ORIGINS:
    origins.extend(
        _normalize_origin(item)
        for item in settings.CORS_ORIGINS.split(",")
        if item.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(origins)),
    allow_origin_regex=r"https://.*\.(onrender\.com|vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bem vindo à API da Vitrine Virtual"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/admin", tags=["Admin (Autenticação)"])
app.include_router(categorias.admin_router, prefix="/admin/categorias", tags=["Admin (Categorias)"])
app.include_router(produtos.admin_router, prefix="/admin/produtos", tags=["Admin (Produtos)"])
app.include_router(produtos_matriz.admin_router, prefix="/admin/produtos-matriz", tags=["Admin (Produtos Matriz)"])

app.include_router(categorias.router, prefix="/categorias", tags=["Público (Categorias)"])
app.include_router(produtos.router, prefix="/produtos", tags=["Público (Produtos)"])
app.include_router(produtos_matriz.router, prefix="/produtos-matriz", tags=["Público (Produtos Matriz)"])
