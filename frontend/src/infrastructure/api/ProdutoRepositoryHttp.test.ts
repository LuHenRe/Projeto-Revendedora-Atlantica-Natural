import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProdutoRepositoryHttp } from './ProdutoRepositoryHttp';
import { HttpClient } from './httpClient';

describe('Infraestrutura: ProdutoRepositoryHttp', () => {
  let fakeClient: HttpClient;
  let repo: ProdutoRepositoryHttp;

  beforeEach(() => {
    fakeClient = new HttpClient('https://api.teste.com');
    repo = new ProdutoRepositoryHttp(fakeClient, () => 'mock-token');
  });

  it('deve listar ofertas locais e mapear para Entidades Produto com Preço formatado', async () => {
    const mockBackendDtos = [
      {
        id: 'p-1',
        nome: 'Óleo de Lavanda',
        preco: 45.9,
        quantidade_estoque: 10,
        categoria_id: 'c-1',
        imagem_url: 'https://exemplo.com/foto.jpg',
        ativo: true,
        categoria: { id: 'c-1', nome: 'Óleos' },
      },
    ];

    vi.spyOn(fakeClient, 'get').mockResolvedValueOnce(mockBackendDtos);

    const produtos = await repo.listarOfertasLocais();

    expect(produtos).toHaveLength(1);
    expect(produtos[0].nome).toBe('Óleo de Lavanda');
    expect(produtos[0].preco.valor).toBe(45.9);
    expect(produtos[0].preco.formatado).toBe('R$\u00a045,90');
    expect(produtos[0].temEstoqueDisponivel()).toBe(true);
    expect(produtos[0].categoria?.nome).toBe('Óleos');
  });

  it('deve chamar POST /admin/produtos/ ao salvar um novo produto', async () => {
    const mockCreatedDto = {
      id: 'p-new',
      nome: 'Difusor',
      preco: 120,
      quantidade_estoque: 5,
      categoria_id: 'c-2',
      imagem_url: null,
      ativo: true,
    };

    vi.spyOn(fakeClient, 'post').mockResolvedValueOnce(mockCreatedDto);

    const produto = await repo.salvar({
      nome: 'Difusor',
      preco: 120,
      quantidadeEstoque: 5,
      categoriaId: 'c-2',
    });

    expect(produto.id).toBe('p-new');
    expect(fakeClient.post).toHaveBeenCalledWith(
      '/admin/produtos/',
      expect.objectContaining({
        nome: 'Difusor',
        preco: 120,
        quantidade_estoque: 5,
      }),
      expect.objectContaining({ token: 'mock-token' })
    );
  });

  it('deve chamar DELETE /admin/produtos/{id} ao inativar produto', async () => {
    vi.spyOn(fakeClient, 'delete').mockResolvedValueOnce(null);

    await repo.inativar('p-123');
    expect(fakeClient.delete).toHaveBeenCalledWith('/admin/produtos/p-123', {
      token: 'mock-token',
    });
  });
});
