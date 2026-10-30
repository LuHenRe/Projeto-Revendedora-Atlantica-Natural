'use server';

import { revalidatePath } from 'next/cache';
import { getAdminTokenServer, ActionResult } from './authActions';
import { ProdutoRepositoryHttp } from '../api/ProdutoRepositoryHttp';
import { SalvarProdutoInput } from '../../domain/repositories/IProdutoRepository';

export async function salvarProdutoAction(
  input: SalvarProdutoInput,
  id?: string
): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const repo = new ProdutoRepositoryHttp(undefined, () => token);
    const produto = await repo.salvar(input, id);

    // Revalidação sob demanda (ISR) do Next.js
    revalidatePath('/');
    revalidatePath('/produtos');
    revalidatePath('/admin/produtos');

    return {
      success: true,
      data: {
        id: produto.id,
        nome: produto.nome,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao salvar produto';
    return { success: false, error: message };
  }
}

export async function inativarProdutoAction(id: string): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const repo = new ProdutoRepositoryHttp(undefined, () => token);
    await repo.inativar(id);

    revalidatePath('/');
    revalidatePath('/produtos');
    revalidatePath('/admin/produtos');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao inativar produto';
    return { success: false, error: message };
  }
}
