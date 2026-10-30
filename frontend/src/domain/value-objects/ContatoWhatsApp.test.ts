import { describe, it, expect } from 'vitest';
import { ContatoWhatsApp } from './ContatoWhatsApp';

describe('Value Object: ContatoWhatsApp', () => {
  it('deve sanitizar o número removendo espaços, parênteses e traços', () => {
    const contato = new ContatoWhatsApp('+55 (61) 99999-8888');
    expect(contato.numeroSanitizado).toBe('5561999998888');
  });

  it('deve gerar URL wa.me sem mensagem', () => {
    const contato = new ContatoWhatsApp('5561999998888');
    expect(contato.gerarLink()).toBe('https://wa.me/5561999998888');
  });

  it('deve gerar URL wa.me com mensagem devidamente codificada em URI', () => {
    const contato = new ContatoWhatsApp('5561999998888');
    const link = contato.gerarLink('Olá! Gostaria de comprar o Óleo de Lavanda.');
    expect(link).toBe(
      'https://wa.me/5561999998888?text=Ol%C3%A1!%20Gostaria%20de%20comprar%20o%20%C3%93leo%20de%20Lavanda.'
    );
  });

  it('deve lançar erro se o número de telefone for inválido ou muito curto', () => {
    expect(() => new ContatoWhatsApp('123')).toThrow('Número de WhatsApp inválido');
    expect(() => new ContatoWhatsApp('')).toThrow('Número de WhatsApp inválido');
  });
});
