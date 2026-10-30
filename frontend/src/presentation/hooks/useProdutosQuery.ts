'use client';

import { useQuery } from '@tanstack/react-query';
import { ProdutoRepositoryHttp } from '../../infrastructure/api/ProdutoRepositoryHttp';
import { CategoriaRepositoryHttp } from '../../infrastructure/api/CategoriaRepositoryHttp';
import { ProdutoMatrizRepositoryHttp } from '../../infrastructure/api/ProdutoMatrizRepositoryHttp';

const produtoRepo = new ProdutoRepositoryHttp();
const categoriaRepo = new CategoriaRepositoryHttp();
const matrizRepo = new ProdutoMatrizRepositoryHttp();

export function useOfertasLocaisQuery() {
  return useQuery({
    queryKey: ['produtos', 'ofertas-locais'],
    queryFn: () => produtoRepo.listarOfertasLocais(),
  });
}

export function useProdutosAtivosQuery(skip: number = 0, limit: number = 100) {
  return useQuery({
    queryKey: ['produtos', 'ativos', skip, limit],
    queryFn: () => produtoRepo.listarAtivos(skip, limit),
  });
}

export function useCategoriasQuery() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriaRepo.listar(),
  });
}

export function useDestaquesMatrizQuery() {
  return useQuery({
    queryKey: ['produtos-matriz', 'ativos'],
    queryFn: () => matrizRepo.listarAtivos(),
  });
}

