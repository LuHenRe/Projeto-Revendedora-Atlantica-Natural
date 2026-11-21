import React from 'react';
import { Header } from '@/presentation/components/vitrine/Header';
import { Footer } from '@/presentation/components/common/Footer';
import { ModalTravaGeografica } from '@/presentation/components/vitrine/ModalTravaGeografica';
import { BarraSacolaFlutuante } from '@/presentation/components/vitrine/BarraSacolaFlutuante';
import { ProdutoRepositoryHttp } from '@/infrastructure/api/ProdutoRepositoryHttp';
import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import type { ProdutoDTO } from '@/domain/entities/Produto';
import type { CategoriaDTO } from '@/domain/entities/Categoria';
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

interface ProdutosPageProps {
  searchParams?: Promise<{ busca?: string; categoria?: string }>;
}

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const { produtos, categorias } = await getDadosCatalogo();

  const produtosDTO: ProdutoDTO[] = produtos.map((p) => {
    const dto: ProdutoDTO =
      typeof p.toDTO === 'function' ? p.toDTO() : (p as unknown as ProdutoDTO);
    if (!dto.categoria && dto.categoriaId) {
      const cat = categorias.find((c) => c.id === dto.categoriaId);
      if (cat) {
        return {
          ...dto,
          categoria:
            typeof cat.toDTO === 'function' ? cat.toDTO() : (cat as unknown as CategoriaDTO),
        };
      }
    }
    return dto;
  });
  const categoriasDTO: CategoriaDTO[] = categorias.map((c) =>
    typeof c.toDTO === 'function' ? c.toDTO() : (c as unknown as CategoriaDTO)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10 sm:py-14 bg-background">
        <CatalogoInterativo
          produtosIniciais={produtosDTO}
          categorias={categoriasDTO}
          termoBuscaInicial={resolvedParams.busca || ''}
          categoriaIdInicial={resolvedParams.categoria || undefined}
        />
      </main>
      <Footer />
      <ModalTravaGeografica />
      <BarraSacolaFlutuante />
    </div>
  );
}

