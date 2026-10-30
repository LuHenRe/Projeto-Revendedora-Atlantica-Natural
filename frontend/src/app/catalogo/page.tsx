import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react';
import { Header } from '@/presentation/components/vitrine/Header';
import { Footer } from '@/presentation/components/common/Footer';
import { Button } from '@/presentation/components/ui/Button';
import { env } from '@/infrastructure/config/env';

export const metadata = {
  title: 'Catálogo Digital em PDF | Atlântica Natural',
  description: 'Visualize e baixe a revista digital completa da Atlântica Natural com todas as linhas de produtos.',
};

export default function CatalogoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navegação de Volta e Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-900 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para a vitrine
              </Link>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground font-outfit tracking-tight">
                Revista Digital Oficial
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Material completo da campanha vigente da Atlântica Natural.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a href={env.linkCatalogoPdf} target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="md" className="gap-2 font-bold shadow-sm">
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo PDF</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Visualizador / Card de Download */}
          <div className="rounded-3xl border border-border bg-white shadow-soft overflow-hidden p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-20 h-20 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-900 mb-6 shadow-xs border border-brand-200">
              <FileText className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-outfit max-w-md">
              Catálogo de Produtos e Bem-Estar Atlântica Natural
            </h2>

            <p className="mt-3 text-sm text-muted-foreground max-w-lg leading-relaxed">
              Para a melhor experiência de leitura no celular ou computador, você pode baixar o PDF oficial diretamente ou abrir no leitor do seu dispositivo.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href={env.linkCatalogoPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="default" size="lg" className="w-full gap-2">
                  <span>Abrir PDF em Nova Aba</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>

              <a
                href={env.linkCatalogoPdf}
                download="Catalogo_Atlantica_Natural.pdf"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  <span>Download Direto</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

