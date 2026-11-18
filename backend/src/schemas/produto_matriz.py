import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, HttpUrl

class ProdutoMatrizCreate(BaseModel):
    url_origem: str

class ProdutoMatrizResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    url_origem: str
    url_afiliada: str
    nome: str
    preco: float
    imagem_url: Optional[str]
    descricao: Optional[str]
    categoria_origem: Optional[str] = None
    ativo: bool


class CategoriaMatrizInfo(BaseModel):
    nome: str
    url: str


class SincronizarCategoriaRequest(BaseModel):
    categoria_url: str


class SincronizarCategoriaResponse(BaseModel):
    categoria_url: str
    adicionados: int
    atualizados: int
    removidos: int
    produtos: list[ProdutoMatrizResponse]

