'use client';

import { useCallback } from 'react';
import { env } from '../../infrastructure/config/env';
import { Produto } from '../../domain/entities/Produto';
import { ItemSacola } from '../../domain/entities/ItemSacola';
import { GerarMensagemWhatsAppUseCase } from '../../application/use-cases/GerarMensagemWhatsApp';
import { AnalyticsTracker } from '../../infrastructure/analytics/tracker';

const useCase = new GerarMensagemWhatsAppUseCase(env.whatsappNumber);

export function useWhatsApp() {
  const comprarProdutoDireto = useCallback((produto: Produto, cidadeConfirmada?: string | null) => {
    const link = useCase.gerarParaItemUnico(produto, cidadeConfirmada ?? undefined);

    AnalyticsTracker.track('lead_whatsapp_direto', {
      produtoId: produto.id,
      produtoNome: produto.nome,
      valor: produto.preco.valor,
      cidade: cidadeConfirmada ?? undefined,
    });

    if (typeof window !== 'undefined') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }

    return link;
  }, []);

  const comprarSacola = useCallback((itens: ItemSacola[], cidadeConfirmada?: string | null) => {
    if (!itens.length) return '';

    const link = useCase.gerarParaSacola(itens, cidadeConfirmada ?? undefined);
    const total = itens.reduce((acc, i) => acc + i.subtotal.valor, 0);

    AnalyticsTracker.track('lead_whatsapp_sacola', {
      valor: total,
      quantidadeItens: itens.reduce((acc, i) => acc + i.quantidade, 0),
      cidade: cidadeConfirmada ?? undefined,
    });

    if (typeof window !== 'undefined') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }

    return link;
  }, []);

  const tirarDuvidaGeral = useCallback(() => {
    const mensagem = 'Olá! Gostaria de tirar algumas dúvidas sobre os produtos e disponibilidade da Atlântica Natural.';
    const link = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(mensagem)}`;

    if (typeof window !== 'undefined') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }

    return link;
  }, []);

  return {
    numeroWhatsApp: env.whatsappNumber,
    comprarProdutoDireto,
    comprarSacola,
    tirarDuvidaGeral,
  };
}

