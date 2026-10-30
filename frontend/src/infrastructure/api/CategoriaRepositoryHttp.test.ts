import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoriaRepositoryHttp } from './CategoriaRepositoryHttp';
import { HttpClient } from './httpClient';

describe('Infraestrutura: CategoriaRepositoryHttp', () => {
  let fakeClient: HttpClient;
  let repo: CategoriaRepositoryHttp;

  beforeEach(() => {
    fakeClient = new HttpClient('https://api.teste.com');
    repo = new CategoriaRepositoryHttp(fakeClient, () => 'mock-token');
  });

  it('deve listar categorias e mapear para entidades Categoria', async () => {
    vi.spyOn(fakeClient, 'get').mockResolvedValueOnce([
      { id: 'c-1', nome: 'Perfumaria' },
      { id: 'c-2', nome: 'Óleos' },
    ]);

    const categorias = await repo.listar();
    expect(categorias).toHaveLength(2);
    expect(categorias[0].nome).toBe('Perfumaria');
    expect(categorias[1].nome).toBe('Óleos');
  });

  it('deve criar uma nova categoria via POST /admin/categorias/', async () => {
    vi.spyOn(fakeClient, 'post').mockResolvedValueOnce({ id: 'c-3', nome: 'Nutracêuticos' });

    const nova = await repo.salvar('Nutracêuticos');
    expect(nova.id).toBe('c-3');
    expect(nova.nome).toBe('Nutracêuticos');
    expect(fakeClient.post).toHaveBeenCalledWith(
      '/admin/categorias/',
      { nome: 'Nutracêuticos' },
      expect.objectContaining({ token: 'mock-token' })
    );
  });
});
