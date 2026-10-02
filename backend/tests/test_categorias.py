from fastapi.testclient import TestClient

def test_criar_categoria_sem_autenticacao(client: TestClient):
    response = client.post("/admin/categorias/", json={"nome": "Nova Categoria"})
    assert response.status_code == 401

def test_criar_categoria_com_autenticacao(client: TestClient, admin_token_headers):
    response = client.post(
        "/admin/categorias/",
        json={"nome": "Óleos Essenciais"},
        headers=admin_token_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == "Óleos Essenciais"
    assert "id" in data

def test_listar_categorias(client: TestClient, admin_token_headers):
    # Primeiro criamos uma categoria
    client.post(
        "/admin/categorias/",
        json={"nome": "Aromaterapia"},
        headers=admin_token_headers
    )
    
    # Rota pública não precisa de header
    response = client.get("/categorias/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(cat["nome"] == "Aromaterapia" for cat in data)

def test_atualizar_categoria(client: TestClient, admin_token_headers):
    # Criar
    res_create = client.post(
        "/admin/categorias/",
        json={"nome": "Perfumes"},
        headers=admin_token_headers
    )
    cat_id = res_create.json()["id"]

    # Atualizar
    res_update = client.put(
        f"/admin/categorias/{cat_id}",
        json={"nome": "Perfumes Importados"},
        headers=admin_token_headers
    )
    assert res_update.status_code == 200
    assert res_update.json()["nome"] == "Perfumes Importados"

def test_deletar_categoria(client: TestClient, admin_token_headers):
    # Criar
    res_create = client.post(
        "/admin/categorias/",
        json={"nome": "Deletar-me"},
        headers=admin_token_headers
    )
    cat_id = res_create.json()["id"]

    # Deletar
    res_delete = client.delete(
        f"/admin/categorias/{cat_id}",
        headers=admin_token_headers
    )
    assert res_delete.status_code == 204

    # Verificar que sumiu
    res_get = client.get(f"/categorias/{cat_id}")
    assert res_get.status_code == 404
