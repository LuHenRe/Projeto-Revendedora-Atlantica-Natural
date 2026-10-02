from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from src.domain.entities.categoria import Categoria

class ICategoriaRepository(ABC):
    @abstractmethod
    def salvar(self, categoria: Categoria) -> Categoria:
        pass
    
    @abstractmethod
    def obter_por_id(self, categoria_id: UUID) -> Optional[Categoria]:
        pass
    
    @abstractmethod
    def listar(self, skip: int = 0, limit: int = 100) -> List[Categoria]:
        pass
    
    @abstractmethod
    def deletar(self, categoria_id: UUID) -> None:
        pass
