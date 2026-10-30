import { describe, it, expect } from 'vitest';
import { UrlExterna } from './UrlExterna';

describe('Value Object: UrlExterna', () => {
  it('deve aceitar URLs HTTP e HTTPS válidas', () => {
    const url = new UrlExterna('https://atlanticanaturalbr.com.br/produto/oleo-lavanda');
    expect(url.valor).toBe('https://atlanticanaturalbr.com.br/produto/oleo-lavanda');
  });

  it('deve lançar erro se a URL for mal formatada', () => {
    expect(() => new UrlExterna('not-a-valid-url')).toThrow('URL inválida');
    expect(() => new UrlExterna('ftp://invalido')).toThrow('Apenas protocolos http ou https são permitidos');
  });

  it('deve permitir anexar parâmetros de rastreamento de afiliado', () => {
    const url = new UrlExterna('https://atlanticanaturalbr.com.br/produto');
    const comAfiliado = url.comParametro('ref', 'revendedora123');
    expect(comAfiliado.valor).toContain('ref=revendedora123');
  });
});
