import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroBanner } from './HeroBanner';
import * as VitrineContextModule from '../../context/VitrineContext';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, fill, sizes, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

describe('Componente: HeroBanner', () => {
  const mockTirarDuvidaGeral = vi.fn();

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
        valorTotal: { valor: 0, formatar: () => 'R$ 0,00' } as any,
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

  it('deve renderizar o título sem sublinhado ou ondulação no texto Bem-Estar', () => {
    render(<HeroBanner />);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo.textContent).toContain('Sua Vitrine de Bem-Estar e Cosméticos Naturais');

    const spanBemEstar = screen.getByText('Bem-Estar');
    expect(spanBemEstar.className).not.toContain('underline');
    expect(spanBemEstar.className).not.toContain('decoration-wavy');
  });

  it('deve chamar tirarDuvidaGeral ao clicar em Falar com a Consultora', () => {
    render(<HeroBanner />);

    const botaoConsultora = screen.getByRole('button', { name: /falar com a consultora/i });
    fireEvent.click(botaoConsultora);

    expect(mockTirarDuvidaGeral).toHaveBeenCalledTimes(1);
  });

  it('deve rolar até a seção pronta entrega ao clicar em Ver Pronta-Entrega', () => {
    const scrollIntoViewMock = vi.fn();
    const secaoMock = document.createElement('div');
    secaoMock.id = 'secao-pronta-entrega';
    secaoMock.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(secaoMock);

    render(<HeroBanner />);

    const botaoProntaEntrega = screen.getByRole('button', { name: /ver pronta-entrega/i });
    fireEvent.click(botaoProntaEntrega);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(secaoMock);
  });

  it('deve renderizar a imagem em destaque com caminho correto', () => {
    render(<HeroBanner />);
    const imagem = screen.getByAltText(/Produtos Naturais e Bem-Estar/i);
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveAttribute('src', '/images/hero-destaque.jpg');
  });
});

