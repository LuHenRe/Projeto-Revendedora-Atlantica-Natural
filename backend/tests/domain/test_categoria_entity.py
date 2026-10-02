import pytest
from uuid import uuid4
from src.domain.entities.categoria import Categoria

def test_criar_categoria_valida():
    id_cat = uuid4()
    categoria = Categoria(id=id_cat, nome="Óleos Essenciais")
    
    assert categoria.id == id_cat
    assert categoria.nome == "Óleos Essenciais"

def test_categoria_nao_pode_ter_nome_vazio():
    with pytest.raises(ValueError, match="O nome da categoria não pode ser vazio"):
        Categoria(id=uuid4(), nome="")
