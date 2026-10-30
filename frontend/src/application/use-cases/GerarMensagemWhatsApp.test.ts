import { describe, it, expect } from 'vitest';
import { GerarMensagemWhatsAppUseCase } from './GerarMensagemWhatsApp';
import { Produto } from '../../domain/entities/Produto';
import { Preco } from '../../domain/value-objects/Preco';
import { ItemSacola } from '../../domain/entities/ItemSacola';

describe('Caso de Uso: GerarMensagemWhatsApp (Conversão Multimodal)', () => {
  const whatsappPadrao = '5561999998888';
  const useCase = new GerarMensagemWhatsAppUseCase(whatsappPadrao);

  const produto1 = new Produto({
    id: 'prod-01',
    nome: 'Óleo Essencial de Lavanda 10ml',
    preco: new Preco(45.9),
    quantidadeEstoque: 5,
    categoriaId: 'cat-1',
  });

  const produto2 = new Produto({
    id: 'prod-02',
    nome: 'Difusor de Aromas Ultrassônico',
    preco: new Preco(150.0),
    quantidadeEstoque: 2,
    categoriaId: 'cat-2',
  });

  it('deve gerar link de compra em 1 clique para um único produto com cidade confirmada', () => {
    const link = useCase.gerarParaItemUnico(produto1, 'Valparaíso de Goiás');
    expect(link).toContain('https://wa.me/5561999998888?text=');
    const url = new URL(link);
    const texto = url.searchParams.get('text');
    expect(texto).toContain('Óleo Essencial de Lavanda 10ml');
    expect(texto).toContain('R$\u00a045,90');
    expect(texto).toContain('Valparaíso de Goiás');
  });

  it('deve gerar link agrupado para sacola com múltiplos itens calculando o valor total', () => {
    const itens = [new ItemSacola(produto1, 2), new ItemSacola(produto2, 1)];

    const link = useCase.gerarParaSacola(itens, 'Brasília');
    expect(link).toContain('https://wa.me/5561999998888?text=');
    const url = new URL(link);
    const texto = url.searchParams.get('text');

    expect(texto).toContain('2x *Óleo Essencial de Lavanda 10ml*');
    expect(texto).toContain('1x *Difusor de Aromas Ultrassônico*');
    expect(texto).toContain('Total estimado: R$\u00a0241,80');
    expect(texto).toContain('Brasília');
  });

  it('deve lançar erro se a sacola de itens estiver vazia', () => {
    expect(() => useCase.gerarParaSacola([], 'Brasília')).toThrow('A sacola de compras está vazia');
  });
});
