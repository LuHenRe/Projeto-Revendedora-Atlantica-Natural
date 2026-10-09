import uuid
from typing import Optional
from pydantic import BaseModel, HttpUrl

class ProdutoMatrizCreate(BaseModel):
    url_origem: str

class ProdutoMatrizResponse(BaseModel):
    id: uuid.UUID
    url_origem: str
    url_afiliada: str
    nome: str
    preco: float
    imagem_url: Optional[str]
    descricao: Optional[str]
    ativo: bool

    class Config:
        from_attributes = True
