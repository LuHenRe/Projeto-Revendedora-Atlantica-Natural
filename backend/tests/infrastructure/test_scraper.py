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


HTML_LOJA_ATLANTICA = """
<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Atlântica Natural - Fragrância Athenna 15ml" />
    <meta property="og:image" content="https://s3.amazonaws.com/atlanticafiles/produtos/athenna.jpeg" />
    <meta property="og:description" content="" />
</head>
<body>
    <header>
        <p class="cart_total">R$ 0,00</p>
    </header>
    <div class="page-title">
        <h1>Fragrância Athenna 15ml</h1>
    </div>
    <div class="product_description">
        <h4 class="product_title">Fragrância Athenna 15ml</h4>
        <div class="product_price width_100">
            <span class="price">R$ 39,98</span>
        </div>
        <div class="pr_desc fs_14">Perfume exclusivo 15ml</div>
    </div>
</body>
</html>
"""


@pytest.mark.anyio
async def test_fetch_product_data_autenticado_loja_atlantica():
    auth_scraper = AtlanticaScraper(
        revendedora_url="https://loja.atlanticanatural.com.br/valescareis",
        username="usuario_teste",
        password="senha_teste",
    )

    mock_store_resp = MagicMock()
    mock_store_resp.raise_for_status = MagicMock()

    mock_login_resp = MagicMock()
    mock_login_resp.url = "https://loja.atlanticanatural.com.br/"
    mock_login_resp.raise_for_status = MagicMock()

    mock_product_resp = MagicMock()
    mock_product_resp.text = HTML_LOJA_ATLANTICA
    mock_product_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_get.side_effect = [mock_store_resp, mock_product_resp]
        mock_post.return_value = mock_login_resp

        dados = await auth_scraper.fetch_product_data(
            "https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml"
        )

        assert mock_get.call_count == 2
        assert mock_get.call_args_list[0].args[0] == "https://loja.atlanticanatural.com.br/valescareis"
        assert mock_get.call_args_list[1].args[0] == "https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml"
        mock_post.assert_awaited_once_with(
            "https://loja.atlanticanatural.com.br/clientes/login",
            data={
                "ReturnUrl": "",
                "Username": "usuario_teste",
                "Password": "senha_teste",
                "Remember": "true",
                "Remember_Hidden": "false",
            },
            timeout=15.0,
        )
        assert dados["nome"] == "Fragrância Athenna 15ml"
        assert dados["preco"] == 39.98
        assert dados["imagem_url"] == "https://s3.amazonaws.com/atlanticafiles/produtos/athenna.jpeg"
        assert dados["descricao"] == "Perfume exclusivo 15ml"


@pytest.mark.anyio
async def test_fetch_product_data_falha_login_credenciais_invalidas():
    auth_scraper = AtlanticaScraper(
        revendedora_url="https://loja.atlanticanatural.com.br/valescareis",
        username="usuario_invalido",
        password="senha_invalida",
    )

    mock_store_resp = MagicMock()
    mock_store_resp.raise_for_status = MagicMock()

    mock_login_resp = MagicMock()
    mock_login_resp.url = "https://loja.atlanticanatural.com.br/clientes/login"
    mock_login_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_get.return_value = mock_store_resp
        mock_post.return_value = mock_login_resp

        with pytest.raises(Exception) as exc_info:
            await auth_scraper.fetch_product_data(
                "https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml"
            )

        assert "Falha ao autenticar" in str(exc_info.value)


HTML_VISUALIZAR_MODAL = """
<div class="ajax_quick_view">
    <div class="product_img_box text-center">
        <img id="product_img" src="https://s3.amazonaws.com/atlanticafiles/produtos/creatina.png" alt="product_img1" />
    </div>
    <div class="product_description">
        <h4 class="product_title">
            <a href="https://loja.atlanticanatural.com.br/produtos/mastigavel-creatina-chiclete">
                MASTIGÁVEL CREATINA CHICLETE
            </a>
        </h4>
        <div class="product_price width_100">
            <span class="price">R$ 153,78</span>
        </div>
        <div class="pr_desc"></div>
    </div>
</div>
"""


@pytest.mark.anyio
async def test_fetch_product_data_visualizar_fallback_imagem_e_url_canonica():
    scraper = AtlanticaScraper(revendedora_url="", username="", password="")
    mock_resp = MagicMock()
    mock_resp.text = HTML_VISUALIZAR_MODAL
    mock_resp.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp

        dados = await scraper.fetch_product_data("https://loja.atlanticanatural.com.br/visualizar/375")

        assert dados["nome"] == "MASTIGÁVEL CREATINA CHICLETE"
        assert dados["preco"] == 153.78
        assert dados["imagem_url"] == "https://s3.amazonaws.com/atlanticafiles/produtos/creatina.png"
        assert dados["url_origem"] == "https://loja.atlanticanatural.com.br/produtos/mastigavel-creatina-chiclete"


