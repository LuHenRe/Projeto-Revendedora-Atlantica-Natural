import pytest
from uuid import uuid4
from src.application.use_cases.criar_produto import CriarProdutoUseCase, CriarProdutoDTO
from src.domain.entities.categoria import Categoria
from src.domain.entities.produto import Produto

# Fakes para testes
class FakeCategoriaRepo:
    def __init__(self, categorias=None):
        self.categorias = categorias or []
    
    def obter_por_id(self, categoria_id):
        for c in self.categorias:
            if c.id == categoria_id:
                return c
        return None

class FakeProdutoRepo:
    def __init__(self):
        self.salvos = []
        
    def salvar(self, produto: Produto) -> Produto:
        self.salvos.append(produto)
        return produto

def test_criar_produto_com_sucesso():
    # Setup
    cat_id = uuid4()
    repo_categoria = FakeCategoriaRepo(categorias=[Categoria(id=cat_id, nome="Teste")])
    repo_produto = FakeProdutoRepo()
    use_case = CriarProdutoUseCase(repo_produto, repo_categoria)
    
    dto = CriarProdutoDTO(
        nome="Novo Produto",
        preco=10.0,
        categoria_id=cat_id,
        quantidade_estoque=5
    )
    
    # Act
    produto_criado = use_case.execute(dto)
    
    # Assert
    assert produto_criado.id is not None
    assert produto_criado.nome == "Novo Produto"
    assert len(repo_produto.salvos) == 1

def test_criar_produto_com_categoria_inexistente():
    # Setup - Categoria não existe
    repo_categoria = FakeCategoriaRepo()
    repo_produto = FakeProdutoRepo()
    use_case = CriarProdutoUseCase(repo_produto, repo_categoria)
    
    dto = CriarProdutoDTO(
        nome="Novo Produto",
        preco=10.0,
        categoria_id=uuid4(),
        quantidade_estoque=5
    )
    
    # Act / Assert
    with pytest.raises(ValueError, match="Categoria fornecida não existe"):
        use_case.execute(dto)
