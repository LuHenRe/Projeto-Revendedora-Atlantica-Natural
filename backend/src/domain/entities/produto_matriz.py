import uuid
from pydantic import BaseModel, Field
from typing import Optional

class ProdutoMatriz(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    url_origem: str
    url_afiliada: str
    nome: str
    preco: float
    imagem_url: Optional[str] = None
    descricao: Optional[str] = None
    ativo: bool = True
