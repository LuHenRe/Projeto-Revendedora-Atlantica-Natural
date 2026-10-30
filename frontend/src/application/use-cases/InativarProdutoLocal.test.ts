import { describe, it, expect, vi } from 'vitest';
import { InativarProdutoLocalUseCase } from './InativarProdutoLocal';
import { IProdutoRepository } from '../../domain/repositories/IProdutoRepository';

describe('Caso de Uso: InativarProdutoLocal (Exclusão Lógica)', () => {
  const fakeProdutoRepo: IProdutoRepository = {
    listarAtivos: vi.fn(),
    listarOfertasLocais: vi.fn(),
    obterPorId: vi.fn(),
    salvar: vi.fn(),
    inativar: vi.fn(),
  };

  const useCase = new InativarProdutoLocalUseCase(fakeProdutoRepo);

  it('deve chamar o repositório para inativar o produto por ID', async () => {
    vi.mocked(fakeProdutoRepo.inativar).mockResolvedValueOnce();

    await useCase.execute('prod-123');
    expect(fakeProdutoRepo.inativar).toHaveBeenCalledWith('prod-123');
  });

  it('deve lançar erro se o ID for vazio', async () => {
    await expect(useCase.execute('')).rejects.toThrow('ID do produto é obrigatório');
  });
});
