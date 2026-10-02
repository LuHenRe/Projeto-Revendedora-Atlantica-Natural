from dataclasses import dataclass
from uuid import UUID

@dataclass
class Produto:
    id: UUID
    nome: str
    preco: float
    categoria_id: UUID
    quantidade_estoque: int = 0
    imagem_url: str | None = None
    ativo: bool = True

    def __post_init__(self):
        if self.preco < 0:
            raise ValueError("O preço não pode ser negativo")
        if not self.nome or not self.nome.strip():
            raise ValueError("O nome do produto não pode ser vazio")

    def inativar(self):
        self.ativo = False

    def ativar(self):
        self.ativo = True

    def em_estoque(self) -> bool:
        return self.quantidade_estoque > 0

    def tem_oferta_local(self) -> bool:
        return self.ativo and self.em_estoque()
