'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Package, AlertCircle } from 'lucide-react';
import { Produto } from '../../domain/entities/Produto';
import { Categoria } from '../../domain/entities/Categoria';
import { CardProduto } from '../../presentation/components/vitrine/CardProduto';
import { Input } from '../../presentation/components/ui/Input';
import { Button } from '../../presentation/components/ui/Button';

interface CatalogoInterativoProps {
  produtosIniciais: Produto[];
  categorias: Categoria[];
}

export function CatalogoInterativo({ produtosIniciais, categorias }: CatalogoInterativoProps) {
  const [busca, setBusca] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<'padrao' | 'menor-preco' | 'maior-preco'>('padrao');

  const produtosFiltrados = useMemo(() => {
    return produtosIniciais
      .filter((produto) => {
        const matchesBusca =
          !busca.trim() ||
          produto.nome.toLowerCase().includes(busca.toLowerCase().trim()) ||
          (produto.categoria && produto.categoria.nome.toLowerCase().includes(busca.toLowerCase().trim()));

        const matchesCategoria = !categoriaId || produto.categoriaId === categoriaId;

        return matchesBusca && matchesCategoria;
      })
      .sort((a, b) => {
        if (ordenacao === 'menor-preco') return a.preco.valor - b.preco.valor;
        if (ordenacao === 'maior-preco') return b.preco.valor - a.preco.valor;
        return 0;
      });
  }, [produtosIniciais, busca, categoriaId, ordenacao]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Título e Barra de Pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-outfit tracking-tight">
            Catálogo Completo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Encontre produtos por nome, categoria ou aroma desejado.
          </p>
        </div>

        {/* Input de Busca */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Pesquisar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Filtros e Ordenação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-border/60 mb-8">
        {/* Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setCategoriaId(null)}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              categoriaId === null
                ? 'bg-brand-900 text-white shadow-xs'
                : 'bg-white border border-border text-foreground hover:bg-muted'
            }`}
          >
            Todas ({produtosIniciais.length})
          </button>

          {categorias.map((cat) => {
            const count = produtosIniciais.filter((p) => p.categoriaId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaId(cat.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  categoriaId === cat.id
                    ? 'bg-brand-900 text-white shadow-xs'
                    : 'bg-white border border-border text-foreground hover:bg-muted'
                }`}
              >
                {cat.nome} ({count})
              </button>
            );
          })}
        </div>

        {/* Ordenar por */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs text-muted-foreground">Ordenar:</span>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as any)}
            className="text-xs font-medium rounded-xl border border-border bg-white px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer"
          >
            <option value="padrao">Padrão</option>
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-preco">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Grid de Produtos */}
      {produtosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border bg-white max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground">Nenhum produto encontrado</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar com outro termo ou selecione uma categoria diferente.
            </p>
          </div>
          {(busca || categoriaId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBusca('');
                setCategoriaId(null);
              }}
            >
              Limpar Filtros e Busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

