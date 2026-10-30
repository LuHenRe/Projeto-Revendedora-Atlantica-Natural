import { RegiaoAtendimento } from '../../domain/value-objects/RegiaoAtendimento';

export interface ValidarRegiaoOutputDTO {
  autorizado: boolean;
  cidadeConfirmada: string;
  mensagemOrientacao?: string;
}

export class ValidarRegiaoAtendimentoUseCase {
  private readonly regiaoAtendimento: RegiaoAtendimento;

  constructor(regiaoPadrao: string) {
    this.regiaoAtendimento = new RegiaoAtendimento(regiaoPadrao);
  }

  execute(cidadeCliente: string): ValidarRegiaoOutputDTO {
    if (!cidadeCliente || !cidadeCliente.trim()) {
      throw new Error('Informe uma cidade para validar a entrega');
    }

    const cidadeLimpa = cidadeCliente.trim();
    const isAtendida = this.regiaoAtendimento.isAtendida(cidadeLimpa);

    if (isAtendida) {
      return {
        autorizado: true,
        cidadeConfirmada: cidadeLimpa,
      };
    }

    return {
      autorizado: false,
      cidadeConfirmada: cidadeLimpa,
      mensagemOrientacao: `Nosso atendimento pronta-entrega é exclusivo para ${this.regiaoAtendimento.descricao}. Para outras regiões, recomendamos a compra com envio direto pelo site oficial da marca.`,
    };
  }
}
