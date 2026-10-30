'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShoppingBag, Leaf, FileText, UserCheck, Shield } from 'lucide-react';
import { useVitrine } from '../../context/VitrineContext';

export function Header() {
  const { isRegiaoConfirmada, cidadeConfirmada, abrirModalTrava, regiaoPadrao, sacola } =
    useVitrine();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo e Identidade */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-800 to-brand-950 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="font-outfit font-bold text-lg sm:text-xl text-brand-950 tracking-tight leading-none block">
              Atlântica Natural
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Vitrine & Pronta-Entrega
            </span>
          </div>
        </Link>

        {/* Barra Central / Trava Geográfica */}
        <div className="hidden md:flex items-center">
          <button
            onClick={abrirModalTrava}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isRegiaoConfirmada
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                : 'bg-amber-50/80 border-amber-300 text-amber-900 hover:bg-amber-100 animate-pulse'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isRegiaoConfirmada ? (
                <>
                  Entregando em: <strong>{cidadeConfirmada}</strong> (Alterar)
                </>
              ) : (
                <>
                  Verificando região: <strong>{regiaoPadrao}</strong>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Ações à Direita */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Trava Mobile */}
          <button
            onClick={abrirModalTrava}
            className="md:hidden p-2 rounded-xl border border-border text-foreground/80 hover:bg-muted"
            title="Alterar cidade"
            aria-label="Alterar cidade"
          >
            <MapPin className="w-5 h-5 text-brand-800" />
          </button>

          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-brand-900 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Catálogo
          </Link>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 px-3 py-1.5 sm:py-2 rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden xs:inline">Revista PDF</span>
          </Link>

          {/* Atalho Admin Discreto */}
          <Link
            href="/admin/login"
            className="p-2 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            title="Acesso Administrativo"
            aria-label="Acesso Administrativo"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

