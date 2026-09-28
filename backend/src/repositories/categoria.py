from sqlalchemy.orm import Session
from uuid import UUID
from src.models.categoria import Categoria
from src.schemas.categoria import CategoriaCreate, CategoriaUpdate

def get_categoria(db: Session, categoria_id: UUID) -> Categoria | None:
    return db.query(Categoria).filter(Categoria.id == categoria_id).first()

def get_categorias(db: Session, skip: int = 0, limit: int = 100) -> list[Categoria]:
    return db.query(Categoria).offset(skip).limit(limit).all()

def create_categoria(db: Session, categoria: CategoriaCreate) -> Categoria:
    db_categoria = Categoria(nome=categoria.nome)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def update_categoria(db: Session, db_categoria: Categoria, categoria_update: CategoriaUpdate) -> Categoria:
    update_data = categoria_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_categoria, key, value)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, db_categoria: Categoria):
    db.delete(db_categoria)
    db.commit()
