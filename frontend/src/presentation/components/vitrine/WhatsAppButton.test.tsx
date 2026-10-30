import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WhatsAppButton } from './WhatsAppButton';

describe('Componente: WhatsAppButton', () => {
  it('deve renderizar com o texto padrão caso não haja children', () => {
    render(<WhatsAppButton />);
    expect(screen.getByText('Pedir no WhatsApp')).toBeDefined();
  });

  it('deve renderizar com texto customizado passado via children', () => {
    render(<WhatsAppButton>Falar com a Revendedora</WhatsAppButton>);
    expect(screen.getByText('Falar com a Revendedora')).toBeDefined();
  });

  it('deve disparar o evento onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<WhatsAppButton onClick={handleClick}>Pedir Agora</WhatsAppButton>);

    const button = screen.getByRole('button', { name: /Pedir Agora/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não deve disparar onClick quando desabilitado', () => {
    const handleClick = vi.fn();
    render(
      <WhatsAppButton onClick={handleClick} disabled>
        Indisponível
      </WhatsAppButton>
    );

    const button = screen.getByRole('button', { name: /Indisponível/i });
    expect(button).toHaveProperty('disabled', true);

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

