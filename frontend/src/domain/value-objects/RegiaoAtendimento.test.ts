import { describe, it, expect } from 'vitest';
import { RegiaoAtendimento } from './RegiaoAtendimento';

describe('Value Object: RegiaoAtendimento (Trava Geográfica)', () => {
  const regiaoConfigurada = 'Valparaíso de Goiás e DF/Entorno';

  it('deve criar uma instância com a região informada', () => {
    const regiao = new RegiaoAtendimento(regiaoConfigurada);
    expect(regiao.descricao).toBe(regiaoConfigurada);
  });

  it('deve validar positivamente se a cidade informada pelo cliente pertence à região atendida', () => {
    const regiao = new RegiaoAtendimento(regiaoConfigurada);

    expect(regiao.isAtendida('Valparaíso de Goiás')).toBe(true);
    expect(regiao.isAtendida('valparaiso')).toBe(true);
    expect(regiao.isAtendida('Brasília')).toBe(true);
    expect(regiao.isAtendida('DF')).toBe(true);
    expect(regiao.isAtendida('Gama')).toBe(true);
    expect(regiao.isAtendida('Luziânia')).toBe(true);
  });

  it('deve retornar falso para cidades fora da região de atendimento', () => {
    const regiao = new RegiaoAtendimento(regiaoConfigurada);

    expect(regiao.isAtendida('São Paulo')).toBe(false);
    expect(regiao.isAtendida('Rio de Janeiro')).toBe(false);
    expect(regiao.isAtendida('Salvador')).toBe(false);
  });

  it('deve lançar erro se a descrição da região for vazia', () => {
    expect(() => new RegiaoAtendimento('')).toThrow('A descrição da região não pode ser vazia');
    expect(() => new RegiaoAtendimento('   ')).toThrow('A descrição da região não pode ser vazia');
  });
});
