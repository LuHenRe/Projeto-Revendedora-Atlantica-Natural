import pytest
from fastapi.testclient import TestClient

@pytest.fixture(scope="function")
def categoria_teste_id(client: TestClient, admin_token_headers):
    response = client.post(
        "/admin/categorias/",
        json={"nome": "Categoria Produto Teste"},
        headers=admin_token_headers
    )
    return response.json()["id"]

def test_criar_produto(client: TestClient, admin_token_headers, categoria_teste_id):
    produto_data = {
        "nome": "Óleo Teste",
        "preco": 55.50,
        "quantidade_estoque": 10,
        "ativo": True,
        "categoria_id": categoria_teste_id
    }
    response = client.post("/admin/produtos/", json=produto_data, headers=admin_token_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == "Óleo Teste"
    assert data["preco"] == 55.50

def test_listar_produtos_ativos(client: TestClient, admin_token_headers, categoria_teste_id):
    # Criar um ativo e um inativo
    client.post("/admin/produtos/", json={
        "nome": "Ativo", "preco": 10.0, "ativo": True, "categoria_id": categoria_teste_id
    }, headers=admin_token_headers)
    
    client.post("/admin/produtos/", json={
        "nome": "Inativo", "preco": 10.0, "ativo": False, "categoria_id": categoria_teste_id
    }, headers=admin_token_headers)

    response = client.get("/produtos/")
    assert response.status_code == 200
    data = response.json()
    
    # Valida que o ativo está na lista e o inativo não
    nomes = [p["nome"] for p in data]
    assert "Ativo" in nomes
    assert "Inativo" not in nomes

def test_exclusao_logica_produto(client: TestClient, admin_token_headers, categoria_teste_id):
    # Criar produto
    res_create = client.post("/admin/produtos/", json={
        "nome": "Para Excluir", "preco": 20.0, "ativo": True, "categoria_id": categoria_teste_id
    }, headers=admin_token_headers)
    prod_id = res_create.json()["id"]

    # Deletar
    res_delete = client.delete(f"/admin/produtos/{prod_id}", headers=admin_token_headers)
    assert res_delete.status_code == 204

    # Verificar que ativo é false tentando acessar pela rota publica (deve dar 404)
    res_get = client.get(f"/produtos/{prod_id}")
    assert res_get.status_code == 404

def test_ofertas_locais(client: TestClient, admin_token_headers, categoria_teste_id):
    # Com estoque
    client.post("/admin/produtos/", json={
        "nome": "Com Estoque", "preco": 10.0, "quantidade_estoque": 5, "ativo": True, "categoria_id": categoria_teste_id
    }, headers=admin_token_headers)
    
    # Sem estoque
    client.post("/admin/produtos/", json={
        "nome": "Sem Estoque", "preco": 10.0, "quantidade_estoque": 0, "ativo": True, "categoria_id": categoria_teste_id
    }, headers=admin_token_headers)

    res = client.get("/produtos/ofertas-locais")
    data = res.json()
    nomes = [p["nome"] for p in data]
    assert "Com Estoque" in nomes
    assert "Sem Estoque" not in nomes
