import pytest
import uuid
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

def test_listar_produtos_matriz_vazio(client: TestClient):
    response = client.get("/produtos-matriz/")
    assert response.status_code == 200
    assert response.json() == []

def test_adicionar_produto_matriz_autenticado(client: TestClient, admin_token_headers):
    mock_dados = {
        "nome": "Produto Scraping Sucesso",
        "preco": 120.0,
        "imagem_url": "https://img.com/prod.jpg",
        "descricao": "Descricao top"
    }

    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_product_data", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = mock_dados
        
        response = client.post(
            "/admin/produtos-matriz/",
            json={"url_origem": "https://loja.atlanticanatural.com.br/produto-teste"},
            headers=admin_token_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Produto Scraping Sucesso"
        assert data["preco"] == 120.0
        assert "url_afiliada" in data

def test_adicionar_produto_matriz_erro_validacao(client: TestClient, admin_token_headers):
    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_product_data", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.side_effect = Exception("Erro de conexão ao portal")

        response = client.post(
            "/admin/produtos-matriz/",
            json={"url_origem": "https://loja.atlanticanatural.com.br/produto-invalido"},
            headers=admin_token_headers
        )

        assert response.status_code == 400
        assert "detail" in response.json()

def test_remover_produto_matriz(client: TestClient, admin_token_headers):
    mock_dados = {
        "nome": "Para Deletar",
        "preco": 50.0,
        "imagem_url": "",
        "descricao": ""
    }

    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_product_data", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = mock_dados
        res_create = client.post(
            "/admin/produtos-matriz/",
            json={"url_origem": "https://loja.atlanticanatural.com.br/para-deletar"},
            headers=admin_token_headers
        )
        prod_id = res_create.json()["id"]

    # Deletar existente
    res_delete = client.delete(f"/admin/produtos-matriz/{prod_id}", headers=admin_token_headers)
    assert res_delete.status_code == 204

    # Deletar não existente (404)
    res_not_found = client.delete(f"/admin/produtos-matriz/{uuid.uuid4()}", headers=admin_token_headers)
    assert res_not_found.status_code == 404


def test_listar_categorias_matriz(client: TestClient, admin_token_headers):
    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_categories", new_callable=AsyncMock) as mock_cats:
        mock_cats.return_value = [
            {"nome": "Academia", "url": "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"}
        ]
        res = client.get("/admin/produtos-matriz/categorias", headers=admin_token_headers)
        assert res.status_code == 200
        assert res.json() == [
            {"nome": "Academia", "url": "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"}
        ]


def test_sincronizar_categoria_matriz_adicionar_atualizar_remover(client: TestClient, admin_token_headers):
    cat_url = "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"

    # 1a sincronização: adiciona 2 produtos
    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_category_products", new_callable=AsyncMock) as mock_cat:
        mock_cat.return_value = [
            {
                "nome": "Creatina 1",
                "preco": 150.0,
                "imagem_url": "https://img.com/1.png",
                "descricao": "",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-1",
                "categoria_origem": cat_url,
            },
            {
                "nome": "Creatina 2",
                "preco": 155.0,
                "imagem_url": "https://img.com/2.png",
                "descricao": "",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-2",
                "categoria_origem": cat_url,
            },
        ]
        res1 = client.post(
            "/admin/produtos-matriz/sincronizar-categoria",
            json={"categoria_url": cat_url},
            headers=admin_token_headers,
        )
        assert res1.status_code == 200
        body1 = res1.json()
        assert body1["adicionados"] == 2
        assert body1["atualizados"] == 0
        assert body1["removidos"] == 0

    # 2a sincronização: atualiza Creatina 1, remove Creatina 2 e adiciona Creatina 3
    with patch("src.infrastructure.external.scraper.AtlanticaScraper.fetch_category_products", new_callable=AsyncMock) as mock_cat:
        mock_cat.return_value = [
            {
                "nome": "Creatina 1 Atualizada",
                "preco": 153.78,
                "imagem_url": "https://img.com/1.png",
                "descricao": "Nova",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-1",
                "categoria_origem": cat_url,
            },
            {
                "nome": "Creatina 3",
                "preco": 170.0,
                "imagem_url": "https://img.com/3.png",
                "descricao": "",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-3",
                "categoria_origem": cat_url,
            },
        ]
        res2 = client.post(
            "/admin/produtos-matriz/sincronizar-categoria",
            json={"categoria_url": cat_url},
            headers=admin_token_headers,
        )
        assert res2.status_code == 200
        body2 = res2.json()
        assert body2["adicionados"] == 1
        assert body2["atualizados"] == 1
        assert body2["removidos"] == 1

    ativos = client.get("/produtos-matriz/").json()
    nomes = {p["nome"] for p in ativos}
    assert "Creatina 1 Atualizada" in nomes
    assert "Creatina 3" in nomes
    assert "Creatina 2" not in nomes
    assert "Produto Scraping Sucesso" in nomes
