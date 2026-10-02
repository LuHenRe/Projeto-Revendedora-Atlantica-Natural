from fastapi.testclient import TestClient
from src.core.config import settings

def test_login_admin_success(client: TestClient):
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/admin/login", data=login_data)
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert tokens["token_type"] == "bearer"

def test_login_admin_invalid_password(client: TestClient):
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": "wrongpassword123",
    }
    response = client.post("/admin/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Usuário ou senha incorretos"
