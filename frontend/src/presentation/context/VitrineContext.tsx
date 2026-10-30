'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useTravaGeografica } from '../hooks/useTravaGeografica';
import { useSacola } from '../hooks/useSacola';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Produto } from '../../domain/entities/Produto';

interface VitrineContextData {
  // Trava Geográfica
  isRegiaoConfirmada: boolean;
  cidadeConfirmada: string | null;
  isModalAberta: boolean;
  regiaoPadrao: string;
  abrirModalTrava: () => void;
  fecharModalTrava: () => void;
  confirmarRegiao: (cidade: string) => { autorizado: boolean; mensagemOrientacao?: string };
  redefinirRegiao: () => void;

  // Sacola de Pronta-Entrega
  sacola: ReturnType<typeof useSacola>;

  // Fluxo de Compra Integrado
  solicitarCompraProduto: (produto: Produto) => void;
  concluirPedidoSacola: () => void;
  tirarDuvidaGeral: () => void;
}

const VitrineContext = createContext<VitrineContextData | null>(null);

export function VitrineProvider({ children }: { children: React.ReactNode }) {
  const trava = useTravaGeografica();
  const sacola = useSacola();
  const whatsApp = useWhatsApp();

  const [produtoPendente, setProdutoPendente] = useState<Produto | null>(null);

  const solicitarCompraProduto = useCallback(
    (produto: Produto) => {
      if (trava.isRegiaoConfirmada && trava.cidadeConfirmada) {
        whatsApp.comprarProdutoDireto(produto, trava.cidadeConfirmada);
      } else {
        setProdutoPendente(produto);
        trava.abrirModal();
      }
    },
    [trava, whatsApp]
  );

  const confirmarRegiaoComEfeito = useCallback(
    (cidade: string) => {
      const res = trava.validarEConfirmar(cidade);
      if (res.autorizado && produtoPendente) {
        whatsApp.comprarProdutoDireto(produtoPendente, res.cidadeConfirmada);
        setProdutoPendente(null);
      }
      return res;
    },
    [trava, whatsApp, produtoPendente]
  );

  const concluirPedidoSacola = useCallback(() => {
    if (!sacola.temItens) return;

    if (trava.isRegiaoConfirmada && trava.cidadeConfirmada) {
      whatsApp.comprarSacola(sacola.itens, trava.cidadeConfirmada);
    } else {
      trava.abrirModal();
    }
  }, [sacola, trava, whatsApp]);

  const value = useMemo(
    () => ({
      isRegiaoConfirmada: trava.isRegiaoConfirmada,
      cidadeConfirmada: trava.cidadeConfirmada,
      isModalAberta: trava.isModalAberta,
      regiaoPadrao: trava.regiaoPadrao,
      abrirModalTrava: trava.abrirModal,
      fecharModalTrava: trava.fecharModal,
      confirmarRegiao: confirmarRegiaoComEfeito,
      redefinirRegiao: trava.redefinirRegiao,
      sacola,
      solicitarCompraProduto,
      concluirPedidoSacola,
      tirarDuvidaGeral: whatsApp.tirarDuvidaGeral,
    }),
    [trava, sacola, whatsApp, confirmarRegiaoComEfeito, solicitarCompraProduto, concluirPedidoSacola]
  );

  return <VitrineContext.Provider value={value}>{children}</VitrineContext.Provider>;
}

export function useVitrine() {
  const context = useContext(VitrineContext);
  if (!context) {
    throw new Error('useVitrine deve ser utilizado dentro de um VitrineProvider');
  }
  return context;
}

