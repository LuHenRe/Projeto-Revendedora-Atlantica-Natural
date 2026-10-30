'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Tag, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { salvarCategoriaAction, deletarCategoriaAction } from '@/infrastructure/actions/categoriaActions';

const categoriaSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface CategoriaDTO {
  id: string;
  nome: string;
}

interface GerenciadorCategoriasProps {
  initialCategorias: CategoriaDTO[];
}

export function GerenciadorCategorias({ initialCategorias }: GerenciadorCategoriasProps) {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>(initialCategorias);
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensagem: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nome: '' },
  });

  const onSubmit = async (data: CategoriaFormData) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await salvarCategoriaAction(data.nome);
      if (!res.success) {
        setFeedback({ tipo: 'error', mensagem: res.error || 'Erro ao cadastrar categoria' });
        setIsSubmitting(false);
        return;
      }

      const novaCat: CategoriaDTO = {
        id: (res.data as any)?.id || Date.now().toString(),
        nome: data.nome,
      };

      setCategorias((prev) => [...prev, novaCat]);
      reset();
      setFeedback({ tipo: 'success', mensagem: `Categoria "${data.nome}" cadastrada com sucesso!` });
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Falha de comunicação com o servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover a categoria "${nome}"?`)) return;

    try {
      const res = await deletarCategoriaAction(id);
      if (res.success) {
        setCategorias((prev) => prev.filter((c) => c.id !== id));
        setFeedback({ tipo: 'success', mensagem: `Categoria "${nome}" removida.` });
      } else {
        setFeedback({ tipo: 'error', mensagem: res.error || 'Erro ao excluir categoria' });
      }
    } catch {
      setFeedback({ tipo: 'error', mensagem: 'Erro ao conectar ao servidor' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
          Categorias
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Organize seus produtos por linhas (ex: Óleos Essenciais, Cosméticos, Nutracêuticos).
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

      {/* Formulário de Adicionar Categoria */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Nova Categoria</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Nome da categoria (ex: Cuidados Faciais)"
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando...
              </span>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </form>
      </div>

      {/* Lista de Categorias */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800">
            Categorias Cadastradas ({categorias.length})
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {categorias.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Nenhuma categoria cadastrada ainda.
            </div>
          ) : (
            categorias.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-zinc-900 text-sm">
                    {cat.nome}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletar(cat.id, cat.nome)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

