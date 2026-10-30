import Link from 'next/link';
import { Package, Sparkles, Tag, AlertTriangle, Plus, ExternalLink } from 'lucide-react';
import { ProdutoRepositoryHttp } from '@/infrastructure/api/ProdutoRepositoryHttp';
import { ProdutoMatrizRepositoryHttp } from '@/infrastructure/api/ProdutoMatrizRepositoryHttp';
import { CategoriaRepositoryHttp } from '@/infrastructure/api/CategoriaRepositoryHttp';
import { getAdminTokenServer } from '@/infrastructure/actions/authActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/Card';
import { Badge } from '@/presentation/components/ui/Badge';

export default async function AdminDashboardPage() {
  const token = await getAdminTokenServer();

  let produtos: any[] = [];
  let produtosMatriz: any[] = [];
  let categorias: any[] = [];

  try {
    const prodRepo = new ProdutoRepositoryHttp(undefined, () => token);
    const matrizRepo = new ProdutoMatrizRepositoryHttp(undefined, () => token);
    const catRepo = new CategoriaRepositoryHttp(undefined, () => token);

    [produtos, produtosMatriz, categorias] = await Promise.all([
      prodRepo.listarAtivos(0, 100).catch(() => []),
      matrizRepo.listarAtivos().catch(() => []),
      catRepo.listar().catch(() => []),
    ]);
  } catch {
    // Fallback gracioso
  }

  const produtosAtivos = produtos.filter((p) => p.ativo);
  const produtosComEstoque = produtosAtivos.filter((p) => p.quantidadeEstoque > 0);
  const produtosEsgotados = produtosAtivos.filter((p) => p.quantidadeEstoque === 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Topo Boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            Visão Geral do Hub
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Acompanhe o status do seu estoque físico e destaques da loja matriz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </Link>
          <Link
            href="/admin/produtos-matriz"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Puxar Matriz</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total no Catálogo
              </p>
              <p className="text-3xl font-bold text-zinc-900 mt-1">
                {produtosAtivos.length}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Produtos ativos locais</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Pronta-Entrega
              </p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">
                {produtosComEstoque.length}
              </p>
              <p className="text-xs text-emerald-700/80 mt-1">Estoque disponível</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Estoque Zerado
              </p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {produtosEsgotados.length}
              </p>
              <p className="text-xs text-amber-600/80 mt-1">Necessita reposição</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Destaques Matriz
              </p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                {produtosMatriz.length}
              </p>
              <p className="text-xs text-purple-700/80 mt-1">Deep links ativos</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid com Destaques e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Alerta de Estoque */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-200/80 shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Atenção ao Estoque Físico</span>
              </CardTitle>
              <Link
                href="/admin/produtos"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Gerenciar Todos →
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {produtosEsgotados.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Excelente! Todos os seus produtos ativos possuem unidades disponíveis em estoque.
                </div>
              ) : (
                produtosEsgotados.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                    <div>
                      <h4 className="font-medium text-sm text-zinc-900">{p.nome}</h4>
                      <p className="text-xs text-zinc-500">
                        {p.categoria?.nome || 'Sem Categoria'} • {p.preco.formatado}
                      </p>
                    </div>
                    <Badge variant="destructive">Esgotado</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Atalhos Rápidos */}
        <div>
          <Card className="border-zinc-200/80 shadow-xs">
            <CardHeader className="p-5 pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900">
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <Link
                href="/admin/produtos"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-sm font-medium text-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Cadastrar Novo Produto</span>
                </div>
                <span className="text-zinc-400">→</span>
              </Link>

              <Link
                href="/admin/produtos-matriz"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-sm font-medium text-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Importar URL da Matriz</span>
                </div>
                <span className="text-zinc-400">→</span>
              </Link>

              <Link
                href="/admin/categorias"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-sm font-medium text-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span>Gerenciar Categorias ({categorias.length})</span>
                </div>
                <span className="text-zinc-400">→</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors text-sm font-medium text-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-zinc-600" />
                  <span>Abrir Vitrine Pública</span>
                </div>
                <span className="text-zinc-400">↗</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

