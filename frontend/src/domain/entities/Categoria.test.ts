import { describe, it, expect } from 'vitest';
import { Categoria } from './Categoria';

describe('Entidade: Categoria', () => {
  it('deve instanciar uma Categoria válida', () => {
    const categoria = new Categoria('123e4567-e89b-12d3-a456-426614174000', 'Óleos Essenciais');
    expect(categoria.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(categoria.nome).toBe('Óleos Essenciais');
  });

  it('deve lançar erro se o nome for vazio ou apenas espaços', () => {
    expect(() => new Categoria('123', '')).toThrow('O nome da categoria não pode ser vazio');
    expect(() => new Categoria('123', '   ')).toThrow('O nome da categoria não pode ser vazio');
  });

  it('deve atualizar o nome da categoria com validação', () => {
    const categoria = new Categoria('123', 'Perfumaria');
    categoria.atualizarNome('Perfumaria Fina');
    expect(categoria.nome).toBe('Perfumaria Fina');
  });
});
