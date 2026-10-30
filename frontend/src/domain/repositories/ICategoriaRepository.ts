import { Categoria } from '../entities/Categoria';

export interface ICategoriaRepository {
  listar(skip?: number, limit?: number): Promise<Categoria[]>;
  obterPorId(id: string): Promise<Categoria | null>;
  salvar(nome: string, id?: string): Promise<Categoria>;
  deletar(id: string): Promise<void>;
}
