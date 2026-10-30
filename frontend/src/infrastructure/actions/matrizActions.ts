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
        preco: produto.preco.valor,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao importar dados da matriz via scraping';
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
