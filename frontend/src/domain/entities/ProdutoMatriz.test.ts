import { describe, it, expect } from 'vitest';
import { ProdutoMatriz } from './ProdutoMatriz';
import { Preco } from '../value-objects/Preco';
import { UrlExterna } from '../value-objects/UrlExterna';

describe('Entidade: ProdutoMatriz (Destaque Matriz / Afiliada)', () => {
  const propsValidas = {
    id: 'matriz-001',
    nome: 'Colágeno Hidrolisado em Pó',
    preco: new Preco(119.9),
    urlOrigem: new UrlExterna('https://atlanticanaturalbr.com.br/produto/colageno'),
    urlAfiliada: new UrlExterna('https://atlanticanaturalbr.com.br/produto/colageno?ref=revendedora123'),
    imagemUrl: 'https://exemplo.com/colageno.jpg',
    descricao: 'Suplemento rico em vitaminas e minerais.',
    ativo: true,
  };

  it('deve instanciar um ProdutoMatriz válido', () => {
    const produto = new ProdutoMatriz(propsValidas);
    expect(produto.id).toBe('matriz-001');
    expect(produto.nome).toBe('Colágeno Hidrolisado em Pó');
    expect(produto.preco.valor).toBe(119.9);
    expect(produto.urlAfiliada.valor).toContain('ref=revendedora123');
    expect(produto.ativo).toBe(true);
  });

  it('deve lançar erro se o nome for vazio', () => {
    expect(
      () =>
        new ProdutoMatriz({
          ...propsValidas,
          nome: '',
        })
    ).toThrow('O nome do produto da matriz é obrigatório');
  });

  it('deve inativar e ativar o destaque', () => {
    const produto = new ProdutoMatriz(propsValidas);
    produto.inativar();
    expect(produto.ativo).toBe(false);

    produto.ativar();
    expect(produto.ativo).toBe(true);
  });
});
