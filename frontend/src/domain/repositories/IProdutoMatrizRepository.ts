import { ProdutoMatriz } from '../entities/ProdutoMatriz';

export interface IProdutoMatrizRepository {
  listarAtivos(): Promise<ProdutoMatriz[]>;
  adicionarDestaque(urlOrigem: string): Promise<ProdutoMatriz>;
  removerDestaque(id: string): Promise<void>;
}
