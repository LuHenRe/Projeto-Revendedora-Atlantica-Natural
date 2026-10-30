'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Sparkles } from 'lucide-react';
import { ProdutoMatriz } from '../../../domain/entities/ProdutoMatriz';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AnalyticsTracker } from '../../../infrastructure/analytics/tracker';

interface CardProdutoMatrizProps {
  produto: ProdutoMatriz;
}

export function CardProdutoMatriz({ produto }: CardProdutoMatrizProps) {
  const handleOutboundClick = () => {
    AnalyticsTracker.track('click_afiliado_matriz', {
      produtoId: produto.id,
      produtoNome: produto.nome,
      valor: produto.preco.valor,
      urlAfiliada: produto.urlAfiliada.valor,
    });
  };

  const fallbackImagem =
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop';

  return (
    <Card className="flex flex-col h-full bg-white hover:border-amber-300 transition-all duration-300 group shadow-sm hover:shadow-soft">
      {/* Imagem do Produto */}
      <div className="relative w-full aspect-square bg-muted/40 overflow-hidden">
        <Image
          src={produto.imagemUrl || fallbackImagem}
          alt={produto.nome}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 z-10">
          <Badge variant="matriz">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Loja Oficial Matriz
          </Badge>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {produto.nome}
          </h3>

          {produto.descricao && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {produto.descricao}
            </p>
          )}

          <div className="mt-3">
            <span className="text-xs text-muted-foreground block">Preço oficial</span>
            <span className="text-xl sm:text-2xl font-bold text-foreground font-outfit">
              {produto.preco.formatado}
            </span>
          </div>
        </div>

        {/* Ação de Afiliada */}
        <div className="pt-2 border-t border-border/50">
          <a
            href={produto.urlAfiliada.valor}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOutboundClick}
            className="w-full inline-block"
          >
            <Button
              variant="outline"
              size="md"
              className="w-full group/btn hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 font-semibold"
            >
              <span>Comprar na Loja Oficial</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}

