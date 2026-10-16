import pytest
import httpx
from unittest.mock import AsyncMock, patch, MagicMock
from src.infrastructure.external.scraper import AtlanticaScraper

@pytest.fixture
def scraper():
    return AtlanticaScraper()

HTML_COMPLETO = """
<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Meta Óleo Essencial" />
    <meta property="og:image" content="https://exemplo.com/oleo.jpg" />
    <meta property="og:description" content="Descrição via OpenGraph" />
    <meta property="product:price:amount" content="49.90" />
</head>
<body>
    <h1>Óleo Essencial de Melaleuca</h1>
</body>
</html>
"""

HTML_SEM_OG_PRICE = """
<!DOCTYPE html>
<html>
<head>
    <meta property="og:image" content="https://exemplo.com/oleo.jpg" />
    <meta property="og:description" content="Descrição detalhada" />
</head>
<body>
    <h1>Óleo Essencial de Eucalipto</h1>
    <div class="preco-box">Por apenas R$ 38,50 no Pix</div>
</body>
</html>
"""

HTML_APENAS_OG_TITLE = """
<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Shampoo Natural da Terra" />
</head>
<body>
</body>
</html>
"""

@pytest.mark.anyio
async def test_fetch_product_data_sucesso_completo(scraper):
    mock_response = MagicMock()
    mock_response.text = HTML_COMPLETO
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_response
        
        dados = await scraper.fetch_product_data("https://atlanticanatural.com.br/produto-1")

        assert dados["nome"] == "Óleo Essencial de Melaleuca"
        assert dados["imagem_url"] == "https://exemplo.com/oleo.jpg"
        assert dados["descricao"] == "Descrição via OpenGraph"
        assert dados["preco"] == 49.90

@pytest.mark.anyio
async def test_fetch_product_data_preco_via_regex(scraper):
    mock_response = MagicMock()
    mock_response.text = HTML_SEM_OG_PRICE
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_response
        
        dados = await scraper.fetch_product_data("https://atlanticanatural.com.br/produto-2")

        assert dados["nome"] == "Óleo Essencial de Eucalipto"
        assert dados["preco"] == 38.50

@pytest.mark.anyio
async def test_fetch_product_data_og_title_fallback(scraper):
    mock_response = MagicMock()
    mock_response.text = HTML_APENAS_OG_TITLE
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_response
        
        dados = await scraper.fetch_product_data("https://atlanticanatural.com.br/produto-3")

        assert dados["nome"] == "Shampoo Natural da Terra"
        assert dados["preco"] == 0.0
        assert dados["imagem_url"] == ""

@pytest.mark.anyio
async def test_fetch_product_data_http_error(scraper):
    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.side_effect = httpx.ConnectError("Falha de conexão")
        
        with pytest.raises(Exception) as exc_info:
            await scraper.fetch_product_data("https://url-invalida.com.br")
        
        assert "Erro ao acessar a URL da matriz" in str(exc_info.value)
