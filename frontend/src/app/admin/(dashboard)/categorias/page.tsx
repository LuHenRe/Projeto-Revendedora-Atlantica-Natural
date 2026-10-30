import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import { getAdminTokenServer } from '@/infrastructure/actions/authActions';
import { GerenciadorCategorias } from '@/presentation/components/admin/GerenciadorCategorias';

export default async function AdminCategoriasPage() {
  const token = await getAdminTokenServer();

  let categorias: any[] = [];

  try {
    const catRepo = new CategoriaRepositoryHttp(undefined, () => token);
    categorias = await catRepo.listar().catch(() => []);
  } catch {
    // Fallback gracioso
  }

  const categoriasDTO = categorias.map((c) => ({
    id: c.id,
    nome: c.nome,
  }));

  return (
    <div className="animate-in fade-in duration-300">
      <GerenciadorCategorias initialCategorias={categoriasDTO} />
    </div>
  );
}

