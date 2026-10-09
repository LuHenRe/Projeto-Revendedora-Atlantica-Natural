import uuid
from typing import List, Optional
from abc import ABC, abstractmethod
from src.domain.entities.produto_matriz import ProdutoMatriz

class IProdutoMatrizRepository(ABC):
    @abstractmethod
    def save(self, produto: ProdutoMatriz) -> ProdutoMatriz:
        pass

    @abstractmethod
    def get_by_id(self, produto_id: uuid.UUID) -> Optional[ProdutoMatriz]:
        pass
        
    @abstractmethod
    def get_by_url_origem(self, url: str) -> Optional[ProdutoMatriz]:
        pass

    @abstractmethod
    def list_ativos(self) -> List[ProdutoMatriz]:
        pass

    @abstractmethod
    def delete(self, produto_id: uuid.UUID) -> bool:
        pass
