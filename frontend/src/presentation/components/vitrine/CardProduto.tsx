'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Produto } from '../../../domain/entities/Produto';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { WhatsAppButton } from './WhatsAppButton';
import { useVitrine } from '../../context/VitrineContext';

interface CardProdutoProps {
  produto: Produto;
}

export function CardProduto({ produto }: CardProdutoProps) {
  const { solicitarCompraProduto, sacola } = useVitrine();
  const [adicionadoAnimacao, setAdicionadoAnimacao] = useState(false);

  const isDisponivel = produto.isDisponivelParaProntaEntrega();

  const handleAdicionarSacola = () => {
    sacola.adicionarProduto(produto, 1);
    setAdicionadoAnimacao(true);
    setTimeout(() => setAdicionadoAnimacao(false), 1500);
  };

  const fallbackImagem =
    'https://images.unsplash.com/photo-1608248597359-2e0618063073?q=80&w=600&auto=format&fit=crop';

  return (
    <Card className="flex flex-col h-full bg-white hover:border-brand-300 transition-all duration-300 group shadow-sm hover:shadow-soft">
      {/* Imagem do Produto */}
      <div className="relative w-full aspect-square bg-muted/40 overflow-hidden">
        <Image
          src={produto.imagemUrl || fallbackImagem}
          alt={produto.nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isDisponivel ? (
            <Badge variant="pronta-entrega">Pronta-Entrega</Badge>
          ) : (
            <Badge variant="esgotado">Esgotado</Badge>
          )}
        </div>

        {produto.categoria && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-foreground/80 border border-border/60">
              {produto.categoria.nome}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2 leading-snug group-hover:text-brand-900 transition-colors">
            {produto.nome}
          </h3>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">Valor à vista</span>
              <span className="text-xl sm:text-2xl font-bold text-brand-950 font-outfit">
                {produto.preco.formatado}
              </span>
            </div>

            {isDisponivel && produto.quantidadeEstoque <= 5 && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Apenas {produto.quantidadeEstoque} restando!
              </span>
            )}
          </div>
        </div>

        {/* Ações de Conversão */}
        <div className="pt-2 border-t border-border/50 flex items-center gap-2">
          <div className="flex-1">
            <WhatsAppButton
              size="md"
              disabled={!isDisponivel}
              onClick={() => solicitarCompraProduto(produto)}
            >
              Pedir no WhatsApp
            </WhatsAppButton>
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={!isDisponivel}
            onClick={handleAdicionarSacola}
            className={`shrink-0 transition-colors ${
              adicionadoAnimacao
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'hover:bg-brand-50 hover:text-brand-900 hover:border-brand-300'
            }`}
            title="Adicionar à sacola de pedidos"
            aria-label="Adicionar à sacola de pedidos"
          >
            {adicionadoAnimacao ? (
              <Check className="w-5 h-5 animate-in zoom-in-75" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

