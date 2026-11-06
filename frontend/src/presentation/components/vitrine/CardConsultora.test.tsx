import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardConsultora } from './CardConsultora';
import * as VitrineContextModule from '../../context/VitrineContext';

describe('Componente: CardConsultora', () => {
  const mockTirarDuvidaGeral = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: true,
      cidadeConfirmada: 'Varginha',
      isModalAberta: false,
      regiaoPadrao: 'Varginha',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [],
        quantidadeTotal: 0,
        valorTotal: { valor: 0, formatado: 'R$ 0,00' } as any,
        temItens: false,
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: vi.fn(),
        limparSacola: vi.fn(),
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: vi.fn(),
      tirarDuvidaGeral: mockTirarDuvidaGeral,
    });
  });

  it('deve renderizar a mensagem humanizada e o nome da consultora Valesca', () => {
    render(<CardConsultora />);

    expect(screen.getByText('Valesca Braga dos Reis')).toBeInTheDocument();
    expect(screen.getByText(/Atendimento Pessoal & Consultoria/i)).toBeInTheDocument();
    expect(screen.getByText(/Varginha e região/i)).toBeInTheDocument();
  });

  it('deve disparar tirarDuvidaGeral ao clicar no botão de contato', () => {
    render(<CardConsultora />);

    const botao = screen.getByRole('button', { name: /Tirar Dúvidas com a Valesca/i });
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);
    expect(mockTirarDuvidaGeral).toHaveBeenCalledTimes(1);
  });
});
