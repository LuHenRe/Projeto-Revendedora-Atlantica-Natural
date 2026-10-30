import { Produto } from './Produto';
import { Preco } from '../value-objects/Preco';

export class ItemSacola {
  readonly produto: Produto;
  private _quantidade: number;

  constructor(produto: Produto, quantidade: number = 1) {
    if (!produto) {
      throw new Error('O produto do item da sacola é obrigatório');
    }
    if (quantidade < 1) {
      throw new Error('A quantidade deve ser no mínimo 1');
    }

    this.produto = produto;
    this._quantidade = quantidade;
  }

  get quantidade(): number {
    return this._quantidade;
  }

  get subtotal(): Preco {
    return new Preco(this.produto.preco.valor * this._quantidade);
  }

  incrementar(qtd: number = 1): void {
    if (qtd < 1) throw new Error('Valor de incremento inválido');
    this._quantidade += qtd;
  }

  decrementar(qtd: number = 1): void {
    if (this._quantidade - qtd < 1) {
      throw new Error('A quantidade mínima é 1');
    }
    this._quantidade -= qtd;
  }
}
