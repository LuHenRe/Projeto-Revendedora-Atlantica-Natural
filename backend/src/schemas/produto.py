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
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nome": "Óleo Essencial de Lavanda 10ml",
                "preco": 45.90,
                "quantidade_estoque": 20,
                "imagem_url": "https://exemplo.com/lavanda.jpg",
                "ativo": True,
                "categoria_id": "123e4567-e89b-12d3-a456-426614174000"
            }
        }
    )

class ProdutoUpdate(BaseModel):
    nome: str | None = None
    preco: float | None = None
    quantidade_estoque: int | None = None
    imagem_url: str | None = None
    ativo: bool | None = None
    categoria_id: UUID | None = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "preco": 49.90,
                "quantidade_estoque": 15
            }
        }
    )

class ProdutoResponse(ProdutoBase):
    id: UUID
    categoria: CategoriaResponse | None = None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "987e6543-e21b-34d5-c678-426614174111",
                "nome": "Óleo Essencial de Lavanda 10ml",
                "preco": 45.90,
                "quantidade_estoque": 20,
                "imagem_url": "https://exemplo.com/lavanda.jpg",
                "ativo": True,
                "categoria_id": "123e4567-e89b-12d3-a456-426614174000",
                "categoria": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "nome": "Óleos Essenciais"
                }
            }
        }
    )
