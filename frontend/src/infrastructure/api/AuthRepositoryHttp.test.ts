import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthRepositoryHttp } from './AuthRepositoryHttp';
import { HttpClient } from './httpClient';

describe('Infraestrutura: AuthRepositoryHttp', () => {
  let fakeClient: HttpClient;
  let repo: AuthRepositoryHttp;

  beforeEach(() => {
    fakeClient = new HttpClient('https://api.teste.com');
    repo = new AuthRepositoryHttp(fakeClient);
  });

  it('deve enviar credenciais em x-www-form-urlencoded para POST /admin/login', async () => {
    const mockToken = { access_token: 'valid-jwt', token_type: 'bearer' };
    vi.spyOn(fakeClient, 'post').mockResolvedValueOnce(mockToken);

    const result = await repo.login({
      username: 'admin',
      password: 'secretpassword',
    });

    expect(result.access_token).toBe('valid-jwt');
    expect(fakeClient.post).toHaveBeenCalledWith(
      '/admin/login',
      expect.any(URLSearchParams),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
  });
});
