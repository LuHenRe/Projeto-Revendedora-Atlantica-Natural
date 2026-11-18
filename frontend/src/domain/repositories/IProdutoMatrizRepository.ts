import { ProdutoMatriz } from '../entities/ProdutoMatriz';

export interface CategoriaMatrizInfo {
  nome: string;
  url: string;
}

export interface SincronizarCategoriaMatrizResult {
  categoriaUrl: string;
  adicionados: number;
  atualizados: number;
  removidos: number;
  produtos: ProdutoMatriz[];
}

export interface IProdutoMatrizRepository {
  listarAtivos(): Promise<ProdutoMatriz[]>;
  adicionarDestaque(urlOrigem: string): Promise<ProdutoMatriz>;
  removerDestaque(id: string): Promise<void>;
  listarCategorias(forceRefresh?: boolean): Promise<CategoriaMatrizInfo[]>;
  sincronizarCategoria(categoriaUrl: string): Promise<SincronizarCategoriaMatrizResult>;
}
