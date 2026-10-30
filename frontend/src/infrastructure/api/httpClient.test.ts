import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient, ApiError } from './httpClient';

describe('Infraestrutura: HttpClient', () => {
  const mockBaseUrl = 'https://api.teste.com';
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient(mockBaseUrl);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve realizar requisição GET e retornar JSON com sucesso', async () => {
    const mockData = { id: 1, nome: 'Produto Teste' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await client.get<{ id: number; nome: string }>('/produtos');
    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.teste.com/produtos',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('deve injetar token Authorization quando fornecido', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await client.get('/admin/produtos', { token: 'jwt-123' });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.teste.com/admin/produtos',
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
  });

  it('deve anexar query params corretamente', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await client.get('/produtos', { params: { skip: 10, limit: 20 } });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.teste.com/produtos?skip=10&limit=20',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('deve lançar ApiError com mensagem do backend em caso de status 400+', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Item não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(client.get('/produtos/999')).rejects.toThrow('Item não encontrado');
  });

  it('deve retornar null para status 204 No Content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, {
        status: 204,
      })
    );

    const result = await client.delete('/produtos/123');
    expect(result).toBeNull();
  });
});
