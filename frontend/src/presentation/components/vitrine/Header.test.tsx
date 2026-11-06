import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { ThemeProvider } from '../../context/ThemeContext';
import * as VitrineContextModule from '../../context/VitrineContext';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { priority, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

describe('Componente: Header', () => {
  const mockAbrirModalTrava = vi.fn();
  const mockTirarDuvidaGeral = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: true,
      cidadeConfirmada: 'Varginha',
      isModalAberta: false,
      regiaoPadrao: 'Varginha',
      abrirModalTrava: mockAbrirModalTrava,
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [],
        quantidadeTotal: 3,
        valorTotal: { valor: 150, formatado: 'R$ 150,00' } as any,
        temItens: true,
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

  const renderHeader = () =>
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

  it('deve renderizar a logo oficial da Atlântica Natural e o nome da revendedora autorizada', () => {
    renderHeader();
    const logo = screen.getByAltText('Logo Atlântica Natural');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo-atlantica.png');

    expect(
      screen.getByText('Valesca Braga dos Reis - Revendedora Autorizada Atlântica Natural')
    ).toBeInTheDocument();
  });

  it('deve renderizar os botões com ícones e textos explicativos (Atendimento, Área do Revendedor, Minha Sacola)', () => {
    renderHeader();

    // Atendimento com texto
    expect(screen.getAllByText('Atendimento')[0]).toBeInTheDocument();
    expect(screen.getByText('Fale Conosco')).toBeInTheDocument();

    // Área do Revendedor (topo institucional)
    expect(screen.getByText('Área do Revendedor')).toBeInTheDocument();

    // Minha Sacola com texto e badge
    expect(screen.getByText('Minha Sacola')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('deve exibir a região de entrega e disparar abertura da modal ao clicar', () => {
    renderHeader();
    const btnRegiao = screen.getByTitle('Clique para alterar a cidade de entrega');
    expect(btnRegiao).toHaveTextContent('Entregando em: Varginha');

    fireEvent.click(btnRegiao);
    expect(mockAbrirModalTrava).toHaveBeenCalledTimes(1);
  });

  it('deve permitir busca por produtos redirecionando para a rota de catálogo com query params', () => {
    renderHeader();

    const inputs = screen.getAllByPlaceholderText(/Digite o que você procura|O que você procura/i);
    const inputDesktop = inputs[0];

    fireEvent.change(inputDesktop, { target: { value: 'Melaleuca' } });
    fireEvent.submit(inputDesktop.closest('form')!);

    expect(mockPush).toHaveBeenCalledWith('/produtos?busca=Melaleuca');
  });

  it('deve conter links de navegação rápida para todas as seções e categorias da loja', () => {
    renderHeader();

    expect(screen.getAllByText('Pronta-Entrega')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Óleos Essenciais')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cosméticos')[0]).toBeInTheDocument();
    expect(screen.getByText('Catálogo Completo')).toBeInTheDocument();
    expect(screen.getByText('Matriz Oficial (Brasil)')).toBeInTheDocument();
    expect(screen.getAllByText('Revista PDF')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Seja um(a) Revendedor(a)')[0]).toBeInTheDocument();
  });

  it('deve renderizar o botão de alternador de tema apenas com ícone (sem texto de label)', () => {
    renderHeader();
    const toggleTema = screen.getByLabelText(/Ativar modo/i);
    expect(toggleTema).toBeInTheDocument();
    expect(toggleTema.textContent).toBe('');
  });
});
