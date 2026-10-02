from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from src.domain.entities.produto import Produto
from src.domain.repositories.i_produto_repository import IProdutoRepository
from src.infrastructure.database.models.produto import ProdutoModel

class ProdutoRepositoryDB(IProdutoRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_entity(self, model: ProdutoModel) -> Produto:
        return Produto(
            id=model.id,
            nome=model.nome,
            preco=model.preco,
            categoria_id=model.categoria_id,
            quantidade_estoque=model.quantidade_estoque,
            imagem_url=model.imagem_url,
            ativo=model.ativo
        )

    def _to_model(self, entity: Produto) -> ProdutoModel:
        return ProdutoModel(
            id=entity.id,
            nome=entity.nome,
            preco=entity.preco,
            categoria_id=entity.categoria_id,
            quantidade_estoque=entity.quantidade_estoque,
            imagem_url=entity.imagem_url,
            ativo=entity.ativo
        )

    def salvar(self, produto: Produto) -> Produto:
        model = self.db.query(ProdutoModel).filter(ProdutoModel.id == produto.id).first()
        if not model:
            model = self._to_model(produto)
            self.db.add(model)
        else:
            model.nome = produto.nome
            model.preco = produto.preco
            model.categoria_id = produto.categoria_id
            model.quantidade_estoque = produto.quantidade_estoque
            model.imagem_url = produto.imagem_url
            model.ativo = produto.ativo
            
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def obter_por_id(self, produto_id: UUID) -> Optional[Produto]:
        model = self.db.query(ProdutoModel).filter(ProdutoModel.id == produto_id).first()
        if model:
            return self._to_entity(model)
        return None

    def listar_ativos(self, skip: int = 0, limit: int = 100) -> List[Produto]:
        models = self.db.query(ProdutoModel).filter(ProdutoModel.ativo == True).offset(skip).limit(limit).all()
        return [self._to_entity(m) for m in models]

    def listar_ofertas_locais(self, skip: int = 0, limit: int = 100) -> List[Produto]:
        models = self.db.query(ProdutoModel).filter(
            ProdutoModel.ativo == True,
            ProdutoModel.quantidade_estoque > 0
        ).offset(skip).limit(limit).all()
        return [self._to_entity(m) for m in models]
