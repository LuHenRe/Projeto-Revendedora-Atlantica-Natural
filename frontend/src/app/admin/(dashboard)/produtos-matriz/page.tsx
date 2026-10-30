import { ProdutoMatrizRepositoryHttp } from '@/infrastructure/api/ProdutoMatrizRepositoryHttp';
import { getAdminTokenServer } from '@/infrastructure/actions/authActions';
import { GerenciadorProdutosMatriz } from '@/presentation/components/admin/GerenciadorProdutosMatriz';

export default async function AdminProdutosMatrizPage() {
  const token = await getAdminTokenServer();

  let produtosMatriz: any[] = [];

  try {
    const matrizRepo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    produtosMatriz = await matrizRepo.listarAtivos().catch(() => []);
  } catch {
    // Fallback gracioso
  }

  const produtosMatrizDTO = produtosMatriz.map((p) => ({
    id: p.id,
    nome: p.nome,
    preco: {
      valor: p.preco.valor,
      formatado: p.preco.formatado,
    },
    imagemUrl: p.imagemUrl,
    urlOrigem: p.urlOrigem.valor,
    urlAfiliada: p.urlAfiliada.valor,
  }));

  return (
    <div className="animate-in fade-in duration-300">
      <GerenciadorProdutosMatriz initialProdutos={produtosMatrizDTO} />
    </div>
  );
}

