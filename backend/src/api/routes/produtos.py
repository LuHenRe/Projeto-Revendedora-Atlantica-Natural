from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from src.core.database import get_db
from src.api.deps import get_current_user
from src.schemas.produto import ProdutoResponse, ProdutoCreate, ProdutoUpdate
from src.repositories import produto as repo_produto
from src.repositories import categoria as repo_categoria

router = APIRouter()
admin_router = APIRouter()

# --- Rotas Públicas ---
@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo_produto.get_produtos_ativos(db, skip=skip, limit=limit)

@router.get("/ofertas-locais", response_model=list[ProdutoResponse])
def ofertas_locais(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return repo_produto.get_ofertas_locais(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=ProdutoResponse)
def obter_produto(id: UUID, db: Session = Depends(get_db)):
    produto = repo_produto.get_produto(db, produto_id=id)
    if not produto or not produto.ativo:
        raise HTTPException(status_code=404, detail="Produto não encontrado ou inativo")
    return produto

# --- Rotas Privadas (Admin) ---
@admin_router.post("/", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
def criar_produto(produto_in: ProdutoCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    categoria = repo_categoria.get_categoria(db, categoria_id=produto_in.categoria_id)
    if not categoria:
        raise HTTPException(status_code=400, detail="Categoria fornecida não existe")
    return repo_produto.create_produto(db, produto_in)

@admin_router.put("/{id}", response_model=ProdutoResponse)
def atualizar_produto(id: UUID, produto_in: ProdutoUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    produto = repo_produto.get_produto(db, produto_id=id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if produto_in.categoria_id:
        categoria = repo_categoria.get_categoria(db, categoria_id=produto_in.categoria_id)
        if not categoria:
            raise HTTPException(status_code=400, detail="Categoria fornecida não existe")
            
    return repo_produto.update_produto(db, db_produto=produto, produto_update=produto_in)

@admin_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(id: UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    produto = repo_produto.get_produto(db, produto_id=id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Exclusão Lógica
    update_data = ProdutoUpdate(ativo=False)
    repo_produto.update_produto(db, db_produto=produto, produto_update=update_data)
    return None
