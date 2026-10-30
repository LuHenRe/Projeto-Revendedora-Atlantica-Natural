import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

describe('Segurança: Middleware de Autenticação /admin', () => {
  it('deve redirecionar para /admin/login quando usuário não autenticado tentar acessar /admin/dashboard', () => {
    const request = new NextRequest('http://localhost:3000/admin/dashboard');

    const response = middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/admin/login?redirect=%2Fadmin%2Fdashboard');
  });

  it('deve permitir acesso a rotas do admin quando possuir cookie admin_token', () => {
    const request = new NextRequest('http://localhost:3000/admin/dashboard', {
      headers: {
        cookie: 'admin_token=jwt-valido-12345',
      },
    });

    const response = middleware(request);

    // Deve passar direto sem redirecionar para login
    expect(response.headers.get('location')).toBeNull();
  });

  it('deve permitir acesso desautenticado à página /admin/login', () => {
    const request = new NextRequest('http://localhost:3000/admin/login');

    const response = middleware(request);

    expect(response.headers.get('location')).toBeNull();
  });

  it('deve redirecionar usuário autenticado de /admin/login para /admin/dashboard', () => {
    const request = new NextRequest('http://localhost:3000/admin/login', {
      headers: {
        cookie: 'admin_token=jwt-valido-12345',
      },
    });

    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/admin/dashboard');
  });

  it('deve permitir passagem livre para rotas públicas (ex: /, /produtos)', () => {
    const request = new NextRequest('http://localhost:3000/produtos');

    const response = middleware(request);

    expect(response.headers.get('location')).toBeNull();
  });
});

