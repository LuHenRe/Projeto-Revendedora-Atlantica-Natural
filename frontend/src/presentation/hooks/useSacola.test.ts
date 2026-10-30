import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSacola } from './useSacola';
import { Produto } from '../../domain/entities/Produto';
import { Preco } from '../../domain/value-objects/Preco';

describe('Hook: useSacola', () => {
  const produto1 = new Produto({
    id: 'p-1',
    nome: 'Óleo Essencial de Lavanda 10ml',
    preco: new Preco(45.0),
    quantidadeEstoque: 5,
    categoriaId: 'c-1',
  });

  const produto2 = new Produto({
    id: 'p-2',
    nome: 'Difusor',
    preco: new Preco(100.0),
    quantidadeEstoque: 3,
    categoriaId: 'c-2',
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com a sacola vazia', () => {
    const { result } = renderHook(() => useSacola());
    expect(result.current.itens).toHaveLength(0);
    expect(result.current.quantidadeTotal).toBe(0);
    expect(result.current.valorTotal.valor).toBe(0);
  });

  it('deve adicionar um produto à sacola e calcular totais', () => {
    const { result } = renderHook(() => useSacola());

    act(() => {
      result.current.adicionarProduto(produto1, 2);
    });

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.quantidadeTotal).toBe(2);
    expect(result.current.valorTotal.valor).toBe(90.0);
  });

  it('deve somar quantidade se o mesmo produto for adicionado novamente', () => {
    const { result } = renderHook(() => useSacola());

    act(() => {
      result.current.adicionarProduto(produto1, 1);
      result.current.adicionarProduto(produto1, 2);
    });

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.quantidadeTotal).toBe(3);
    expect(result.current.valorTotal.valor).toBe(135.0);
  });

  it('deve adicionar múltiplos produtos e calcular o total combinado', () => {
    const { result } = renderHook(() => useSacola());

    act(() => {
      result.current.adicionarProduto(produto1, 2); // 90.0
      result.current.adicionarProduto(produto2, 1); // 100.0
    });

    expect(result.current.itens).toHaveLength(2);
    expect(result.current.quantidadeTotal).toBe(3);
    expect(result.current.valorTotal.valor).toBe(190.0);
  });

  it('deve remover um item da sacola', () => {
    const { result } = renderHook(() => useSacola());

    act(() => {
      result.current.adicionarProduto(produto1, 1);
      result.current.adicionarProduto(produto2, 1);
    });

    act(() => {
      result.current.removerProduto('p-1');
    });

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].produto.id).toBe('p-2');
    expect(result.current.valorTotal.valor).toBe(100.0);
  });

  it('deve limpar a sacola', () => {
    const { result } = renderHook(() => useSacola());

    act(() => {
      result.current.adicionarProduto(produto1, 2);
      result.current.limparSacola();
    });

    expect(result.current.itens).toHaveLength(0);
    expect(result.current.quantidadeTotal).toBe(0);
    expect(result.current.valorTotal.valor).toBe(0);
  });
});

