from pydantic import BaseModel, ConfigDict
from uuid import UUID

class CategoriaBase(BaseModel):
    nome: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nome: str | None = None

class CategoriaResponse(CategoriaBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
