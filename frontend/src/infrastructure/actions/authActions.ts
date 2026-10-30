'use server';

import { cookies } from 'next/headers';
import { AuthRepositoryHttp } from '../api/AuthRepositoryHttp';
import { LoginCredentials } from '../../domain/repositories/IAuthRepository';

const COOKIE_NAME = 'admin_token';
const authRepo = new AuthRepositoryHttp();

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(credentials: LoginCredentials): Promise<ActionResult> {
  try {
    if (!credentials.username?.trim() || !credentials.password) {
      return { success: false, error: 'Usuário e senha são obrigatórios' };
    }

    const tokenResponse = await authRepo.login({
      username: credentials.username.trim(),
      password: credentials.password,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha na autenticação';
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return { success: true };
  } catch {
    return { success: false, error: 'Erro ao encerrar sessão' };
  }
}

export async function getAdminTokenServer(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}
