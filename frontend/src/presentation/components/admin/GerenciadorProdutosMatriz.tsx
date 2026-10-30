'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Link as LinkIcon, Trash2, ExternalLink, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { adicionarDestaqueMatrizAction, removerDestaqueMatrizAction } from '@/infrastructure/actions/matrizActions';

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
}

interface GerenciadorProdutosMatrizProps {
  initialProdutos: ProdutoMatrizDTO[];
}

export function GerenciadorProdutosMatriz({ initialProdutos }: GerenciadorProdutosMatrizProps) {
  const [produtos, setProdutos] = useState<ProdutoMatrizDTO[]>(initialProdutos);
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensagem: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: '' },
  });

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

      setFeedback({
        tipo: 'success',
        mensagem: 'Produto importado da matriz com sucesso e link de afiliada anexado!',
      });

      // Recarrega lista ou adiciona item retornado
      const novoItem: ProdutoMatrizDTO = {
        id: (res.data as any)?.id || Date.now().toString(),
        nome: (res.data as any)?.nome || 'Produto Importado',
        preco: {
          valor: (res.data as any)?.preco || 0,
          formatado: `R$ ${Number((res.data as any)?.preco || 0).toFixed(2).replace('.', ',')}`,
        },
        imagemUrl: '',
        urlOrigem: data.url,
        urlAfiliada: data.url,
      };

      setProdutos((prev) => [novoItem, ...prev]);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
          Destaques da Loja Matriz
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Puxe produtos especiais da sede da Atlântica Natural via web scraping automático.
          O link gerado na vitrine incluirá seu ID de afiliada para você receber a comissão.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
            feedback.tipo === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.tipo === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{feedback.mensagem}</span>
        </div>
      )}

      {/* Formulário de Importação com Scraper */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Importar Produto via Link Oficial</span>
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Cole a URL da página do produto na loja oficial da Atlântica Natural. O sistema obterá automaticamente o título, valor e foto.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="url"
                placeholder="https://loja.atlanticanatural.com.br/produto/..."
                className="pl-10"
                {...register('url')}
              />
            </div>
            {errors.url && (
              <p className="text-xs text-red-500 mt-1">{errors.url.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-900 hover:bg-zinc-800 text-white shrink-0 gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Extraindo dados...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
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
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
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
                      <Sparkles className="w-5 h-5 text-purple-600" />
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
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemover(prod.id, prod.nome)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover destaque"
                  >
                    <Trash2 className="w-4 h-4" />
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

