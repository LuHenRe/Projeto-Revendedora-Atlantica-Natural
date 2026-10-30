export class ContatoWhatsApp {
  readonly numeroSanitizado: string;

  constructor(numero: string) {
    if (!numero) {
      throw new Error('Número de WhatsApp inválido');
    }

    const limpo = numero.replace(/\D/g, '');

    // Um número brasileiro completo com DDI tem no mínimo 12 a 13 dígitos (ex: 5561999998888)
    if (limpo.length < 10) {
      throw new Error('Número de WhatsApp inválido');
    }

    this.numeroSanitizado = limpo;
  }

  gerarLink(mensagem?: string): string {
    const base = `https://wa.me/${this.numeroSanitizado}`;
    if (!mensagem || !mensagem.trim()) {
      return base;
    }
    return `${base}?text=${encodeURIComponent(mensagem.trim())}`;
  }
}
