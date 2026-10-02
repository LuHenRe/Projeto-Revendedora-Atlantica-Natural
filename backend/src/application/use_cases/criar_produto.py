from dataclasses import dataclass
from uuid import UUID, uuid4
from src.domain.entities.produto import Produto
from src.domain.repositories.i_produto_repository import IProdutoRepository
from src.domain.repositories.i_categoria_repository import ICategoriaRepository

@dataclass
class CriarProdutoDTO:
    nome: str
    preco: float
    categoria_id: UUID
    quantidade_estoque: int = 0
    imagem_url: str | None = None
    ativo: bool = True

class CriarProdutoUseCase:
    def __init__(self, produto_repo: IProdutoRepository, categoria_repo: ICategoriaRepository):
        self.produto_repo = produto_repo
        self.categoria_repo = categoria_repo

    def execute(self, dto: CriarProdutoDTO) -> Produto:
        # Regra de negócio: verificar se a categoria existe
        categoria = self.categoria_repo.obter_por_id(dto.categoria_id)
        if not categoria:
            raise ValueError("Categoria fornecida não existe")

        produto = Produto(
            id=uuid4(),
            nome=dto.nome,
            preco=dto.preco,
            categoria_id=dto.categoria_id,
            quantidade_estoque=dto.quantidade_estoque,
            imagem_url=dto.imagem_url,
            ativo=dto.ativo
        )

        return self.produto_repo.salvar(produto)
