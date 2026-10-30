import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BarraSacolaFlutuante } from './BarraSacolaFlutuante';
import { Produto } from '../../../domain/entities/Produto';
import { ItemSacola } from '../../../domain/entities/ItemSacola';
import { Preco } from '../../../domain/value-objects/Preco';
import * as VitrineContextModule from '../../context/VitrineContext';

describe('Componente: BarraSacolaFlutuante', () => {
  const mockConcluirPedido = vi.fn();
  const mockLimparSacola = vi.fn();
  const mockAtualizarQuantidade = vi.fn();

  const produto1 = new Produto({
    id: 'prod-1',
    nome: 'Óleo de Melaleuca 10ml',
    preco: new Preco(49.9),
    quantidadeEstoque: 10,
    categoriaId: 'cat-1',
  });
  const item1 = new ItemSacola(produto1, 2);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve renderizar nada quando a sacola estiver vazia', () => {
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
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: vi.fn(),
        limparSacola: vi.fn(),
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: mockConcluirPedido,
      tirarDuvidaGeral: vi.fn(),
    });

    const { container } = render(<BarraSacolaFlutuante />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar a barra flutuante com dados corretos quando houver itens', () => {
    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: true,
      cidadeConfirmada: 'Valparaíso de Goiás',
      isModalAberta: false,
      regiaoPadrao: 'Valparaíso de Goiás',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [item1],
        quantidadeTotal: 2,
        valorTotal: new Preco(99.8),
        temItens: true,
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: mockAtualizarQuantidade,
        limparSacola: mockLimparSacola,
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: mockConcluirPedido,
      tirarDuvidaGeral: vi.fn(),
    });

    render(<BarraSacolaFlutuante />);

    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('Total da Sacola')).toBeDefined();
    expect(screen.getByText('R$ 99,80')).toBeDefined();
    expect(screen.getByRole('button', { name: /Fechar Pedido/i })).toBeDefined();
  });

  it('deve chamar concluirPedidoSacola ao clicar no botão Fechar Pedido', () => {
    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: true,
      cidadeConfirmada: 'Valparaíso de Goiás',
      isModalAberta: false,
      regiaoPadrao: 'Valparaíso de Goiás',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [item1],
        quantidadeTotal: 2,
        valorTotal: new Preco(99.8),
        temItens: true,
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: mockAtualizarQuantidade,
        limparSacola: mockLimparSacola,
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: mockConcluirPedido,
      tirarDuvidaGeral: vi.fn(),
    });

    render(<BarraSacolaFlutuante />);

    const btnFechar = screen.getByRole('button', { name: /Fechar Pedido/i });
    fireEvent.click(btnFechar);

    expect(mockConcluirPedido).toHaveBeenCalledTimes(1);
  });

  it('deve abrir a gaveta de itens e permitir limpar a sacola', () => {
    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: true,
      cidadeConfirmada: 'Valparaíso de Goiás',
      isModalAberta: false,
      regiaoPadrao: 'Valparaíso de Goiás',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [item1],
        quantidadeTotal: 2,
        valorTotal: new Preco(99.8),
        temItens: true,
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: mockAtualizarQuantidade,
        limparSacola: mockLimparSacola,
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: mockConcluirPedido,
      tirarDuvidaGeral: vi.fn(),
    });

    render(<BarraSacolaFlutuante />);

    // Clica no resumo para expandir
    const resumo = screen.getByText('Total da Sacola');
    fireEvent.click(resumo);

    // Agora o item detalhado deve estar visível
    expect(screen.getByText('Itens Selecionados (2)')).toBeDefined();
    expect(screen.getByText('Óleo de Melaleuca 10ml')).toBeDefined();

    // Clica em Limpar
    const btnLimpar = screen.getByRole('button', { name: /Limpar/i });
    fireEvent.click(btnLimpar);

    expect(mockLimparSacola).toHaveBeenCalledTimes(1);
  });
});
