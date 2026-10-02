from dataclasses import dataclass
from uuid import UUID

@dataclass
class Categoria:
    id: UUID
    nome: str

    def __post_init__(self):
        if not self.nome or not self.nome.strip():
            raise ValueError("O nome da categoria não pode ser vazio")
