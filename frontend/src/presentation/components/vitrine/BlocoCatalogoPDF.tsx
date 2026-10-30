'use client';

import React from 'react';
import { FileText, Download, Eye, Sparkles } from 'lucide-react';
import { env } from '../../../infrastructure/config/env';
import { Button } from '../ui/Button';
import { AnalyticsTracker } from '../../../infrastructure/analytics/tracker';

export function BlocoCatalogoPDF() {
  const handleDownload = () => {
    AnalyticsTracker.track('download_catalogo_pdf');
  };

  return (
    <section className="py-12 sm:py-16 bg-brand-50/50 border-t border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl text-white p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Elementos Decorativos */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-700/20 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-gold-400/10 blur-2xl pointer-events-none" />

          {/* Textos */}
          <div className="max-w-xl relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-brand-100 mb-4 border border-white/10">
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>Campanha Vigente 2026</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-outfit tracking-tight">
              Catálogo Digital Completo
            </h2>

            <p className="mt-3 text-sm sm:text-base text-brand-100/90 leading-relaxed">
              Folheie todas as linhas de produtos, composições terapêuticas, aromas e lançamentos da Atlântica Natural no formato revista digital.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto">
            <a
              href={env.linkCatalogoPdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownload}
              className="w-full sm:w-auto"
            >
              <Button
                variant="gold"
                size="lg"
                className="w-full shadow-lg hover:shadow-xl font-bold"
              >
                <Download className="w-5 h-5" />
                <span>Baixar Catálogo PDF</span>
              </Button>
            </a>

            <a
              href="/catalogo"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Eye className="w-5 h-5" />
                <span>Visualizar na Tela</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

