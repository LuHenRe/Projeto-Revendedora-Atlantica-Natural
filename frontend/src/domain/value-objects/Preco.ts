export class Preco {
  readonly valor: number;

  constructor(valor: number) {
    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      throw new Error('O preço deve ser um número válido');
    }

    if (valor < 0) {
      throw new Error('O preço não pode ser negativo');
    }

    // Arredonda para 2 casas decimais
    this.valor = Math.round(valor * 100) / 100;
  }

  get formatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valor);
  }

  equals(outro: Preco): boolean {
    return outro !== null && outro !== undefined && this.valor === outro.valor;
  }
}