HTML_HOME_CATEGORIAS = """
<html><body>
<nav>
    <a href="https://loja.atlanticanatural.com.br/produtos/categoria/academia/4?pagina=1&quantidade=9&ordenacao=Latest">Academia</a>
    <a href="https://loja.atlanticanatural.com.br/produtos/categoria/academia/4?pagina=1&quantidade=9&ordenacao=Latest">Academia</a>
    <a href="/produtos/categoria/chas/5?pagina=1&quantidade=9&ordenacao=Latest">Chás</a>
</nav>
</body></html>
"""


@pytest.mark.anyio
async def test_fetch_categories_sucesso():
    AtlanticaScraper._categories_cache.clear()
    scraper = AtlanticaScraper(
        revendedora_url="https://loja.atlanticanatural.com.br/valescareis",
        username="u",
        password="p",
    )

    mock_store = MagicMock()
    mock_store.raise_for_status = MagicMock()
    mock_login = MagicMock()
    mock_login.url = "https://loja.atlanticanatural.com.br/"
    mock_login.raise_for_status = MagicMock()
    mock_home = MagicMock()
    mock_home.text = HTML_HOME_CATEGORIAS
    mock_home.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_get.side_effect = [mock_store, mock_home]
        mock_post.return_value = mock_login

        cats = await scraper.fetch_categories()

        assert cats == [
            {"nome": "Academia", "url": "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"},
            {"nome": "Chás", "url": "https://loja.atlanticanatural.com.br/produtos/categoria/chas/5"},
        ]


HTML_CATEGORIA_ACADEMIA = """
<html><body>
<div class="shop_container">
    <div class="product">
        <div class="product_img">
            <a href="https://loja.atlanticanatural.com.br/produtos/mastigavel-creatina-chiclete">
                <img alt="MASTIGÁVEL CREATINA CHICLETE" src="https://s3.amazonaws.com/img1.png" />
            </a>
        </div>
        <div class="product_info">
            <h6 class="product_title"><a href="/visualizar/375">MASTIGÁVEL CREATINA CHICLETE</a></h6>
            <div class="product_price"><span class="price">R$ 153,78</span></div>
            <div class="pr_desc"></div>
        </div>
    </div>
    <div class="product">
        <div class="product_img">
            <a href="https://loja.atlanticanatural.com.br/produtos/mastigavel-creatina-maca-verde">
                <img alt="MASTIGÁVEL CREATINA MAÇÃ VERDE" src="https://s3.amazonaws.com/img2.png" />
            </a>
        </div>
        <div class="product_info">
            <h6 class="product_title"><a href="/visualizar/374">MASTIGÁVEL CREATINA MAÇÃ VERDE</a></h6>
            <div class="product_price"><span class="price">R$ 153,78</span></div>
            <div class="pr_desc">Sabor maçã verde</div>
        </div>
    </div>
</div>
</body></html>
"""


@pytest.mark.anyio
async def test_fetch_category_products_sucesso():
    scraper = AtlanticaScraper(revendedora_url="", username="", password="")
    mock_cat = MagicMock()
    mock_cat.text = HTML_CATEGORIA_ACADEMIA
    mock_cat.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_cat

        itens = await scraper.fetch_category_products(
            "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4?pagina=1&quantidade=9"
        )

        assert len(itens) == 2
        assert itens[0]["nome"] == "MASTIGÁVEL CREATINA CHICLETE"
        assert itens[0]["preco"] == 153.78
        assert itens[0]["url_origem"] == "https://loja.atlanticanatural.com.br/produtos/mastigavel-creatina-chiclete"
        assert itens[0]["categoria_origem"] == "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"
        assert itens[1]["descricao"] == "Sabor maçã verde"


@pytest.mark.anyio
async def test_fetch_category_products_pagina_invalida():
    scraper = AtlanticaScraper(revendedora_url="", username="", password="")
    mock_invalid = MagicMock()
    mock_invalid.text = "<html><body><h1>Não encontrado</h1></body></html>"
    mock_invalid.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_invalid

        with pytest.raises(ValueError) as exc_info:
            await scraper.fetch_category_products("https://loja.atlanticanatural.com.br/invalido")

        assert "categoria válida" in str(exc_info.value)
