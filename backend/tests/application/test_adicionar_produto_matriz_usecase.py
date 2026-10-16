import pytest
from unittest.mock import AsyncMock, MagicMock
from src.application.use_cases.adicionar_produto_matriz import (
    AdicionarProdutoMatrizUseCase,
    AdicionarProdutoMatrizDTO
)
from src.domain.entities.produto_matriz import ProdutoMatriz
from src.domain.repositories.i_produto_matriz_repository import IProdutoMatrizRepository
from src.infrastructure.external.scraper import AtlanticaScraper

@pytest.fixture
def mock_repo():
    return MagicMock(spec=IProdutoMatrizRepository)

@pytest.fixture
def mock_scraper():
    return MagicMock(spec=AtlanticaScraper)

@pytest.mark.anyio
async def test_adicionar_produto_matriz_sucesso(mock_repo, mock_scraper):
    mock_repo.get_by_url_origem.return_value = None
    mock_scraper.fetch_product_data = AsyncMock(return_value={
        "nome": "Colágeno Hidrolisado",
        "preco": 89.90,
        "imagem_url": "https://img.com/colageno.jpg",
        "descricao": "Melhora a firmeza da pele"
    })
    
    # Simula o save retornando o próprio produto salvo
    def mock_save(prod):
        return prod
    mock_repo.save.side_effect = mock_save

    use_case = AdicionarProdutoMatrizUseCase(mock_repo, mock_scraper)
    dto = AdicionarProdutoMatrizDTO(url_origem="https://atlanticanatural.com.br/colageno", codigo_revendedora="rev123")

    resultado = await use_case.execute(dto)

    assert resultado.nome == "Colágeno Hidrolisado"
    assert resultado.preco == 89.90
    assert "aff=rev123" in resultado.url_afiliada
    assert mock_repo.save.called

@pytest.mark.anyio
async def test_adicionar_produto_matriz_url_com_query_string(mock_repo, mock_scraper):
    mock_repo.get_by_url_origem.return_value = None
    mock_scraper.fetch_product_data = AsyncMock(return_value={
        "nome": "Produto Teste",
        "preco": 10.0,
        "imagem_url": "",
        "descricao": ""
    })
    mock_repo.save.side_effect = lambda prod: prod

    use_case = AdicionarProdutoMatrizUseCase(mock_repo, mock_scraper)
    dto = AdicionarProdutoMatrizDTO(url_origem="https://site.com/item?source=google", codigo_revendedora="padrao")

    resultado = await use_case.execute(dto)

    assert resultado.url_afiliada == "https://site.com/item?source=google&aff=padrao"

@pytest.mark.anyio
async def test_adicionar_produto_matriz_ja_existente(mock_repo, mock_scraper):
    produto_existente = ProdutoMatriz(
        url_origem="https://atlanticanatural.com.br/colageno",
        url_afiliada="https://atlanticanatural.com.br/colageno?aff=padrao",
        nome="Existente",
        preco=50.0
    )
    mock_repo.get_by_url_origem.return_value = produto_existente

    use_case = AdicionarProdutoMatrizUseCase(mock_repo, mock_scraper)
    dto = AdicionarProdutoMatrizDTO(url_origem="https://atlanticanatural.com.br/colageno")

    resultado = await use_case.execute(dto)

    assert resultado == produto_existente
    mock_scraper.fetch_product_data.assert_not_called()
    mock_repo.save.assert_not_called()

@pytest.mark.anyio
async def test_adicionar_produto_matriz_falha_scraping(mock_repo, mock_scraper):
    mock_repo.get_by_url_origem.return_value = None
    mock_scraper.fetch_product_data = AsyncMock(side_effect=Exception("Timeout"))

    use_case = AdicionarProdutoMatrizUseCase(mock_repo, mock_scraper)
    dto = AdicionarProdutoMatrizDTO(url_origem="https://atlanticanatural.com.br/erro")

    with pytest.raises(ValueError) as exc:
        await use_case.execute(dto)

    assert "Não foi possível obter os dados da url" in str(exc.value)

@pytest.mark.anyio
async def test_adicionar_produto_matriz_sem_titulo(mock_repo, mock_scraper):
    mock_repo.get_by_url_origem.return_value = None
    mock_scraper.fetch_product_data = AsyncMock(return_value={
        "nome": "",
        "preco": 0.0,
        "imagem_url": "",
        "descricao": ""
    })

    use_case = AdicionarProdutoMatrizUseCase(mock_repo, mock_scraper)
    dto = AdicionarProdutoMatrizDTO(url_origem="https://atlanticanatural.com.br/sem-titulo")

    with pytest.raises(ValueError) as exc:
        await use_case.execute(dto)

    assert "Não foi possível extrair o título do produto" in str(exc.value)
