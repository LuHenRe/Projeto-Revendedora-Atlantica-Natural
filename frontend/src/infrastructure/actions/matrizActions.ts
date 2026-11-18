'use server';

import { revalidatePath } from 'next/cache';
import { getAdminTokenServer, ActionResult } from './authActions';
import { ProdutoMatrizRepositoryHttp } from '../api/ProdutoMatrizRepositoryHttp';

export async function adicionarDestaqueMatrizAction(urlOrigem: string): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    if (!urlOrigem || !urlOrigem.trim()) {
      return { success: false, error: 'A URL do produto é obrigatória' };
    }

    const repo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    const produto = await repo.adicionarDestaque(urlOrigem.trim());

    revalidatePath('/');
    revalidatePath('/admin/produtos-matriz');

    return {
      success: true,
      data: {
        id: produto.id,
        nome: produto.nome,
        preco: {
          valor: produto.preco.valor,
          formatado: produto.preco.formatado,
        },
        imagemUrl: produto.imagemUrl || '',
        urlOrigem: produto.urlOrigem.valor,
        urlAfiliada: produto.urlAfiliada.valor,
        categoriaOrigem: produto.categoriaOrigem,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao importar dados da matriz via scraping';
    return { success: false, error: message };
  }
}

export async function listarCategoriasMatrizAction(forceRefresh = false): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const repo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    const categorias = await repo.listarCategorias(forceRefresh);

    return { success: true, data: categorias };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao listar categorias da loja oficial';
    return { success: false, error: message };
  }
}

export async function sincronizarCategoriaMatrizAction(categoriaUrl: string): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    if (!categoriaUrl || !categoriaUrl.trim()) {
      return { success: false, error: 'Selecione ou informe uma categoria válida' };
    }

    const repo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    const resultado = await repo.sincronizarCategoria(categoriaUrl.trim());

    revalidatePath('/');
    revalidatePath('/admin/produtos-matriz');

    return {
      success: true,
      data: {
        categoriaUrl: resultado.categoriaUrl,
        adicionados: resultado.adicionados,
        atualizados: resultado.atualizados,
        removidos: resultado.removidos,
        produtos: resultado.produtos.map((produto) => ({
          id: produto.id,
          nome: produto.nome,
          preco: {
            valor: produto.preco.valor,
            formatado: produto.preco.formatado,
          },
          imagemUrl: produto.imagemUrl || '',
          urlOrigem: produto.urlOrigem.valor,
          urlAfiliada: produto.urlAfiliada.valor,
          categoriaOrigem: produto.categoriaOrigem,
        })),
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao sincronizar categoria da matriz';
    return { success: false, error: message };
  }
}

export async function removerDestaqueMatrizAction(id: string): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const repo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    await repo.removerDestaque(id);

    revalidatePath('/');
    revalidatePath('/admin/produtos-matriz');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao remover destaque da matriz';
    return { success: false, error: message };
  }
}
