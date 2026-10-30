'use client';

import React, { useState } from 'react';
import { ShoppingBag, ChevronUp, ChevronDown, Trash2, ArrowRight } from 'lucide-react';
import { useVitrine } from '../../context/VitrineContext';
import { WhatsAppButton } from './WhatsAppButton';
import { Button } from '../ui/Button';

export function BarraSacolaFlutuante() {
  const { sacola, concluirPedidoSacola } = useVitrine();
  const [expandida, setExpandida] = useState(false);

  if (!sacola.temItens) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-xl mx-auto pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto">
        {/* Gaveta Expandida com Detalhes dos Itens */}
        {expandida && (
          <div className="p-4 border-b border-border max-h-60 overflow-y-auto space-y-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Itens Selecionados ({sacola.quantidadeTotal})
              </span>
              <button
                onClick={sacola.limparSacola}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar
              </button>
            </div>

            <div className="space-y-2">
              {sacola.itens.map((item) => (
                <div
                  key={item.produto.id}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-border/40 last:border-0"
                >
                  <div className="flex-1 pr-2 truncate">
                    <span className="font-medium text-foreground truncate block">
                      {item.produto.nome}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.quantidade}x {item.produto.preco.formatado}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-950 font-outfit text-sm">
                      {item.subtotal.formatado}
                    </span>
                    <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => sacola.atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                        disabled={item.quantidade <= 1}
                        className="px-2 py-0.5 text-xs hover:bg-muted disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantidade}</span>
                      <button
                        onClick={() => sacola.atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                        className="px-2 py-0.5 text-xs hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barra Principal */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setExpandida(!expandida)}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-900 group-hover:bg-brand-200 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-800 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {sacola.quantidadeTotal}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">Total da Sacola</span>
                {expandida ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <span className="text-lg font-bold text-brand-950 font-outfit">
                {sacola.valorTotal.formatado}
              </span>
            </div>
          </button>

          <div className="w-44 sm:w-56">
            <WhatsAppButton size="sm" onClick={concluirPedidoSacola}>
              Fechar Pedido
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}

