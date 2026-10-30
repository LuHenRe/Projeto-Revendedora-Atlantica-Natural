'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Badge } from '@/presentation/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/Dialog';
import { salvarProdutoAction, inativarProdutoAction } from '@/infrastructure/actions/produtoActions';
import { SalvarProdutoInput } from '@/domain/repositories/IProdutoRepository';

const produtoFormSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  preco: z.coerce.number().positive('O preço deve ser maior que zero'),
  estoque: z.coerce.number().int().min(0, 'O estoque não pode ser negativo'),
  categoria_id: z.string().min(1, 'Selecione uma categoria'),
  imagem_url: z.string().optional(),
});

type ProdutoFormData = {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria_id: string;
  imagem_url?: string;
};

interface ProdutoItemDTO {
  id: string;
  nome: string;
  descricao?: string;
  preco: {
    valor: number;
    formatado: string;
  };
  estoque: number;
  categoria?: {
    id: string;
    nome: string;
  };
  imagemUrl?: string;
  ativo: boolean;
}

interface CategoriaItemDTO {
  id: string;
  nome: string;
}

interface GerenciadorProdutosProps {
  initialProdutos: ProdutoItemDTO[];
  categorias: CategoriaItemDTO[];
}

export function GerenciadorProdutos({ initialProdutos, categorias }: GerenciadorProdutosProps) {
  const [produtos, setProdutos] = useState<ProdutoItemDTO[]>(initialProdutos);
  const [busca, setBusca] = useState('');
  const [modalAberta, setModalAberta] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoItemDTO | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensagem: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoFormSchema) as any,
    defaultValues: {
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoria_id: categorias[0]?.id || '',
      imagem_url: '',
    },
  });

  const abrirModalNovo = () => {
    setProdutoEmEdicao(null);
    reset({
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoria_id: categorias[0]?.id || '',
      imagem_url: '',
    });
    setModalAberta(true);
  };

  const abrirModalEdicao = (prod: ProdutoItemDTO) => {
    setProdutoEmEdicao(prod);
    reset({
      nome: prod.nome,
      descricao: prod.descricao || '',
      preco: prod.preco.valor,
      estoque: prod.estoque,
      categoria_id: prod.categoria?.id || categorias[0]?.id || '',
      imagem_url: prod.imagemUrl || '',
    });
    setModalAberta(true);
  };

  const onSubmit = async (data: ProdutoFormData) => {
    setIsSubmitting(true);
    setFeedback(null);

    const input: SalvarProdutoInput = {
      nome: data.nome,
      preco: Number(data.preco),
      quantidadeEstoque: Number(data.estoque),
      categoriaId: data.categoria_id,
      imagemUrl: data.imagem_url || null,
    };

    try {
      const res = await salvarProdutoAction(input, produtoEmEdicao?.id);
      if (!res.success) {
        setFeedback({ tipo: 'error', mensagem: res.error || 'Erro ao salvar produto' });
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        tipo: 'success',
        mensagem: produtoEmEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
      });

      // Atualiza lista local
      if (produtoEmEdicao) {
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoEmEdicao.id
              ? {
                  ...p,
                  nome: data.nome,
                  descricao: data.descricao,
                  preco: {
                    valor: data.preco,
                    formatado: `R$ ${data.preco.toFixed(2).replace('.', ',')}`,
                  },
                  estoque: data.estoque,
                  categoria: categorias.find((c) => c.id === data.categoria_id),
                  imagemUrl: data.imagem_url,
                }
              : p
          )
        );
      } else {
        const novoProduto: ProdutoItemDTO = {
          id: (res.data as any)?.id || Date.now().toString(),
          nome: data.nome,
          descricao: data.descricao,
          preco: {
            valor: data.preco,
            formatado: `R$ ${data.preco.toFixed(2).replace('.', ',')}`,
          },
          estoque: data.estoque,
          categoria: categorias.find((c) => c.id === data.categoria_id),
          imagemUrl: data.imagem_url,
          ativo: true,
        };
        setProdutos((prev) => [novoProduto, ...prev]);
      }

      setModalAberta(false);
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Falha de comunicação com o servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInativar = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente inativar o produto "${nome}"?`)) return;

    try {
      const res = await inativarProdutoAction(id);
      if (res.success) {
        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ativo: false } : p))
        );
        setFeedback({ tipo: 'success', mensagem: `Produto "${nome}" inativado com sucesso.` });
      } else {
        setFeedback({ tipo: 'error', mensagem: res.error || 'Erro ao inativar produto' });
      }
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro ao conectar ao servidor' });
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Topo com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            Estoque Local
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie seus produtos físicos para entrega imediata na região.
          </p>
        </div>

        <Button
          onClick={abrirModalNovo}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </Button>
      </div>

      {/* Alertas de Feedback */}
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

      {/* Filtro de Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Buscar produto por nome ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50/70 border-b border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-4">Produto</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Preço</th>
                <th className="py-3.5 px-4">Estoque</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center text-zinc-400">
                          {prod.imagemUrl ? (
                            <img
                              src={prod.imagemUrl}
                              alt={prod.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 opacity-40" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900">{prod.nome}</p>
                          {prod.descricao && (
                            <p className="text-xs text-zinc-400 line-clamp-1">
                              {prod.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md">
                        {prod.categoria?.nome || 'Sem categoria'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-900">
                      {prod.preco.formatado}
                    </td>
                    <td className="py-3.5 px-4">
                      {prod.estoque > 0 ? (
                        <span className="font-medium text-emerald-700">
                          {prod.estoque} un.
                        </span>
                      ) : (
                        <span className="font-medium text-amber-600">
                          0 un.
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {prod.ativo ? (
                        <Badge variant="success">Ativo</Badge>
                      ) : (
                        <Badge variant="destructive">Inativo</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => abrirModalEdicao(prod)}
                          className="p-1.5 text-zinc-500 hover:text-emerald-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {prod.ativo && (
                          <button
                            type="button"
                            onClick={() => handleInativar(prod.id, prod.nome)}
                            className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Inativar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={modalAberta} onOpenChange={setModalAberta}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {produtoEmEdicao ? 'Editar Produto Local' : 'Novo Produto para Pronta-Entrega'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                Nome do Produto *
              </label>
              <Input
                placeholder="Ex: Óleo de Melaleuca Puro 10ml"
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                Categoria *
              </label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...register('categoria_id')}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <p className="text-xs text-red-500 mt-1">{errors.categoria_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                  Preço (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="49.90"
                  {...register('preco')}
                />
                {errors.preco && (
                  <p className="text-xs text-red-500 mt-1">{errors.preco.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                  Quantidade em Estoque *
                </label>
                <Input
                  type="number"
                  placeholder="5"
                  {...register('estoque')}
                />
                {errors.estoque && (
                  <p className="text-xs text-red-500 mt-1">{errors.estoque.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                Descrição do Produto
              </label>
              <textarea
                rows={3}
                placeholder="Benefícios, modo de uso e características naturais..."
                className="w-full p-3 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...register('descricao')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                URL da Imagem
              </label>
              <Input
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                {...register('imagem_url')}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalAberta(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Salvar Produto'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

