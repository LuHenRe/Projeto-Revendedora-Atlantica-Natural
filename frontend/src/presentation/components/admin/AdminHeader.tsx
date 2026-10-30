'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, LogOut, Menu, X, Shield, Sparkles } from 'lucide-react';
import { logoutAction } from '@/infrastructure/actions/authActions';
import { Button } from '@/presentation/components/ui/Button';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminHeader({ onToggleSidebar, isSidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Alternar navegação"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-zinc-900 tracking-tight leading-none text-base block">
                Atlântica Natural
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold tracking-wider uppercase block">
                Painel da Revendedora
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200/60">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sessão Protegida</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-emerald-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <span>Ver Vitrine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-zinc-600 hover:text-red-600 hover:bg-red-50 text-xs font-medium gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

