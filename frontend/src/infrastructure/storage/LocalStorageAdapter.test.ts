import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from './LocalStorageAdapter';

describe('Infraestrutura: LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve armazenar e recuperar a região confirmada', () => {
    expect(LocalStorageAdapter.getRegiaoConfirmada()).toBeNull();

    LocalStorageAdapter.setRegiaoConfirmada('Valparaíso de Goiás');
    expect(LocalStorageAdapter.getRegiaoConfirmada()).toBe('Valparaíso de Goiás');

    LocalStorageAdapter.clearRegiaoConfirmada();
    expect(LocalStorageAdapter.getRegiaoConfirmada()).toBeNull();
  });

  it('deve armazenar e recuperar os itens da sacola', () => {
    expect(LocalStorageAdapter.getSacola()).toEqual([]);

    const itens = [
      { produtoId: 'p-1', quantidade: 2 },
      { produtoId: 'p-2', quantidade: 1 },
    ];

    LocalStorageAdapter.setSacola(itens);
    expect(LocalStorageAdapter.getSacola()).toEqual(itens);

    LocalStorageAdapter.clearSacola();
    expect(LocalStorageAdapter.getSacola()).toEqual([]);
  });
});
