import pytest
from uuid import uuid4
from src.domain.entities.produto import Produto

def test_criar_produto_valido():
    cat_id = uuid4()
    produto = Produto(
        id=uuid4(),
        nome="Óleo de Lavanda",
        preco=45.90,
        quantidade_estoque=10,
        categoria_id=cat_id
    )
    
    assert produto.nome == "Óleo de Lavanda"
    assert produto.ativo is True
    assert produto.em_estoque() is True

def test_produto_nao_pode_ter_preco_negativo():
    with pytest.raises(ValueError, match="O preço não pode ser negativo"):
        Produto(id=uuid4(), nome="Teste", preco=-10.0, categoria_id=uuid4())

def test_inativar_produto():
    produto = Produto(id=uuid4(), nome="Teste", preco=10.0, categoria_id=uuid4())
    assert produto.ativo is True
    
    produto.inativar()
    assert produto.ativo is False

def test_ativar_produto():
    produto = Produto(id=uuid4(), nome="Teste", preco=10.0, categoria_id=uuid4(), ativo=False)
    assert produto.ativo is False
    
    produto.ativar()
    assert produto.ativo is True

def test_verificar_se_produto_tem_oferta_local():
    produto1 = Produto(id=uuid4(), nome="Com Estoque", preco=10.0, quantidade_estoque=5, categoria_id=uuid4())
    assert produto1.tem_oferta_local() is True
    
    produto2 = Produto(id=uuid4(), nome="Sem Estoque", preco=10.0, quantidade_estoque=0, categoria_id=uuid4())
    assert produto2.tem_oferta_local() is False
    
    produto3 = Produto(id=uuid4(), nome="Inativo", preco=10.0, quantidade_estoque=5, categoria_id=uuid4(), ativo=False)
    assert produto3.tem_oferta_local() is False
