import React from 'react';
import { Header } from '@/presentation/components/vitrine/Header';
import { HeroBanner } from '@/presentation/components/vitrine/HeroBanner';
import { BlocoEstoqueLocal } from '@/presentation/components/vitrine/BlocoEstoqueLocal';
import { BlocoDeepLinks } from '@/presentation/components/vitrine/BlocoDeepLinks';
import { BlocoCatalogoPDF } from '@/presentation/components/vitrine/BlocoCatalogoPDF';
import { BlocoB2B } from '@/presentation/components/vitrine/BlocoB2B';
import { Footer } from '@/presentation/components/common/Footer';
import { ModalTravaGeografica } from '@/presentation/components/vitrine/ModalTravaGeografica';
import { BarraSacolaFlutuante } from '@/presentation/components/vitrine/BarraSacolaFlutuante';
import { ProdutoRepositoryHttp } from '@/infrastructure/api/ProdutoRepositoryHttp';
import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import { ProdutoMatrizRepositoryHttp } from '@/infrastructure/api/ProdutoMatrizRepositoryHttp';

// Revalidação a cada 60 segundos (ISR)
export const revalidate = 60;

async function getDadosVitrine() {
  const produtoRepo = new ProdutoRepositoryHttp();
  const categoriaRepo = new CategoriaRepositoryHttp();
  const matrizRepo = new ProdutoMatrizRepositoryHttp();

  try {
    const [ofertasLocais, categorias, destaquesMatriz] = await Promise.all([
      produtoRepo.listarOfertasLocais().catch(() => []),
      categoriaRepo.listar().catch(() => []),
      matrizRepo.listarAtivos().catch(() => []),
    ]);

    return { ofertasLocais, categorias, destaquesMatriz };
  } catch {
    return { ofertasLocais: [], categorias: [], destaquesMatriz: [] };
  }
}

export default async function HomePage() {
  const { ofertasLocais, categorias, destaquesMatriz } = await getDadosVitrine();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <BlocoEstoqueLocal produtosIniciais={ofertasLocais} categorias={categorias} />
        <BlocoDeepLinks destaquesMatriz={destaquesMatriz} />
        <BlocoCatalogoPDF />
        <BlocoB2B />
      </main>
      <Footer />

      {/* Componentes Interativos Globais de Conversão */}
      <ModalTravaGeografica />
      <BarraSacolaFlutuante />
    </div>
  );
}
