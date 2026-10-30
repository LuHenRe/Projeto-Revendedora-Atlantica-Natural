import React from 'react';
import { Header } from '@/presentation/components/vitrine/Header';
import { Footer } from '@/presentation/components/common/Footer';
import { ModalTravaGeografica } from '@/presentation/components/vitrine/ModalTravaGeografica';
import { BarraSacolaFlutuante } from '@/presentation/components/vitrine/BarraSacolaFlutuante';
import { ProdutoRepositoryHttp } from '@/infrastructure/api/ProdutoRepositoryHttp';
import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import { CatalogoInterativo } from './CatalogoInterativo';

export const revalidate = 60;

export const metadata = {
  title: 'Catálogo de Produtos | Atlântica Natural',
  description: 'Explore todos os produtos ativos disponíveis em nosso estoque de pronta-entrega.',
};

async function getDadosCatalogo() {
  const produtoRepo = new ProdutoRepositoryHttp();
  const categoriaRepo = new CategoriaRepositoryHttp();

  try {
    const [produtos, categorias] = await Promise.all([
      produtoRepo.listarAtivos(0, 100).catch(() => []),
      categoriaRepo.listar().catch(() => []),
    ]);
    return { produtos, categorias };
  } catch {
    return { produtos: [], categorias: [] };
  }
}

export default async function ProdutosPage() {
  const { produtos, categorias } = await getDadosCatalogo();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10 sm:py-14 bg-background">
        <CatalogoInterativo produtosIniciais={produtos} categorias={categorias} />
      </main>
      <Footer />
      <ModalTravaGeografica />
      <BarraSacolaFlutuante />
    </div>
  );
}

