export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthToken>;
}
