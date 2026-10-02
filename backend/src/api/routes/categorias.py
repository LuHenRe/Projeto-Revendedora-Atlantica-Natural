from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from src.core.database import get_db
from src.api.deps import get_current_user
from src.schemas.categoria import CategoriaResponse, CategoriaCreate, CategoriaUpdate
from src.repositories import categoria as repo_categoria

router = APIRouter()
admin_router = APIRouter()

# --- Rotas Públicas ---
@router.get("/", response_model=list[CategoriaResponse], summary="Listar categorias", description="Retorna uma lista paginada de todas as categorias cadastradas.")
def listar_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo_categoria.get_categorias(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=CategoriaResponse, summary="Obter categoria", description="Busca os detalhes de uma categoria específica pelo seu UUID.")
def obter_categoria(id: UUID, db: Session = Depends(get_db)):
    categoria = repo_categoria.get_categoria(db, categoria_id=id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return categoria

# --- Rotas Privadas (Admin) ---
@admin_router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED, summary="Criar categoria", description="Cria uma nova categoria no sistema. Requer autenticação de administrador.")
def criar_categoria(categoria_in: CategoriaCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return repo_categoria.create_categoria(db, categoria_in)

@admin_router.put("/{id}", response_model=CategoriaResponse, summary="Atualizar categoria", description="Atualiza os dados de uma categoria existente. Requer autenticação de administrador.")
def atualizar_categoria(id: UUID, categoria_in: CategoriaUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    categoria = repo_categoria.get_categoria(db, categoria_id=id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return repo_categoria.update_categoria(db, db_categoria=categoria, categoria_update=categoria_in)

@admin_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar categoria", description="Remove fisicamente uma categoria do sistema. Requer autenticação de administrador.")
def deletar_categoria(id: UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    categoria = repo_categoria.get_categoria(db, categoria_id=id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    repo_categoria.delete_categoria(db, db_categoria=categoria)
    return None
