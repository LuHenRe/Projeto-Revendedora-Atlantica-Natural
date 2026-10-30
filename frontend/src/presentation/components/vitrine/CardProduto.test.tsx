import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardProduto } from './CardProduto';
import { Produto } from '../../../domain/entities/Produto';
import { Categoria } from '../../../domain/entities/Categoria';
import { Preco } from '../../../domain/value-objects/Preco';
import * as VitrineContextModule from '../../context/VitrineContext';

// Mock do next/image para renderizar uma tag <img> simples
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

describe('Componente: CardProduto', () => {
  const mockSolicitarCompra = vi.fn();
  const mockAdicionarProduto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: false,
      cidadeConfirmada: null,
      isModalAberta: false,
      regiaoPadrao: 'Valparaíso de Goiás',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [],
        quantidadeTotal: 0,
        valorTotal: new Preco(0),
        temItens: false,
        adicionarProduto: mockAdicionarProduto,
        removerProduto: vi.fn(),
        atualizarQuantidade: vi.fn(),
        limparSacola: vi.fn(),
      },
      solicitarCompraProduto: mockSolicitarCompra,
      concluirPedidoSacola: vi.fn(),
      tirarDuvidaGeral: vi.fn(),
    });
  });

  const categoria = new Categoria('cat-1', 'Óleos Essenciais');

  it('deve renderizar os detalhes do produto com estoque disponível', () => {
    const produto = new Produto({
      id: 'prod-1',
      nome: 'Óleo de Melaleuca 10ml',
      preco: new Preco(49.9),
      quantidadeEstoque: 5,
      categoriaId: 'cat-1',
      categoria: categoria,
      imagemUrl: 'https://exemplo.com/oleo.jpg',
      ativo: true,
    });

    render(<CardProduto produto={produto} />);

    expect(screen.getByText('Óleo de Melaleuca 10ml')).toBeDefined();
    expect(screen.getByText('R$ 49,90')).toBeDefined();
    expect(screen.getByText('Óleos Essenciais')).toBeDefined();
    expect(screen.getByText('Pronta-Entrega')).toBeDefined();
  });

  it('deve exibir badge de Esgotado e desabilitar botões quando quantidade for zero', () => {
    const produtoEsgotado = new Produto({
      id: 'prod-2',
      nome: 'Creme Hidratante Facial',
      preco: new Preco(89.0),
      quantidadeEstoque: 0,
      categoriaId: 'cat-1',
      categoria: categoria,
      ativo: true,
    });

    render(<CardProduto produto={produtoEsgotado} />);

    expect(screen.getByText('Esgotado')).toBeDefined();

    const btnWhats = screen.getByRole('button', { name: /Pedir no WhatsApp/i });
    expect(btnWhats).toHaveProperty('disabled', true);

    const btnSacola = screen.getByRole('button', { name: /Adicionar à sacola de pedidos/i });
    expect(btnSacola).toHaveProperty('disabled', true);
  });

  it('deve acionar solicitarCompraProduto ao clicar no botão de WhatsApp', () => {
    const produto = new Produto({
      id: 'prod-1',
      nome: 'Óleo de Melaleuca 10ml',
      preco: new Preco(49.9),
      quantidadeEstoque: 5,
      categoriaId: 'cat-1',
      categoria: categoria,
    });

    render(<CardProduto produto={produto} />);

    const btnWhats = screen.getByRole('button', { name: /Pedir no WhatsApp/i });
    fireEvent.click(btnWhats);

    expect(mockSolicitarCompra).toHaveBeenCalledWith(produto);
  });

  it('deve adicionar o produto à sacola ao clicar no botão de sacola', () => {
    const produto = new Produto({
      id: 'prod-1',
      nome: 'Óleo de Melaleuca 10ml',
      preco: new Preco(49.9),
      quantidadeEstoque: 5,
      categoriaId: 'cat-1',
      categoria: categoria,
    });

    render(<CardProduto produto={produto} />);

    const btnSacola = screen.getByRole('button', { name: /Adicionar à sacola de pedidos/i });
    fireEvent.click(btnSacola);

    expect(mockAdicionarProduto).toHaveBeenCalledWith(produto, 1);
  });
});
