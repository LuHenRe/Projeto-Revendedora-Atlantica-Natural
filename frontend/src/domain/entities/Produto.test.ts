import { describe, it, expect } from 'vitest';
import { Produto } from './Produto';
import { Preco } from '../value-objects/Preco';

describe('Entidade: Produto (Estoque Local)', () => {
  const produtoValidoProps = {
    id: 'prod-001',
    nome: 'Óleo Essencial de Melaleuca 10ml',
    preco: new Preco(59.9),
    quantidadeEstoque: 10,
    categoriaId: 'cat-001',
    imagemUrl: 'https://exemplo.com/melaleuca.jpg',
    ativo: true,
  };

  it('deve instanciar um Produto válido', () => {
    const produto = new Produto(produtoValidoProps);
    expect(produto.id).toBe('prod-001');
    expect(produto.nome).toBe('Óleo Essencial de Melaleuca 10ml');
    expect(produto.preco.valor).toBe(59.9);
    expect(produto.quantidadeEstoque).toBe(10);
    expect(produto.ativo).toBe(true);
    expect(produto.temEstoqueDisponivel()).toBe(true);
    expect(produto.isDisponivelParaProntaEntrega()).toBe(true);
  });

  it('deve indicar indisponibilidade se o estoque for 0', () => {
    const produto = new Produto({
      ...produtoValidoProps,
      quantidadeEstoque: 0,
    });
    expect(produto.temEstoqueDisponivel()).toBe(false);
    expect(produto.isDisponivelParaProntaEntrega()).toBe(false);
  });

  it('deve indicar indisponibilidade se o produto estiver inativo', () => {
    const produto = new Produto({
      ...produtoValidoProps,
      ativo: false,
    });
    expect(produto.temEstoqueDisponivel()).toBe(true);
    expect(produto.isDisponivelParaProntaEntrega()).toBe(false);
  });

  it('deve lançar erro se o nome for vazio', () => {
    expect(
      () =>
        new Produto({
          ...produtoValidoProps,
          nome: '',
        })
    ).toThrow('O nome do produto não pode ser vazio');
  });

  it('deve lançar erro se a quantidade de estoque for negativa', () => {
    expect(
      () =>
        new Produto({
          ...produtoValidoProps,
          quantidadeEstoque: -5,
        })
    ).toThrow('A quantidade em estoque não pode ser negativa');
  });

  it('deve permitir inativar e ativar o produto logicamente', () => {
    const produto = new Produto(produtoValidoProps);
    expect(produto.ativo).toBe(true);

    produto.inativar();
    expect(produto.ativo).toBe(false);
    expect(produto.isDisponivelParaProntaEntrega()).toBe(false);

    produto.ativar();
    expect(produto.ativo).toBe(true);
    expect(produto.isDisponivelParaProntaEntrega()).toBe(true);
  });

  it('deve atualizar o estoque e refletir disponibilidade', () => {
    const produto = new Produto(produtoValidoProps);
    produto.atualizarEstoque(0);
    expect(produto.quantidadeEstoque).toBe(0);
    expect(produto.temEstoqueDisponivel()).toBe(false);

    produto.atualizarEstoque(15);
    expect(produto.quantidadeEstoque).toBe(15);
    expect(produto.temEstoqueDisponivel()).toBe(true);
  });
});
