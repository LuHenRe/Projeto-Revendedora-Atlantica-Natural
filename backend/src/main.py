import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import auth, categorias, produtos, produtos_matriz

app = FastAPI(
    title="Vitrine Virtual API",
    description="Backend para o Hub Híbrido de Curadoria",
    version="1.0.0"
)

# CORS config: permite desenvolvimento local e URLs do Render
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bem vindo à API da Vitrine Virtual"}

app.include_router(auth.router, prefix="/admin", tags=["Admin (Autenticação)"])
app.include_router(categorias.admin_router, prefix="/admin/categorias", tags=["Admin (Categorias)"])
app.include_router(produtos.admin_router, prefix="/admin/produtos", tags=["Admin (Produtos)"])
app.include_router(produtos_matriz.admin_router, prefix="/admin/produtos-matriz", tags=["Admin (Produtos Matriz)"])

app.include_router(categorias.router, prefix="/categorias", tags=["Público (Categorias)"])
app.include_router(produtos.router, prefix="/produtos", tags=["Público (Produtos)"])
app.include_router(produtos_matriz.router, prefix="/produtos-matriz", tags=["Público (Produtos Matriz)"])
