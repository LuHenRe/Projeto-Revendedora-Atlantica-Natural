from pydantic import BaseModel, ConfigDict
from uuid import UUID

class CategoriaBase(BaseModel):
    nome: str

class CategoriaCreate(CategoriaBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nome": "Óleos Essenciais"
            }
        }
    )

class CategoriaUpdate(BaseModel):
    nome: str | None = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nome": "Difusores"
            }
        }
    )

class CategoriaResponse(CategoriaBase):
    id: UUID

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "nome": "Óleos Essenciais"
            }
        }
    )
