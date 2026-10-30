import { Produto } from '../entities/Produto';

export interface SalvarProdutoInput {
  nome: string;
  preco: number;
  quantidadeEstoque: number;
  categoriaId: string;
  imagemUrl?: string | null;
  ativo?: boolean;
}

export interface IProdutoRepository {
  listarAtivos(skip?: number, limit?: number): Promise<Produto[]>;
  listarOfertasLocais(skip?: number, limit?: number): Promise<Produto[]>;
  obterPorId(id: string): Promise<Produto | null>;
  salvar(produto: SalvarProdutoInput, id?: string): Promise<Produto>;
  inativar(id: string): Promise<void>;
}
