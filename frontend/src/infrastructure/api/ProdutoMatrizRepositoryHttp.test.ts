import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProdutoMatrizRepositoryHttp } from './ProdutoMatrizRepositoryHttp';
import { HttpClient } from './httpClient';

describe('Infraestrutura: ProdutoMatrizRepositoryHttp', () => {
  let fakeClient: HttpClient;
  let repo: ProdutoMatrizRepositoryHttp;

  beforeEach(() => {
    fakeClient = new HttpClient('https://api.teste.com');
    repo = new ProdutoMatrizRepositoryHttp(fakeClient, () => 'mock-token');
  });

  it('deve listar destaques da matriz e mapear URLs de afiliadas para UrlExterna', async () => {
    const mockMatrizDtos = [
      {
        id: 'm-1',
        url_origem: 'https://atlanticanaturalbr.com.br/produto/shake',
        url_afiliada: 'https://atlanticanaturalbr.com.br/produto/shake?ref=revendedora123',
        nome: 'Shake de Baunilha',
        preco: 95.0,
        imagem_url: 'https://exemplo.com/shake.jpg',
        descricao: 'Shake nutritivo',
        ativo: true,
      },
    ];

    vi.spyOn(fakeClient, 'get').mockResolvedValueOnce(mockMatrizDtos);

    const destaques = await repo.listarAtivos();

    expect(destaques).toHaveLength(1);
    expect(destaques[0].nome).toBe('Shake de Baunilha');
    expect(destaques[0].preco.valor).toBe(95.0);
    expect(destaques[0].urlAfiliada.valor).toContain('ref=revendedora123');
  });

  it('deve enviar URL no body para acionar web scraping e retornar novo produto', async () => {
    const mockCreatedDto = {
      id: 'm-2',
      url_origem: 'https://atlanticanaturalbr.com.br/produto/colageno',
      url_afiliada: 'https://atlanticanaturalbr.com.br/produto/colageno?ref=revendedora123',
      nome: 'Colágeno',
      preco: 110.0,
      imagem_url: null,
      descricao: null,
      ativo: true,
    };

    vi.spyOn(fakeClient, 'post').mockResolvedValueOnce(mockCreatedDto);

    const result = await repo.adicionarDestaque('https://atlanticanaturalbr.com.br/produto/colageno');

    expect(result.id).toBe('m-2');
    expect(fakeClient.post).toHaveBeenCalledWith(
      '/admin/produtos-matriz/',
      { url_origem: 'https://atlanticanaturalbr.com.br/produto/colageno' },
      expect.objectContaining({ token: 'mock-token' })
    );
  });
});
