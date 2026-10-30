import { IAuthRepository, LoginCredentials, AuthToken } from '../../domain/repositories/IAuthRepository';

export class AutenticarAdministradorUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthToken> {
    if (!credentials.username || !credentials.username.trim() || !credentials.password) {
      throw new Error('Usuário e senha são obrigatórios');
    }

    return await this.authRepository.login({
      username: credentials.username.trim(),
      password: credentials.password,
    });
  }
}
