import {
  IProdutoMatrizRepository,
  CategoriaMatrizInfo,
  SincronizarCategoriaMatrizResult,
} from '../../domain/repositories/IProdutoMatrizRepository';
import { ProdutoMatriz } from '../../domain/entities/ProdutoMatriz';
import { Preco } from '../../domain/value-objects/Preco';
import { UrlExterna } from '../../domain/value-objects/UrlExterna';
import { HttpClient, httpClient } from './httpClient';

interface ProdutoMatrizBackendDTO {
  id: string;
  url_origem: string;
  url_afiliada: string;
  nome: string;
  preco: number;
  imagem_url?: string | null;
  descricao?: string | null;
  categoria_origem?: string | null;
  ativo: boolean;
}

interface SincronizarCategoriaBackendDTO {
  categoria_url: string;
  adicionados: number;
  atualizados: number;
  removidos: number;
  produtos: ProdutoMatrizBackendDTO[];
}

export class ProdutoMatrizRepositoryHttp implements IProdutoMatrizRepository {
  constructor(
    private readonly client: HttpClient = httpClient,
    private readonly tokenGetter?: () => string | undefined
  ) {}

  private mapToDomain(dto: ProdutoMatrizBackendDTO): ProdutoMatriz {
    return new ProdutoMatriz({
      id: dto.id,
      nome: dto.nome,
      preco: new Preco(dto.preco),
      urlOrigem: new UrlExterna(dto.url_origem),
      urlAfiliada: new UrlExterna(dto.url_afiliada),
      imagemUrl: dto.imagem_url,
      descricao: dto.descricao,
      categoriaOrigem: dto.categoria_origem ?? null,
      ativo: dto.ativo,
    });
  }

  private getToken(): string | undefined {
    return this.tokenGetter ? this.tokenGetter() : undefined;
  }

  async listarAtivos(): Promise<ProdutoMatriz[]> {
    const data = await this.client.get<ProdutoMatrizBackendDTO[]>('/produtos-matriz/');
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async adicionarDestaque(urlOrigem: string): Promise<ProdutoMatriz> {
    const token = this.getToken();
    const data = await this.client.post<ProdutoMatrizBackendDTO>(
      '/admin/produtos-matriz/',
      { url_origem: urlOrigem },
      { token }
    );
    return this.mapToDomain(data);
  }

  async removerDestaque(id: string): Promise<void> {
    const token = this.getToken();
    await this.client.delete(`/admin/produtos-matriz/${id}`, { token });
  }

  async listarCategorias(forceRefresh = false): Promise<CategoriaMatrizInfo[]> {
    const token = this.getToken();
    const data = await this.client.get<CategoriaMatrizInfo[]>(
      '/admin/produtos-matriz/categorias',
      {
        token,
        params: forceRefresh ? { refresh: true } : undefined,
      }
    );
    return data || [];
  }

  async sincronizarCategoria(categoriaUrl: string): Promise<SincronizarCategoriaMatrizResult> {
    const token = this.getToken();
    const data = await this.client.post<SincronizarCategoriaBackendDTO>(
      '/admin/produtos-matriz/sincronizar-categoria',
      { categoria_url: categoriaUrl },
      { token }
    );
    return {
      categoriaUrl: data.categoria_url,
      adicionados: data.adicionados,
      atualizados: data.atualizados,
      removidos: data.removidos,
      produtos: (data.produtos || []).map((item) => this.mapToDomain(item)),
    };
  }
}
