export class UrlExterna {
  readonly valor: string;

  constructor(url: string) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL inválida');
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Apenas protocolos http ou https são permitidos');
      }
      this.valor = parsed.toString();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('protocolos')) {
        throw err;
      }
      throw new Error('URL inválida');
    }
  }

  comParametro(chave: string, valor: string): UrlExterna {
    const parsed = new URL(this.valor);
    parsed.searchParams.set(chave, valor);
    return new UrlExterna(parsed.toString());
  }
}
