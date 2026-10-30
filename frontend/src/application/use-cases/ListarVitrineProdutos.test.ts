import { describe, it, expect, vi } from 'vitest';
import { ListarVitrineProdutosUseCase } from './ListarVitrineProdutos';
import { IProdutoRepository } from '../../domain/repositories/IProdutoRepository';
import { IProdutoMatrizRepository } from '../../domain/repositories/IProdutoMatrizRepository';
import { Produto } from '../../domain/entities/Produto';
import { Preco } from '../../domain/value-objects/Preco';
import { ProdutoMatriz } from '../../domain/entities/ProdutoMatriz';
import { UrlExterna } from '../../domain/value-objects/UrlExterna';

describe('Caso de Uso: ListarVitrineProdutos (Vitrine Híbrida)', () => {
  const fakeProdutoRepo: IProdutoRepository = {
    listarAtivos: vi.fn(),
    listarOfertasLocais: vi.fn(),
    obterPorId: vi.fn(),
    salvar: vi.fn(),
    inativar: vi.fn(),
  };

  const fakeMatrizRepo: IProdutoMatrizRepository = {
    listarAtivos: vi.fn(),
    adicionarDestaque: vi.fn(),
    removerDestaque: vi.fn(),
  };

  const useCase = new ListarVitrineProdutosUseCase(fakeProdutoRepo, fakeMatrizRepo);

  it('deve orquestrar e retornar simultaneamente produtos locais e destaques da matriz', async () => {
    const mockProdutos = [
      new Produto({
        id: 'p-1',
        nome: 'Óleo Essencial',
        preco: new Preco(50),
        quantidadeEstoque: 4,
        categoriaId: 'c-1',
      }),
    ];

    const mockMatriz = [
      new ProdutoMatriz({
        id: 'm-1',
        nome: 'Perfume Matriz',
        preco: new Preco(180),
        urlOrigem: new UrlExterna('https://atlanticanaturalbr.com.br/perfume'),
        urlAfiliada: new UrlExterna('https://atlanticanaturalbr.com.br/perfume?ref=123'),
      }),
    ];

    vi.mocked(fakeProdutoRepo.listarOfertasLocais).mockResolvedValueOnce(mockProdutos);
    vi.mocked(fakeMatrizRepo.listarAtivos).mockResolvedValueOnce(mockMatriz);

    const vitrine = await useCase.execute();

    expect(vitrine.ofertasLocais).toHaveLength(1);
    expect(vitrine.ofertasLocais[0].nome).toBe('Óleo Essencial');
    expect(vitrine.destaquesMatriz).toHaveLength(1);
    expect(vitrine.destaquesMatriz[0].nome).toBe('Perfume Matriz');
  });
});
