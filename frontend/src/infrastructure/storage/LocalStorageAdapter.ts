export interface SacolaItemArmazenado {
  produtoId: string;
  quantidade: number;
}

export class LocalStorageAdapter {
  private static readonly CHAVE_REGIAO = 'atlantica_regiao_confirmada';
  private static readonly CHAVE_SACOLA = 'atlantica_sacola_itens';

  private static isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  static getRegiaoConfirmada(): string | null {
    if (!this.isClient()) return null;
    try {
      return localStorage.getItem(this.CHAVE_REGIAO);
    } catch {
      return null;
    }
  }

  static setRegiaoConfirmada(cidade: string): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(this.CHAVE_REGIAO, cidade.trim());
    } catch {
      // storage quota or disabled
    }
  }

  static clearRegiaoConfirmada(): void {
    if (!this.isClient()) return;
    try {
      localStorage.removeItem(this.CHAVE_REGIAO);
    } catch {}
  }

  static getSacola(): SacolaItemArmazenado[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem(this.CHAVE_SACOLA);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setSacola(itens: SacolaItemArmazenado[]): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(this.CHAVE_SACOLA, JSON.stringify(itens));
    } catch {}
  }

  static clearSacola(): void {
    if (!this.isClient()) return;
    try {
      localStorage.removeItem(this.CHAVE_SACOLA);
    } catch {}
  }
}
