import { ICategoriaRepository } from '../../domain/repositories/ICategoriaRepository';
import { Categoria } from '../../domain/entities/Categoria';
import { HttpClient, httpClient } from './httpClient';

interface CategoriaBackendDTO {
  id: string;
  nome: string;
}

export class CategoriaRepositoryHttp implements ICategoriaRepository {
  constructor(
    private readonly client: HttpClient = httpClient,
    private readonly tokenGetter?: () => string | undefined
  ) {}

  private mapToDomain(dto: CategoriaBackendDTO): Categoria {
    return new Categoria(dto.id, dto.nome);
  }

  private getToken(): string | undefined {
    return this.tokenGetter ? this.tokenGetter() : undefined;
  }

  async listar(skip: number = 0, limit: number = 100): Promise<Categoria[]> {
    const data = await this.client.get<CategoriaBackendDTO[]>('/categorias/', {
      params: { skip, limit },
    });
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async obterPorId(id: string): Promise<Categoria | null> {
    try {
      const data = await this.client.get<CategoriaBackendDTO>(`/categorias/${id}`);
      return this.mapToDomain(data);
    } catch {
      return null;
    }
  }

  async salvar(nome: string, id?: string): Promise<Categoria> {
    const token = this.getToken();
    if (id) {
      const data = await this.client.put<CategoriaBackendDTO>(
        `/admin/categorias/${id}`,
        { nome },
        { token }
      );
      return this.mapToDomain(data);
    } else {
      const data = await this.client.post<CategoriaBackendDTO>(
        '/admin/categorias/',
        { nome },
        { token }
      );
      return this.mapToDomain(data);
    }
  }

  async deletar(id: string): Promise<void> {
    const token = this.getToken();
    await this.client.delete(`/admin/categorias/${id}`, { token });
  }
}
