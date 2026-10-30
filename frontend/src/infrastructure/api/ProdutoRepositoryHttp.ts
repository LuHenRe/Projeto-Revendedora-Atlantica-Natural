import { IProdutoRepository, SalvarProdutoInput } from '../../domain/repositories/IProdutoRepository';
import { Produto } from '../../domain/entities/Produto';
import { Categoria } from '../../domain/entities/Categoria';
import { Preco } from '../../domain/value-objects/Preco';
import { HttpClient, httpClient } from './httpClient';

interface CategoriaBackendDTO {
  id: string;
  nome: string;
}

interface ProdutoBackendDTO {
  id: string;
  nome: string;
  preco: number;
  quantidade_estoque: number;
  categoria_id: string;
  imagem_url: string | null;
  ativo: boolean;
  categoria?: CategoriaBackendDTO | null;
}

export class ProdutoRepositoryHttp implements IProdutoRepository {
  constructor(
    private readonly client: HttpClient = httpClient,
    private readonly tokenGetter?: () => string | undefined
  ) {}

  private mapToDomain(dto: ProdutoBackendDTO): Produto {
    return new Produto({
      id: dto.id,
      nome: dto.nome,
      preco: new Preco(dto.preco),
      quantidadeEstoque: dto.quantidade_estoque,
      categoriaId: dto.categoria_id,
      imagemUrl: dto.imagem_url,
      ativo: dto.ativo,
      categoria: dto.categoria ? new Categoria(dto.categoria.id, dto.categoria.nome) : null,
    });
  }

  private getToken(): string | undefined {
    return this.tokenGetter ? this.tokenGetter() : undefined;
  }

  async listarAtivos(skip: number = 0, limit: number = 100): Promise<Produto[]> {
    const data = await this.client.get<ProdutoBackendDTO[]>('/produtos/', {
      params: { skip, limit },
    });
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async listarOfertasLocais(skip: number = 0, limit: number = 100): Promise<Produto[]> {
    const data = await this.client.get<ProdutoBackendDTO[]>('/produtos/ofertas-locais', {
      params: { skip, limit },
    });
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async obterPorId(id: string): Promise<Produto | null> {
    try {
      const data = await this.client.get<ProdutoBackendDTO>(`/produtos/${id}`);
      return this.mapToDomain(data);
    } catch (err: unknown) {
      return null;
    }
  }

  async salvar(produto: SalvarProdutoInput, id?: string): Promise<Produto> {
    const payload = {
      nome: produto.nome,
      preco: produto.preco,
      quantidade_estoque: produto.quantidadeEstoque,
      categoria_id: produto.categoriaId,
      imagem_url: produto.imagemUrl ?? null,
      ativo: produto.ativo ?? true,
    };

    const token = this.getToken();

    if (id) {
      const data = await this.client.put<ProdutoBackendDTO>(`/admin/produtos/${id}`, payload, {
        token,
      });
      return this.mapToDomain(data);
    } else {
      const data = await this.client.post<ProdutoBackendDTO>('/admin/produtos/', payload, {
        token,
      });
      return this.mapToDomain(data);
    }
  }

  async inativar(id: string): Promise<void> {
    const token = this.getToken();
    await this.client.delete(`/admin/produtos/${id}`, { token });
  }
}
