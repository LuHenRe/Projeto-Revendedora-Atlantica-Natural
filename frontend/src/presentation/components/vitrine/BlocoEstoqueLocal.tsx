'use client';

import React, { useState, useMemo } from 'react';
import { Package, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { Produto } from '../../../domain/entities/Produto';
import { Categoria } from '../../../domain/entities/Categoria';
import { CardProduto } from './CardProduto';
import { Button } from '../ui/Button';

interface BlocoEstoqueLocalProps {
  produtosIniciais: Produto[];
  categorias: Categoria[];
}

export function BlocoEstoqueLocal({ produtosIniciais, categorias }: BlocoEstoqueLocalProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    if (!categoriaSelecionada) return produtosIniciais;
    return produtosIniciais.filter((p) => p.categoriaId === categoriaSelecionada);
  }, [produtosIniciais, categoriaSelecionada]);

  return (
    <section id="secao-pronta-entrega" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 mb-2">
              <Package className="w-4 h-4" />
              <span>Estoque Físico Local</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground font-outfit tracking-tight">
              Disponíveis para Pronta-Entrega
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Receba hoje mesmo na sua residência ou retire na região de Valparaíso e DF.
            </p>
          </div>

          {/* Filtros de Categoria */}
          {categorias.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setCategoriaSelecionada(null)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  categoriaSelecionada === null
                    ? 'bg-brand-900 text-white shadow-xs'
                    : 'bg-white border border-border text-foreground hover:bg-muted'
                }`}
              >
                Todos ({produtosIniciais.length})
              </button>

              {categorias.map((cat) => {
                const totalCategoria = produtosIniciais.filter((p) => p.categoriaId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSelecionada(cat.id)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                      categoriaSelecionada === cat.id
                        ? 'bg-brand-900 text-white shadow-xs'
                        : 'bg-white border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat.nome} ({totalCategoria})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid de Produtos */}
        {produtosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-white max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">Nenhum produto nesta categoria</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Explore outras categorias ou entre em contato para solicitar uma encomenda especial.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCategoriaSelecionada(null)}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

