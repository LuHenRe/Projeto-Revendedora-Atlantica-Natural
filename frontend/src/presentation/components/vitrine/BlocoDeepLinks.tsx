'use client';

import React from 'react';
import { Sparkles, Globe, ArrowUpRight } from 'lucide-react';
import { ProdutoMatriz } from '../../../domain/entities/ProdutoMatriz';
import { CardProdutoMatriz } from './CardProdutoMatriz';

interface BlocoDeepLinksProps {
  destaquesMatriz: ProdutoMatriz[];
}

export function BlocoDeepLinks({ destaquesMatriz }: BlocoDeepLinksProps) {
  if (!destaquesMatriz || destaquesMatriz.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/40 via-white to-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <Globe className="w-4 h-4" />
              <span>Envio para Todo o Brasil</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground font-outfit tracking-tight">
              Destaques Oficiais da Matriz
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compre direto no site oficial da marca com entrega nacional e segurança garantida.
            </p>
          </div>

          <a
            href="https://atlanticanaturalbr.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/80 hover:bg-amber-100 transition-colors w-fit"
          >
            Ver loja completa na Matriz
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid de Produtos da Matriz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destaquesMatriz.map((produto) => (
            <CardProdutoMatriz key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </section>
  );
}

