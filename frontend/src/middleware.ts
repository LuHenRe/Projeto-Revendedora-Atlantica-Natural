import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // Apenas intercepta rotas do painel administrativo
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    // Se estiver na tela de login mas já tiver token válido, redireciona para o dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Se tentar acessar qualquer página interna do admin sem token, redireciona para login
    if (!isLoginPage && !token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
