from typing import List
from pydantic import BaseModel
from src.domain.entities.produto_matriz import ProdutoMatriz
from src.domain.repositories.i_produto_matriz_repository import IProdutoMatrizRepository
from src.infrastructure.external.scraper import AtlanticaScraper
from src.application.use_cases.adicionar_produto_matriz import build_affiliate_url


class SincronizarCategoriaMatrizDTO(BaseModel):
    categoria_url: str
    codigo_revendedora: str = "padrao"


class SincronizarCategoriaMatrizResult(BaseModel):
    categoria_url: str
    adicionados: int
    atualizados: int
    removidos: int
    produtos: List[ProdutoMatriz]


class SincronizarCategoriaMatrizUseCase:
    """
    Sincroniza todos os produtos de uma categoria da loja matriz:
    adiciona novos, atualiza existentes e remove os que saíram da categoria.
    """

    def __init__(self, repository: IProdutoMatrizRepository, scraper: AtlanticaScraper):
        self.repository = repository
        self.scraper = scraper

    async def execute(self, dto: SincronizarCategoriaMatrizDTO) -> SincronizarCategoriaMatrizResult:
        canonical_category_url = AtlanticaScraper.normalize_category_url(dto.categoria_url)

        try:
            scraped_items = await self.scraper.fetch_category_products(canonical_category_url)
        except ValueError:
            raise
        except Exception as e:
            raise ValueError(f"Não foi possível sincronizar a categoria. Erro: {str(e)}")

        existentes_categoria = self.repository.list_by_categoria_origem(canonical_category_url)
        scraped_by_url = {item["url_origem"]: item for item in scraped_items if item.get("url_origem")}

        removidos = 0
        for prod in existentes_categoria:
            if prod.url_origem not in scraped_by_url:
                if self.repository.delete(prod.id):
                    removidos += 1

        adicionados = 0
        atualizados = 0
        salvos: List[ProdutoMatriz] = []

        for url_origem, item in scraped_by_url.items():
            url_afiliada = build_affiliate_url(url_origem, dto.codigo_revendedora)
            existente = self.repository.get_by_url_origem(url_origem)

            if existente:
                existente.nome = item["nome"]
                existente.preco = item["preco"]
                existente.imagem_url = item.get("imagem_url")
                existente.descricao = item.get("descricao")
                existente.url_afiliada = url_afiliada
                existente.categoria_origem = canonical_category_url
                existente.ativo = True
                salvos.append(self.repository.save(existente))
                atualizados += 1
            else:
                novo = ProdutoMatriz(
                    url_origem=url_origem,
                    url_afiliada=url_afiliada,
                    nome=item["nome"],
                    preco=item["preco"],
                    imagem_url=item.get("imagem_url"),
                    descricao=item.get("descricao"),
                    categoria_origem=canonical_category_url,
                )
                salvos.append(self.repository.save(novo))
                adicionados += 1

        return SincronizarCategoriaMatrizResult(
            categoria_url=canonical_category_url,
            adicionados=adicionados,
            atualizados=atualizados,
            removidos=removidos,
            produtos=salvos,
        )
