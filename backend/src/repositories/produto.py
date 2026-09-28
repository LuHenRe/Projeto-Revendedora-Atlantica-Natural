from sqlalchemy.orm import Session
from uuid import UUID
from src.models.produto import Produto
from src.schemas.produto import ProdutoCreate, ProdutoUpdate

def get_produto(db: Session, produto_id: UUID) -> Produto | None:
    return db.query(Produto).filter(Produto.id == produto_id).first()

def get_produtos_ativos(db: Session, skip: int = 0, limit: int = 100) -> list[Produto]:
    return db.query(Produto).filter(Produto.ativo == True).offset(skip).limit(limit).all()

def get_ofertas_locais(db: Session, skip: int = 0, limit: int = 100) -> list[Produto]:
    return db.query(Produto).filter(Produto.ativo == True, Produto.quantidade_estoque > 0).offset(skip).limit(limit).all()

def get_all_produtos(db: Session, skip: int = 0, limit: int = 100) -> list[Produto]:
    return db.query(Produto).offset(skip).limit(limit).all()

def create_produto(db: Session, produto: ProdutoCreate) -> Produto:
    db_produto = Produto(**produto.model_dump())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def update_produto(db: Session, db_produto: Produto, produto_update: ProdutoUpdate) -> Produto:
    update_data = produto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_produto, key, value)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def delete_produto(db: Session, db_produto: Produto):
    db.delete(db_produto)
    db.commit()
