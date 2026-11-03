import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlocoDeepLinks } from './BlocoDeepLinks';
import { ProdutoMatrizDTO } from '../../../domain/entities/ProdutoMatriz';

vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

describe('Componente: BlocoDeepLinks', () => {
  const mockDestaquesDTO: ProdutoMatrizDTO[] = [
    {
      id: 'matriz-1',
      nome: 'Ômega 3 Puro',
      preco: { valor: 89.9, formatado: 'R$ 89,90' },
      urlOrigem: { valor: 'https://atlanticanaturalbr.com.br/produto/omega-3' },
      urlAfiliada: { valor: 'https://atlanticanaturalbr.com.br/produto/omega-3?ref=rev' },
      imagemUrl: null,
      descricao: 'Cápsulas de óleo de peixe concentrado',
      ativo: true,
    },
  ];

  it('deve renderizar destaques da matriz a partir de DTOs', () => {
    render(<BlocoDeepLinks destaquesMatriz={mockDestaquesDTO} />);

    expect(screen.getByText('Destaques Oficiais da Matriz')).toBeDefined();
    expect(screen.getByText('Ômega 3 Puro')).toBeDefined();
    expect(screen.getByText('R$ 89,90')).toBeDefined();
  });

  it('não deve renderizar a seção se a lista estiver vazia', () => {
    const { container } = render(<BlocoDeepLinks destaquesMatriz={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

