import { ProdutoRepositoryHttp } from '@/infrastructure/api/ProdutoRepositoryHttp';
import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import { getAdminTokenServer } from '@/infrastructure/actions/authActions';
import { GerenciadorProdutos } from '@/presentation/components/admin/GerenciadorProdutos';

export default async function AdminProdutosPage() {
  const token = await getAdminTokenServer();

  let produtos: any[] = [];
  let categorias: any[] = [];

  try {
    const prodRepo = new ProdutoRepositoryHttp(undefined, () => token);
    const catRepo = new CategoriaRepositoryHttp(undefined, () => token);

    [produtos, categorias] = await Promise.all([
      prodRepo.listarAtivos(0, 100).catch(() => []),
      catRepo.listar().catch(() => []),
    ]);
  } catch {
    // Fallback gracioso
  }

  const produtosDTO = produtos.map((p) => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: {
      valor: p.preco.valor,
      formatado: p.preco.formatado,
    },
    estoque: p.quantidadeEstoque,
    categoria: p.categoria
      ? { id: p.categoria.id, nome: p.categoria.nome }
      : undefined,
    imagemUrl: p.imagemUrl,
    ativo: p.ativo,
  }));

  const categoriasDTO = categorias.map((c) => ({
    id: c.id,
    nome: c.nome,
  }));

  return (
    <div className="animate-in fade-in duration-300">
      <GerenciadorProdutos
        initialProdutos={produtosDTO}
        categorias={categoriasDTO}
      />
    </div>
  );
}

