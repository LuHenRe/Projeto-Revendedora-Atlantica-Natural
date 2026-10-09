import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.entities.produto_matriz import ProdutoMatriz
from src.domain.repositories.i_produto_matriz_repository import IProdutoMatrizRepository
from src.infrastructure.database.models.produto_matriz import ProdutoMatrizModel

class ProdutoMatrizRepositoryDB(IProdutoMatrizRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, produto: ProdutoMatriz) -> ProdutoMatriz:
        db_produto = self.db.query(ProdutoMatrizModel).filter(ProdutoMatrizModel.id == produto.id).first()
        
        if db_produto:
            # Update
            for key, value in produto.model_dump().items():
                setattr(db_produto, key, value)
        else:
            # Create
            db_produto = ProdutoMatrizModel(**produto.model_dump())
            self.db.add(db_produto)
            
        self.db.commit()
        self.db.refresh(db_produto)
        
        return ProdutoMatriz(**db_produto.__dict__)

    def get_by_id(self, produto_id: uuid.UUID) -> Optional[ProdutoMatriz]:
        db_produto = self.db.query(ProdutoMatrizModel).filter(ProdutoMatrizModel.id == produto_id).first()
        if db_produto:
            return ProdutoMatriz(**db_produto.__dict__)
        return None

    def get_by_url_origem(self, url: str) -> Optional[ProdutoMatriz]:
        db_produto = self.db.query(ProdutoMatrizModel).filter(ProdutoMatrizModel.url_origem == url).first()
        if db_produto:
            return ProdutoMatriz(**db_produto.__dict__)
        return None

    def list_ativos(self) -> List[ProdutoMatriz]:
        db_produtos = self.db.query(ProdutoMatrizModel).filter(ProdutoMatrizModel.ativo == True).all()
        return [ProdutoMatriz(**p.__dict__) for p in db_produtos]

    def delete(self, produto_id: uuid.UUID) -> bool:
        db_produto = self.db.query(ProdutoMatrizModel).filter(ProdutoMatrizModel.id == produto_id).first()
        if db_produto:
            self.db.delete(db_produto)
            self.db.commit()
            return True
        return False
