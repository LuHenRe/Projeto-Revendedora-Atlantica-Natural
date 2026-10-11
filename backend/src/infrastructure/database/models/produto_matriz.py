import uuid
from sqlalchemy import Column, String, Float, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from src.core.database import Base

class ProdutoMatrizModel(Base):
    __tablename__ = "produtos_matriz"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    url_origem = Column(String, unique=True, index=True, nullable=False)
    url_afiliada = Column(String, nullable=False)
    nome = Column(String, nullable=False)
    preco = Column(Float, nullable=False)
    imagem_url = Column(String, nullable=True)
    descricao = Column(Text, nullable=True)
    ativo = Column(Boolean, default=True, nullable=False)
