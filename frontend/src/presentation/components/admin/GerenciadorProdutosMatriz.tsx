'use client';

import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  FolderSync,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import {
  adicionarDestaqueMatrizAction,
  listarCategoriasMatrizAction,
  removerDestaqueMatrizAction,
  sincronizarCategoriaMatrizAction,
} from '@/infrastructure/actions/matrizActions';
import { CategoriaMatrizInfo } from '@/domain/repositories/IProdutoMatrizRepository';

const urlSchema = z.object({
  url: z.string().url('Insira uma URL válida da loja da Atlântica Natural'),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface ProdutoMatrizDTO {
  id: string;
  nome: string;
  preco: {
    valor: number;
    formatado: string;
  };
  imagemUrl: string;
  urlOrigem: string;
  urlAfiliada: string;
  categoriaOrigem?: string | null;
}

interface GerenciadorProdutosMatrizProps {
  initialProdutos: ProdutoMatrizDTO[];
  initialCategorias?: CategoriaMatrizInfo[];
}

export function GerenciadorProdutosMatriz({
  initialProdutos,
  initialCategorias = [],
}: GerenciadorProdutosMatrizProps) {
  const [produtos, setProdutos] = useState<ProdutoMatrizDTO[]>(initialProdutos);
  const [categorias, setCategorias] = useState<CategoriaMatrizInfo[]>(initialCategorias);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [categoriaTouched, setCategoriaTouched] = useState(false);
  const [categoriaError, setCategoriaError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensagem: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingCategoria, setIsSyncingCategoria] = useState(false);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);

  const syncHeadingId = useId();
  const categorySelectId = useId();
  const categoryErrorId = useId();
  const importHeadingId = useId();
  const urlInputId = useId();
  const urlErrorId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: '' },
  });

  const handleRecarregarCategorias = async () => {
    setIsLoadingCategorias(true);
    setFeedback(null);
    try {
      const res = await listarCategoriasMatrizAction(true);
      if (res.success && Array.isArray(res.data)) {
        setCategorias(res.data as CategoriaMatrizInfo[]);
      } else {
        setFeedback({
          tipo: 'error',
          mensagem: res.error || 'Não foi possível carregar as categorias da loja',
        });
      }
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro de conexão ao carregar categorias' });
    } finally {
      setIsLoadingCategorias(false);
    }
  };

  const handleSincronizarCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoriaTouched(true);

    if (!selectedCategoria) {
      setCategoriaError('Selecione uma categoria da loja para sincronizar.');
      document.getElementById(categorySelectId)?.focus();
      return;
    }

    setCategoriaError(null);
    setIsSyncingCategoria(true);
    setFeedback(null);

    try {
      const res = await sincronizarCategoriaMatrizAction(selectedCategoria);
      if (!res.success || !res.data) {
        setFeedback({
          tipo: 'error',
          mensagem: res.error || 'Falha ao sincronizar produtos da categoria',
        });
        return;
      }

      const payload = res.data as {
        categoriaUrl: string;
        adicionados: number;
        atualizados: number;
        removidos: number;
        produtos: ProdutoMatrizDTO[];
      };

      const syncedIds = new Set(payload.produtos.map((p) => p.id));

      setProdutos((prev) => {
        const restantes = prev.filter(
          (p) => p.categoriaOrigem !== payload.categoriaUrl && !syncedIds.has(p.id)
        );
        return [...payload.produtos, ...restantes];
      });

      setFeedback({
        tipo: 'success',
        mensagem: `Categoria sincronizada: ${payload.adicionados} adicionado(s), ${payload.atualizados} atualizado(s) e ${payload.removidos} removido(s).`,
      });
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro de conexão com o servidor' });
    } finally {
      setIsSyncingCategoria(false);
    }
  };

  const onSubmit = async (data: UrlFormData) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await adicionarDestaqueMatrizAction(data.url);
      if (!res.success) {
        setFeedback({
          tipo: 'error',
          mensagem: res.error || 'Falha ao buscar produto via web scraping da matriz',
        });
        setIsSubmitting(false);
        return;
      }

      const returned = (res.data || {}) as Partial<ProdutoMatrizDTO>;
      const valorPreco = typeof returned.preco?.valor === 'number' ? returned.preco.valor : 0;
      const novoItem: ProdutoMatrizDTO = {
        id: returned.id || returned.urlOrigem || data.url,
        nome: returned.nome || 'Produto Importado',
        preco: {
          valor: valorPreco,
          formatado:
            returned.preco?.formatado ||
            `R$ ${Number(valorPreco).toFixed(2).replace('.', ',')}`,
        },
        imagemUrl: returned.imagemUrl || '',
        urlOrigem: returned.urlOrigem || data.url,
        urlAfiliada: returned.urlAfiliada || data.url,
        categoriaOrigem: returned.categoriaOrigem ?? null,
      };

      const jaExistia = produtos.some((p) => p.id === novoItem.id);
      setProdutos((prev) => {
        if (prev.some((p) => p.id === novoItem.id)) {
          return prev.map((p) => (p.id === novoItem.id ? novoItem : p));
        }
        return [novoItem, ...prev];
      });

      setFeedback({
        tipo: 'success',
        mensagem: jaExistia
          ? 'Este produto já estava cadastrado na vitrine e foi mantido sem duplicação.'
          : 'Produto importado da matriz com sucesso e link de afiliada anexado!',
      });
      reset();
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro de conexão com o servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemover = async (id: string, nome: string) => {
    if (!confirm(`Deseja remover "${nome}" dos destaques da matriz?`)) return;

    try {
      const res = await removerDestaqueMatrizAction(id);
      if (res.success) {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        setFeedback({ tipo: 'success', mensagem: `Destaque removido com sucesso.` });
      } else {
        setFeedback({ tipo: 'error', mensagem: res.error || 'Erro ao remover destaque' });
      }
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro ao conectar ao servidor' });
    }
  };

  const showCategoryError = Boolean(categoriaTouched && categoriaError);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
          Destaques da Loja Matriz
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Sincronize categorias inteiras ou puxe produtos individuais da loja oficial da Atlântica Natural.
          O link gerado na vitrine incluirá seu ID de afiliada para você receber a comissão.
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
            feedback.tipo === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.tipo === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span>{feedback.mensagem}</span>
        </div>
      )}

      {/* Formulário de Sincronização por Categoria */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 id={syncHeadingId} className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <FolderSync className="w-4 h-4 text-purple-600" aria-hidden="true" />
            <span>Sincronizar Categoria da Loja</span>
          </h3>
          <button
            type="button"
            onClick={handleRecarregarCategorias}
            disabled={isLoadingCategorias || isSyncingCategoria}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingCategorias ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Atualizar lista de categorias</span>
          </button>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Importa novos produtos, atualiza preços/dados dos existentes e remove itens que saíram da categoria selecionada.
        </p>

        <form
          aria-labelledby={syncHeadingId}
          onSubmit={handleSincronizarCategoria}
          noValidate
          className="flex flex-col sm:flex-row sm:items-end gap-3"
        >
          <div className="flex-1">
            <label htmlFor={categorySelectId} className="block text-xs font-medium text-zinc-700 mb-1">
              Categoria oficial <span aria-hidden="true">*</span>
            </label>
            <select
              id={categorySelectId}
              name="categoria_url"
              required
              value={selectedCategoria}
              aria-invalid={showCategoryError ? 'true' : 'false'}
              aria-describedby={showCategoryError ? categoryErrorId : undefined}
              onChange={(e) => {
                setSelectedCategoria(e.target.value);
                setCategoriaTouched(true);
                if (e.target.value) setCategoriaError(null);
              }}
              onBlur={() => {
                setCategoriaTouched(true);
                if (!selectedCategoria) {
                  setCategoriaError('Selecione uma categoria da loja para sincronizar.');
                }
              }}
              className="w-full h-10 px-3 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500 user-invalid:border-red-500"
            >
              <option value="" disabled>
                {categorias.length > 0
                  ? 'Selecione uma categoria...'
                  : 'Nenhuma categoria carregada — clique em Atualizar'}
              </option>
              {categorias.map((cat) => (
                <option key={cat.url} value={cat.url}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {showCategoryError && (
              <p id={categoryErrorId} className="text-xs text-red-600 mt-1">
                {categoriaError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSyncingCategoria}
            className="bg-purple-700 hover:bg-purple-800 text-white shrink-0 gap-2"
          >
            {isSyncingCategoria ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Sincronizando...
              </span>
            ) : (
              <>
                <FolderSync className="w-4 h-4" aria-hidden="true" />
                <span>Sincronizar Categoria</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Formulário de Importação Individual com Scraper */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
        <h3 id={importHeadingId} className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <span>Importar Produto via Link Oficial</span>
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Cole a URL da página do produto (ou link /visualizar/...) na loja oficial da Atlântica Natural.
        </p>

        <form
          aria-labelledby={importHeadingId}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row sm:items-end gap-3"
        >
          <div className="flex-1">
            <label htmlFor={urlInputId} className="block text-xs font-medium text-zinc-700 mb-1">
              URL do produto <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <LinkIcon
                className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id={urlInputId}
                type="url"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://loja.atlanticanatural.com.br/produtos/..."
                aria-invalid={errors.url ? 'true' : 'false'}
                aria-describedby={errors.url ? urlErrorId : undefined}
                className="pl-10"
                {...register('url')}
              />
            </div>
            {errors.url && (
              <p id={urlErrorId} className="text-xs text-red-500 mt-1">
                {errors.url.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-900 hover:bg-zinc-800 text-white shrink-0 gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Extraindo dados...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Puxar Dados da Matriz</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Grid de Destaques Ativos */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800">
            Destaques Ativos na Vitrine ({produtos.length})
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {produtos.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
              Nenhum produto da matriz importado ainda.
            </div>
          ) : (
            produtos.map((prod) => (
              <div
                key={prod.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-zinc-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 overflow-hidden">
                    {prod.imagemUrl ? (
                      <img
                        src={prod.imagemUrl}
                        alt={prod.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-purple-600" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 text-sm">{prod.nome}</h4>
                    <p className="text-xs text-zinc-500 font-medium">
                      {prod.preco.formatado} • Envio direto da Matriz
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={prod.urlAfiliada}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <span>Testar Link</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemover(prod.id, prod.nome)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover destaque"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

