import { describe, it, expect, vi } from 'vitest';
import { AutenticarAdministradorUseCase } from './AutenticarAdministrador';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

describe('Caso de Uso: AutenticarAdministrador', () => {
  const fakeAuthRepo: IAuthRepository = {
    login: vi.fn(),
  };

  const useCase = new AutenticarAdministradorUseCase(fakeAuthRepo);

  it('deve realizar login chamando o repositório com as credenciais corretas', async () => {
    vi.mocked(fakeAuthRepo.login).mockResolvedValueOnce({
      access_token: 'fake-jwt-token-xyz',
      token_type: 'bearer',
    });

    const resultado = await useCase.execute({
      username: 'admin',
      password: 'password123',
    });

    expect(resultado.access_token).toBe('fake-jwt-token-xyz');
    expect(fakeAuthRepo.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'password123',
    });
  });

  it('deve lançar erro se o usuário for vazio', async () => {
    await expect(
      useCase.execute({
        username: '',
        password: 'password123',
      })
    ).rejects.toThrow('Usuário e senha são obrigatórios');
  });

  it('deve lançar erro se a senha for vazia', async () => {
    await expect(
      useCase.execute({
        username: 'admin',
        password: '',
      })
    ).rejects.toThrow('Usuário e senha são obrigatórios');
  });
});
