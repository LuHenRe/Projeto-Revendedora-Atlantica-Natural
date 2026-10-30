'use server';

import { revalidatePath } from 'next/cache';
import { getAdminTokenServer, ActionResult } from './authActions';
import { CategoriaRepositoryHttp } from '../api/CategoriaRepositoryHttp';

export async function salvarCategoriaAction(
  nome: string,
  id?: string
): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    if (!nome || !nome.trim()) {
      return { success: false, error: 'O nome da categoria é obrigatório' };
    }

    const repo = new CategoriaRepositoryHttp(undefined, () => token);
    const categoria = await repo.salvar(nome.trim(), id);

    revalidatePath('/');
    revalidatePath('/produtos');
    revalidatePath('/admin/categorias');
    revalidatePath('/admin/produtos');

    return {
      success: true,
      data: {
        id: categoria.id,
        nome: categoria.nome,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao salvar categoria';
    return { success: false, error: message };
  }
}

export async function deletarCategoriaAction(id: string): Promise<ActionResult> {
  try {
    const token = await getAdminTokenServer();
    if (!token) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const repo = new CategoriaRepositoryHttp(undefined, () => token);
    await repo.deletar(id);

    revalidatePath('/');
    revalidatePath('/produtos');
    revalidatePath('/admin/categorias');
    revalidatePath('/admin/produtos');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha ao remover categoria';
    return { success: false, error: message };
  }
}

