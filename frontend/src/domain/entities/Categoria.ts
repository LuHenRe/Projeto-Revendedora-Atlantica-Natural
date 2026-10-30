export class Categoria {
  readonly id: string;
  private _nome: string;

  constructor(id: string, nome: string) {
    if (!id || !id.trim()) {
      throw new Error('O ID da categoria é obrigatório');
    }
    if (!nome || !nome.trim()) {
      throw new Error('O nome da categoria não pode ser vazio');
    }

    this.id = id.trim();
    this._nome = nome.trim();
  }

  get nome(): string {
    return this._nome;
  }

  atualizarNome(novoNome: string): void {
    if (!novoNome || !novoNome.trim()) {
      throw new Error('O nome da categoria não pode ser vazio');
    }
    this._nome = novoNome.trim();
  }
}
