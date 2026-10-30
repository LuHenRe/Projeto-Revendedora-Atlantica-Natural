import { IAuthRepository, LoginCredentials, AuthToken } from '../../domain/repositories/IAuthRepository';
import { HttpClient, httpClient } from './httpClient';

export class AuthRepositoryHttp implements IAuthRepository {
  constructor(private readonly client: HttpClient = httpClient) {}

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const data = await this.client.post<AuthToken>('/admin/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  }
}
