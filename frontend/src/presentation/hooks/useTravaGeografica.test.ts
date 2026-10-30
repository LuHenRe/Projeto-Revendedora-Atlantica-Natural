import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTravaGeografica } from './useTravaGeografica';
import { LocalStorageAdapter } from '../../infrastructure/storage/LocalStorageAdapter';

describe('Hook: useTravaGeografica', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com região não confirmada e modal fechado', () => {
    const { result } = renderHook(() => useTravaGeografica());
    expect(result.current.isRegiaoConfirmada).toBe(false);
    expect(result.current.cidadeConfirmada).toBeNull();
    expect(result.current.isModalAberta).toBe(false);
  });

  it('deve validar e confirmar cidade autorizada, salvando no LocalStorage', () => {
    const { result } = renderHook(() => useTravaGeografica());

    act(() => {
      const res = result.current.validarEConfirmar('Valparaíso de Goiás');
      expect(res.autorizado).toBe(true);
    });

    expect(result.current.isRegiaoConfirmada).toBe(true);
    expect(result.current.cidadeConfirmada).toBe('Valparaíso de Goiás');
    expect(LocalStorageAdapter.getRegiaoConfirmada()).toBe('Valparaíso de Goiás');
  });

  it('deve retornar não autorizado e não confirmar caso a cidade seja de fora da região', () => {
    const { result } = renderHook(() => useTravaGeografica());

    act(() => {
      const res = result.current.validarEConfirmar('São Paulo');
      expect(res.autorizado).toBe(false);
      expect(res.mensagemOrientacao).toBeDefined();
    });

    expect(result.current.isRegiaoConfirmada).toBe(false);
    expect(LocalStorageAdapter.getRegiaoConfirmada()).toBeNull();
  });

  it('deve abrir e fechar a modal de confirmação', () => {
    const { result } = renderHook(() => useTravaGeografica());

    act(() => {
      result.current.abrirModal();
    });
    expect(result.current.isModalAberta).toBe(true);

    act(() => {
      result.current.fecharModal();
    });
    expect(result.current.isModalAberta).toBe(false);
  });

  it('deve redefinir a região apagando a confirmação', () => {
    const { result } = renderHook(() => useTravaGeografica());

    act(() => {
      result.current.validarEConfirmar('Brasília');
    });
    expect(result.current.isRegiaoConfirmada).toBe(true);

    act(() => {
      result.current.redefinirRegiao();
    });
    expect(result.current.isRegiaoConfirmada).toBe(false);
    expect(result.current.cidadeConfirmada).toBeNull();
  });
});

