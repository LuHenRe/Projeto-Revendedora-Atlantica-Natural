from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from src.core.database import get_db
from src.api.deps import get_current_user
from src.schemas.produto import ProdutoResponse, ProdutoCreate, ProdutoUpdate

from src.infrastructure.database.repositories.produto import ProdutoRepositoryDB
from src.infrastructure.database.repositories.categoria import CategoriaRepositoryDB
from src.application.use_cases.criar_produto import CriarProdutoUseCase, CriarProdutoDTO

router = APIRouter()
admin_router = APIRouter()

# --- Rotas Públicas ---
@router.get("/", response_model=list[ProdutoResponse], summary="Listar produtos", description="Retorna uma lista paginada de todos os produtos ativos no catálogo.")
def listar_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repo = ProdutoRepositoryDB(db)
    return repo.listar_ativos(skip=skip, limit=limit)

@router.get("/ofertas-locais", response_model=list[ProdutoResponse], summary="Listar ofertas locais", description="Retorna os produtos ativos que possuem estoque disponível (> 0).")
def ofertas_locais(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repo = ProdutoRepositoryDB(db)
    return repo.listar_ofertas_locais(skip=skip, limit=limit)

@router.get("/{id}", response_model=ProdutoResponse, summary="Obter produto", description="Busca os detalhes de um produto específico, garantindo que ele esteja ativo.")
def obter_produto(id: UUID, db: Session = Depends(get_db)):
    repo = ProdutoRepositoryDB(db)
    produto = repo.obter_por_id(id)
    if not produto or not produto.ativo:
        raise HTTPException(status_code=404, detail="Produto não encontrado ou inativo")
    return produto

# --- Rotas Privadas (Admin) ---
@admin_router.post("/", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED, summary="Criar produto", description="Adiciona um novo produto ao catálogo. Requer autenticação de administrador.")
def criar_produto(produto_in: ProdutoCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    repo_produto = ProdutoRepositoryDB(db)
    repo_categoria = CategoriaRepositoryDB(db)
    use_case = CriarProdutoUseCase(repo_produto, repo_categoria)
    
    dto = CriarProdutoDTO(
        nome=produto_in.nome,
        preco=produto_in.preco,
        categoria_id=produto_in.categoria_id,
        quantidade_estoque=produto_in.quantidade_estoque,
        imagem_url=produto_in.imagem_url,
        ativo=produto_in.ativo
    )
    
    try:
        produto = use_case.execute(dto)
        return produto
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@admin_router.put("/{id}", response_model=ProdutoResponse, summary="Atualizar produto", description="Atualiza os dados de um produto existente. Requer autenticação de administrador.")
def atualizar_produto(id: UUID, produto_in: ProdutoUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # NOTA: Para TDD puro, deveríamos ter um AtualizarProdutoUseCase. 
    # Aqui faremos direto para simplificar a transição, chamando os repositórios abstratos.
    repo_produto = ProdutoRepositoryDB(db)
    repo_categoria = CategoriaRepositoryDB(db)
    
    produto = repo_produto.obter_por_id(id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if produto_in.categoria_id:
        categoria = repo_categoria.obter_por_id(produto_in.categoria_id)
        if not categoria:
            raise HTTPException(status_code=400, detail="Categoria fornecida não existe")
            
    # Update entity
    if produto_in.nome is not None: produto.nome = produto_in.nome
    if produto_in.preco is not None: produto.preco = produto_in.preco
    if produto_in.categoria_id is not None: produto.categoria_id = produto_in.categoria_id
    if produto_in.quantidade_estoque is not None: produto.quantidade_estoque = produto_in.quantidade_estoque
    if produto_in.imagem_url is not None: produto.imagem_url = produto_in.imagem_url
    if produto_in.ativo is not None: produto.ativo = produto_in.ativo
    
    return repo_produto.salvar(produto)

@admin_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deletar produto (Lógico)", description="Realiza a exclusão lógica do produto, alterando a flag ativo para False. Requer autenticação de administrador.")
def deletar_produto(id: UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # NOTA: Deveria ser InativarProdutoUseCase
    repo = ProdutoRepositoryDB(db)
    produto = repo.obter_por_id(id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Exclusão Lógica via Entity Behavior
    produto.inativar()
    repo.salvar(produto)
    return None
