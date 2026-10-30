'use client';

import { useState, useEffect, useCallback } from 'react';
import { env } from '../../infrastructure/config/env';
import { ValidarRegiaoAtendimentoUseCase } from '../../application/use-cases/ValidarRegiaoAtendimento';
import { LocalStorageAdapter } from '../../infrastructure/storage/LocalStorageAdapter';

const useCase = new ValidarRegiaoAtendimentoUseCase(env.cidadeAtendimento);

export function useTravaGeografica() {
  const [cidadeConfirmada, setCidadeConfirmada] = useState<string | null>(null);
  const [isModalAberta, setIsModalAberta] = useState(false);
  const [isCarregado, setIsCarregado] = useState(false);

  useEffect(() => {
    const salvo = LocalStorageAdapter.getRegiaoConfirmada();
    if (salvo) {
      setCidadeConfirmada(salvo);
    }
    setIsCarregado(true);
  }, []);

  const abrirModal = useCallback(() => {
    setIsModalAberta(true);
  }, []);

  const fecharModal = useCallback(() => {
    setIsModalAberta(false);
  }, []);

  const validarEConfirmar = useCallback(
    (cidade: string) => {
      try {
        const resultado = useCase.execute(cidade);
        if (resultado.autorizado) {
          setCidadeConfirmada(resultado.cidadeConfirmada);
          LocalStorageAdapter.setRegiaoConfirmada(resultado.cidadeConfirmada);
          setIsModalAberta(false);
        }
        return resultado;
      } catch (err: unknown) {
        return {
          autorizado: false,
          cidadeConfirmada: cidade,
          mensagemOrientacao: err instanceof Error ? err.message : 'Cidade inválida',
        };
      }
    },
    []
  );

  const redefinirRegiao = useCallback(() => {
    setCidadeConfirmada(null);
    LocalStorageAdapter.clearRegiaoConfirmada();
  }, []);

  return {
    isRegiaoConfirmada: !!cidadeConfirmada,
    cidadeConfirmada,
    isModalAberta,
    isCarregado,
    regiaoPadrao: env.cidadeAtendimento,
    abrirModal,
    fecharModal,
    validarEConfirmar,
    redefinirRegiao,
  };
}

