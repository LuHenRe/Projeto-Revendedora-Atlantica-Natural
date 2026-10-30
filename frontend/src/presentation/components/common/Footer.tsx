import React from 'react';
import Link from 'next/link';
import { Leaf, Shield, Lock } from 'lucide-react';
import { env } from '../../../infrastructure/config/env';

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white/90 pt-16 pb-24 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Coluna 1: Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-outfit font-bold text-xl text-white tracking-tight">
                Atlântica Natural
              </span>
            </div>
            <p className="text-sm text-brand-200/80 max-w-md leading-relaxed">
              Hub Híbrido de Curadoria e Pronta-Entrega oficial da revendedora autorizada.
              Produtos 100% originais com foco em saúde, aromaterapia e cosméticos de alta performance.
            </p>
            <div className="text-xs text-brand-300/70">
              Região de Atendimento Pronta-Entrega: <strong>{env.cidadeAtendimento}</strong>.
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-brand-200/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Revista Digital PDF
                </Link>
              </li>
              <li>
                <a
                  href={env.linkRecrutamentoB2b}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Seja Revendedora (B2B)
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional e Segurança */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">
              Segurança
            </h4>
            <div className="space-y-3 text-xs text-brand-200/80 leading-relaxed">
              <p>
                Todos os dados e pedidos são intermediados por canal direto oficial de WhatsApp com
                atendimento humano.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-white transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Área Administrativa</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-300/60 text-center sm:text-left">
          <p>© {ano} Vitrine Virtual Atlântica Natural. Todos os direitos reservados.</p>
          <p>Desenvolvido com Clean Architecture, Next.js e TypeScript.</p>
        </div>
      </div>
    </footer>
  );
}

