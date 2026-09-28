from pydantic import BaseModel, ConfigDict
from uuid import UUID
from src.schemas.categoria import CategoriaResponse

class ProdutoBase(BaseModel):
    nome: str
    preco: float
    quantidade_estoque: int = 0
    imagem_url: str | None = None
    ativo: bool = True
    categoria_id: UUID

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome: str | None = None
    preco: float | None = None
    quantidade_estoque: int | None = None
    imagem_url: str | None = None
    ativo: bool | None = None
    categoria_id: UUID | None = None

class ProdutoResponse(ProdutoBase):
    id: UUID
    categoria: CategoriaResponse | None = None

    model_config = ConfigDict(from_attributes=True)
