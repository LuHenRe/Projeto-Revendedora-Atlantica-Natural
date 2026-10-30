import { IProdutoRepository } from '../../domain/repositories/IProdutoRepository';

export class InativarProdutoLocalUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || !id.trim()) {
      throw new Error('ID do produto é obrigatório');
    }
    await this.produtoRepository.inativar(id.trim());
  }
}
