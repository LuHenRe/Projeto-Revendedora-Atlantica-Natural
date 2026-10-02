from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from src.domain.entities.categoria import Categoria
from src.domain.repositories.i_categoria_repository import ICategoriaRepository
from src.infrastructure.database.models.categoria import CategoriaModel

class CategoriaRepositoryDB(ICategoriaRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_entity(self, model: CategoriaModel) -> Categoria:
        return Categoria(id=model.id, nome=model.nome)

    def _to_model(self, entity: Categoria) -> CategoriaModel:
        return CategoriaModel(id=entity.id, nome=entity.nome)

    def salvar(self, categoria: Categoria) -> Categoria:
        model = self.db.query(CategoriaModel).filter(CategoriaModel.id == categoria.id).first()
        if not model:
            model = self._to_model(categoria)
            self.db.add(model)
        else:
            model.nome = categoria.nome
            
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def obter_por_id(self, categoria_id: UUID) -> Optional[Categoria]:
        model = self.db.query(CategoriaModel).filter(CategoriaModel.id == categoria_id).first()
        if model:
            return self._to_entity(model)
        return None

    def listar(self, skip: int = 0, limit: int = 100) -> List[Categoria]:
        models = self.db.query(CategoriaModel).offset(skip).limit(limit).all()
        return [self._to_entity(m) for m in models]

    def deletar(self, categoria_id: UUID) -> None:
        model = self.db.query(CategoriaModel).filter(CategoriaModel.id == categoria_id).first()
        if model:
            self.db.delete(model)
            self.db.commit()
