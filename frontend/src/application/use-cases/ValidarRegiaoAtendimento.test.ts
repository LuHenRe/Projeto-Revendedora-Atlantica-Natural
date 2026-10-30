import { describe, it, expect } from 'vitest';
import { ValidarRegiaoAtendimentoUseCase } from './ValidarRegiaoAtendimento';

describe('Caso de Uso: ValidarRegiaoAtendimento (Trava Geográfica)', () => {
  const regiaoConfigurada = 'Valparaíso de Goiás e DF/Entorno';
  const useCase = new ValidarRegiaoAtendimentoUseCase(regiaoConfigurada);

  it('deve aprovar e retornar status autorizado para cidades atendidas', () => {
    const resultado = useCase.execute('Valparaíso');
    expect(resultado.autorizado).toBe(true);
    expect(resultado.cidadeConfirmada).toBe('Valparaíso');
    expect(resultado.mensagemOrientacao).toBeUndefined();
  });

  it('deve aprovar cidades do Distrito Federal', () => {
    const resultado = useCase.execute('Brasília');
    expect(resultado.autorizado).toBe(true);
    expect(resultado.cidadeConfirmada).toBe('Brasília');
  });

  it('deve reprovar cidades fora do escopo e fornecer mensagem orientando compra online com afiliada', () => {
    const resultado = useCase.execute('Curitiba');
    expect(resultado.autorizado).toBe(false);
    expect(resultado.cidadeConfirmada).toBe('Curitiba');
    expect(resultado.mensagemOrientacao).toContain('atendimento pronta-entrega é exclusivo para Valparaíso de Goiás e DF/Entorno');
  });

  it('deve lançar erro se a cidade digitada for vazia', () => {
    expect(() => useCase.execute('')).toThrow('Informe uma cidade para validar a entrega');
    expect(() => useCase.execute('   ')).toThrow('Informe uma cidade para validar a entrega');
  });
});
