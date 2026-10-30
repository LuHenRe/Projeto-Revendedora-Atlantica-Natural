import { describe, it, expect } from 'vitest';
import { ItemSacola } from './ItemSacola';
import { Produto } from './Produto';
import { Preco } from '../value-objects/Preco';

describe('Entidade: ItemSacola (Mini-Sacola de Pronta-Entrega)', () => {
  const produto = new Produto({
    id: 'prod-001',
    nome: 'Óleo de Alecrim 10ml',
    preco: new Preco(40.0),
    quantidadeEstoque: 5,
    categoriaId: 'cat-001',
    ativo: true,
  });

  it('deve instanciar um ItemSacola calculando subtotal', () => {
    const item = new ItemSacola(produto, 2);
    expect(item.produto.id).toBe('prod-001');
    expect(item.quantidade).toBe(2);
    expect(item.subtotal.valor).toBe(80.0);
    expect(item.subtotal.formatado).toBe('R$\u00a080,00');
  });

  it('deve lançar erro se a quantidade for menor que 1', () => {
    expect(() => new ItemSacola(produto, 0)).toThrow('A quantidade deve ser no mínimo 1');
    expect(() => new ItemSacola(produto, -1)).toThrow('A quantidade deve ser no mínimo 1');
  });

  it('deve permitir incrementar e decrementar a quantidade respeitando limites', () => {
    const item = new ItemSacola(produto, 1);
    item.incrementar(2);
    expect(item.quantidade).toBe(3);
    expect(item.subtotal.valor).toBe(120.0);

    item.decrementar(1);
    expect(item.quantidade).toBe(2);
    expect(item.subtotal.valor).toBe(80.0);
  });

  it('deve lançar erro ao tentar decrementar para quantidade menor que 1', () => {
    const item = new ItemSacola(produto, 1);
    expect(() => item.decrementar(1)).toThrow('A quantidade mínima é 1');
  });
});
