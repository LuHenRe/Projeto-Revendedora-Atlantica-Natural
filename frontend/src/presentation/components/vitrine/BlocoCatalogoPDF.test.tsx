import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlocoCatalogoPDF } from './BlocoCatalogoPDF';

describe('Componente: BlocoCatalogoPDF', () => {
  it('deve renderizar o título da seção e ambos os botões de ação com visibilidade adequada', () => {
    render(<BlocoCatalogoPDF />);

    expect(screen.getByText('Catálogo Digital Completo')).toBeInTheDocument();
    expect(screen.getByText('Baixar Catálogo PDF')).toBeInTheDocument();

    const botaoVisualizar = screen.getByText('Visualizar na Tela');
    expect(botaoVisualizar).toBeInTheDocument();
  });
});

