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
