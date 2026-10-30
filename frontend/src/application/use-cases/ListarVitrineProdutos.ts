import { IProdutoRepository } from '../../domain/repositories/IProdutoRepository';
import { IProdutoMatrizRepository } from '../../domain/repositories/IProdutoMatrizRepository';
import { Produto } from '../../domain/entities/Produto';
import { ProdutoMatriz } from '../../domain/entities/ProdutoMatriz';

export interface VitrineDTO {
  ofertasLocais: Produto[];
  destaquesMatriz: ProdutoMatriz[];
}

export class ListarVitrineProdutosUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly produtoMatrizRepository: IProdutoMatrizRepository
  ) {}

  async execute(): Promise<VitrineDTO> {
    const [ofertasLocais, destaquesMatriz] = await Promise.all([
      this.produtoRepository.listarOfertasLocais(),
      this.produtoMatrizRepository.listarAtivos(),
    ]);

    return {
      ofertasLocais,
      destaquesMatriz,
    };
  }
}
