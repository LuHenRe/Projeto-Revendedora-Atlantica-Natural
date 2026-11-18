import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from src.application.use_cases.sincronizar_categoria_matriz import (
    SincronizarCategoriaMatrizUseCase,
    SincronizarCategoriaMatrizDTO,
)
from src.domain.entities.produto_matriz import ProdutoMatriz
from src.domain.repositories.i_produto_matriz_repository import IProdutoMatrizRepository
from src.infrastructure.external.scraper import AtlanticaScraper


@pytest.mark.anyio
async def test_sincronizar_categoria_adiciona_atualiza_e_remove():
    cat_url = "https://loja.atlanticanatural.com.br/produtos/categoria/academia/4"

    prod_mantido = ProdutoMatriz(
        id=uuid.uuid4(),
        url_origem="https://loja.atlanticanatural.com.br/produtos/creatina-1",
        url_afiliada="https://loja.atlanticanatural.com.br/produtos/creatina-1?aff=padrao",
        nome="Creatina Antiga",
        preco=100.0,
        categoria_origem=cat_url,
    )
    prod_removido = ProdutoMatriz(
        id=uuid.uuid4(),
        url_origem="https://loja.atlanticanatural.com.br/produtos/descontinuado",
        url_afiliada="https://loja.atlanticanatural.com.br/produtos/descontinuado?aff=padrao",
        nome="Produto Removido",
        preco=80.0,
        categoria_origem=cat_url,
    )

    mock_repo = MagicMock(spec=IProdutoMatrizRepository)
    mock_repo.list_by_categoria_origem.return_value = [prod_mantido, prod_removido]
    mock_repo.delete.return_value = True
    mock_repo.get_by_url_origem.side_effect = lambda u: (
        prod_mantido if u == prod_mantido.url_origem else None
    )
    mock_repo.save.side_effect = lambda p: p

    mock_scraper = MagicMock(spec=AtlanticaScraper)
    mock_scraper.fetch_category_products = AsyncMock(
        return_value=[
            {
                "nome": "Creatina Atualizada",
                "preco": 153.78,
                "imagem_url": "https://img.com/c1.png",
                "descricao": "Nova desc",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-1",
                "categoria_origem": cat_url,
            },
            {
                "nome": "Creatina Nova",
                "preco": 160.00,
                "imagem_url": "https://img.com/c2.png",
                "descricao": "",
                "url_origem": "https://loja.atlanticanatural.com.br/produtos/creatina-2",
                "categoria_origem": cat_url,
            },
        ]
    )

    use_case = SincronizarCategoriaMatrizUseCase(mock_repo, mock_scraper)
    result = await use_case.execute(
        SincronizarCategoriaMatrizDTO(categoria_url=f"{cat_url}?pagina=1&quantidade=9")
    )

    assert result.categoria_url == cat_url
    assert result.adicionados == 1
    assert result.atualizados == 1
    assert result.removidos == 1
    assert len(result.produtos) == 2
    mock_repo.delete.assert_called_once_with(prod_removido.id)
    assert any(p.id == prod_mantido.id and p.preco == 153.78 for p in result.produtos)
