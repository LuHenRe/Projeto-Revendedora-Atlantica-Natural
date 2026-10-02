from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from src.core.database import get_db
from src.api.deps import get_current_user
from src.schemas.categoria import CategoriaResponse, CategoriaCreate, CategoriaUpdate
from src.domain.entities.categoria import Categoria
from src.infrastructure.database.repositories.categoria import CategoriaRepositoryDB

router = APIRouter()
admin_router = APIRouter()

# --- Rotas Públicas ---
@router.get("/", response_model=list[CategoriaResponse], summary="Listar categorias", description="Retorna uma lista paginada de todas as categorias cadastradas.")
def listar_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repo = CategoriaRepositoryDB(db)
    return repo.listar(skip=skip, limit=limit)

@router.get("/{id}", response_model=CategoriaResponse, summary="Obter categoria", description="Busca os detalhes de uma categoria específica pelo seu UUID.")
def obter_categoria(id: UUID, db: Session = Depends(get_db)):
    repo = CategoriaRepositoryDB(db)
    categoria = repo.obter_por_id(id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return categoria

# --- Rotas Privadas (Admin) ---
@admin_router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED, summary="Criar categoria", description="Cria uma nova categoria no sistema. Requer autenticação de administrador.")
def criar_categoria(categoria_in: CategoriaCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo = CategoriaRepositoryDB(db)
    try:
        nova_categoria = Categoria(id=uuid4(), nome=categoria_in.nome)
        return repo.salvar(nova_categoria)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.put("/{id}", response_model=CategoriaResponse, summary="Atualizar categoria", description="Atualiza os dados de uma categoria existente. Requer autenticação de administrador.")
def atualizar_categoria(id: UUID, categoria_in: CategoriaUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo = CategoriaRepositoryDB(db)
    categoria = repo.obter_por_id(id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    if categoria_in.nome is not None:
        try:
            categoria.nome = categoria_in.nome
            # Validação simples que estaria no entity (__post_init__)
            if not categoria.nome.strip(): raise ValueError("Nome inválido")
        except ValueError:
            raise HTTPException(status_code=400, detail="Nome inválido")
            
    return repo.salvar(categoria)

@admin_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar categoria", description="Remove fisicamente uma categoria do sistema. Requer autenticação de administrador.")
def deletar_categoria(id: UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo = CategoriaRepositoryDB(db)
    categoria = repo.obter_por_id(id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    repo.deletar(id)
    return None
