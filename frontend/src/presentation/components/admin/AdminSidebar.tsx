'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '@/presentation/utils/cn';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    label: 'Visão Geral',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Estoque Local',
    href: '/admin/produtos',
    icon: Package,
  },
  {
    label: 'Categorias',
    href: '/admin/categorias',
    icon: Tag,
  },
  {
    label: 'Destaques da Matriz',
    href: '/admin/produtos-matriz',
    icon: Sparkles,
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay no mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-zinc-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 pt-16 md:pt-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Navegação Principal
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-emerald-700' : 'text-zinc-400'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200/50">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Dica de Conversão</span>
          </div>
          <p className="text-[11px] text-emerald-800/80 leading-relaxed">
            Mantenha seu estoque físico sempre atualizado para garantir que as clientes recebam prontamente pelo WhatsApp.
          </p>
        </div>
      </aside>
    </>
  );
}

