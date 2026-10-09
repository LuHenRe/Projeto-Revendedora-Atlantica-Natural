from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from src.core.database import get_db
from src.api.deps import get_current_user
from src.schemas.produto_matriz import ProdutoMatrizResponse, ProdutoMatrizCreate
from src.infrastructure.database.repositories.produto_matriz_repository import ProdutoMatrizRepositoryDB
from src.infrastructure.external.scraper import AtlanticaScraper
from src.application.use_cases.adicionar_produto_matriz import AdicionarProdutoMatrizUseCase, AdicionarProdutoMatrizDTO

router = APIRouter()
admin_router = APIRouter()

# --- Rotas Públicas ---
@router.get("/", response_model=list[ProdutoMatrizResponse], summary="Listar destaques da matriz", description="Retorna os produtos da matriz que foram destacados para exibição na vitrine externa.")
def listar_produtos_matriz(db: Session = Depends(get_db)):
    repo = ProdutoMatrizRepositoryDB(db)
    return repo.list_ativos()

# --- Rotas Privadas (Admin) ---
@admin_router.post("/", response_model=ProdutoMatrizResponse, status_code=status.HTTP_201_CREATED, summary="Adicionar destaque da matriz", description="Faz web scraping de um produto da matriz e o salva na base de destaques.")
async def adicionar_produto_matriz(produto_in: ProdutoMatrizCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo = ProdutoMatrizRepositoryDB(db)
    scraper = AtlanticaScraper()
    use_case = AdicionarProdutoMatrizUseCase(repo, scraper)
    
    dto = AdicionarProdutoMatrizDTO(url_origem=produto_in.url_origem)
    
    try:
        produto = await use_case.execute(dto)
        return produto
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remover destaque", description="Remove um produto da vitrine de destaques da matriz.")
def remover_produto_matriz(id: UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo = ProdutoMatrizRepositoryDB(db)
    sucesso = repo.delete(id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Produto da matriz não encontrado")
    return None
