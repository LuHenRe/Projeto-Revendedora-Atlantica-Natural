import { describe, it, expect } from 'vitest';
import { Preco } from './Preco';

describe('Value Object: Preco', () => {
  it('deve criar uma instância válida de Preço com valor positivo', () => {
    const preco = new Preco(45.9);
    expect(preco.valor).toBe(45.9);
    expect(preco.formatado).toBe('R$\u00a045,90');
  });

  it('deve formatar valores inteiros com duas casas decimais', () => {
    const preco = new Preco(50);
    expect(preco.formatado).toBe('R$\u00a050,00');
  });

  it('deve aceitar zero como preço válido (ex: brinde promocional)', () => {
    const preco = new Preco(0);
    expect(preco.valor).toBe(0);
    expect(preco.formatado).toBe('R$\u00a00,00');
  });

  it('deve lançar erro ao tentar criar Preço com valor negativo', () => {
    expect(() => new Preco(-10)).toThrow('O preço não pode ser negativo');
  });

  it('deve lançar erro se o valor não for um número válido (NaN)', () => {
    expect(() => new Preco(Number.NaN)).toThrow('O preço deve ser um número válido');
  });

  it('deve comparar igualdade de dois preços pelo valor (Value Object imutável)', () => {
    const preco1 = new Preco(99.9);
    const preco2 = new Preco(99.9);
    const preco3 = new Preco(120.0);

    expect(preco1.equals(preco2)).toBe(true);
    expect(preco1.equals(preco3)).toBe(false);
  });
});
