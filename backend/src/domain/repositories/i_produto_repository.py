from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from src.domain.entities.produto import Produto

class IProdutoRepository(ABC):
    @abstractmethod
    def salvar(self, produto: Produto) -> Produto:
        pass
    
    @abstractmethod
    def obter_por_id(self, produto_id: UUID) -> Optional[Produto]:
        pass
    
    @abstractmethod
    def listar_ativos(self, skip: int = 0, limit: int = 100) -> List[Produto]:
        pass

    @abstractmethod
    def listar_ofertas_locais(self, skip: int = 0, limit: int = 100) -> List[Produto]:
        pass
