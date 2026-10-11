from typing import Dict, Any
from pydantic import BaseModel
from src.domain.entities.produto_matriz import ProdutoMatriz
from src.domain.repositories.i_produto_matriz_repository import IProdutoMatrizRepository
from src.infrastructure.external.scraper import AtlanticaScraper

class AdicionarProdutoMatrizDTO(BaseModel):
    url_origem: str
    codigo_revendedora: str = "padrao" # Em produção, isso viria das configs ou JWT

class AdicionarProdutoMatrizUseCase:
    def __init__(self, repository: IProdutoMatrizRepository, scraper: AtlanticaScraper):
        self.repository = repository
        self.scraper = scraper

    async def execute(self, dto: AdicionarProdutoMatrizDTO) -> ProdutoMatriz:
        # Verifica se já existe
        existente = self.repository.get_by_url_origem(dto.url_origem)
        if existente:
            return existente

        # Busca dados externos (scraping)
        try:
            dados_externos = await self.scraper.fetch_product_data(dto.url_origem)
        except Exception as e:
            raise ValueError(f"Não foi possível obter os dados da url. Erro: {str(e)}")
            
        if not dados_externos.get("nome"):
            raise ValueError("Não foi possível extrair o título do produto nessa URL.")

        # Gera URL de afiliado
        # Se for do tipo atlanticanaturalbr.com.br, a estrutura típica pode ser /revendedor
        # Aqui, montamos uma URL de exemplo genérica se não houver regra específica ainda.
        if "?" in dto.url_origem:
            url_afiliada = f"{dto.url_origem}&aff={dto.codigo_revendedora}"
        else:
            url_afiliada = f"{dto.url_origem}?aff={dto.codigo_revendedora}"

        # Cria a Entidade
        produto = ProdutoMatriz(
            url_origem=dto.url_origem,
            url_afiliada=url_afiliada,
            nome=dados_externos["nome"],
            preco=dados_externos["preco"],
            imagem_url=dados_externos["imagem_url"],
            descricao=dados_externos["descricao"]
        )

        # Salva
        return self.repository.save(produto)
