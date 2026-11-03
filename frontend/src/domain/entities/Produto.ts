import { Preco } from '../value-objects/Preco';
import { Categoria, CategoriaDTO } from './Categoria';

export interface ProdutoProps {
  id: string;
  nome: string;
  preco: Preco;
  quantidadeEstoque: number;
  categoriaId: string;
  imagemUrl?: string | null;
  ativo?: boolean;
  categoria?: Categoria | null;
}

export interface ProdutoDTO {
  id: string;
  nome: string;
  preco: {
    valor: number;
    formatado: string;
  };
  quantidadeEstoque: number;
  categoriaId: string;
  imagemUrl: string | null;
  ativo: boolean;
  categoria?: CategoriaDTO | null;
}

export class Produto {
  readonly id: string;
  private _nome: string;
  private _preco: Preco;
  private _quantidadeEstoque: number;
  readonly categoriaId: string;
  readonly imagemUrl: string | null;
  private _ativo: boolean;
  readonly categoria: Categoria | null;

  constructor(props: ProdutoProps) {
    if (!props.id || !props.id.trim()) {
      throw new Error('O ID do produto é obrigatório');
    }
    if (!props.nome || !props.nome.trim()) {
      throw new Error('O nome do produto não pode ser vazio');
    }
    if (props.quantidadeEstoque < 0) {
      throw new Error('A quantidade em estoque não pode ser negativa');
    }
    if (!props.categoriaId || !props.categoriaId.trim()) {
      throw new Error('A categoria do produto é obrigatória');
    }

    this.id = props.id.trim();
    this._nome = props.nome.trim();
    this._preco = props.preco;
    this._quantidadeEstoque = props.quantidadeEstoque;
    this.categoriaId = props.categoriaId.trim();
    this.imagemUrl = props.imagemUrl ?? null;
    this._ativo = props.ativo ?? true;
    this.categoria = props.categoria ?? null;
  }

  get nome(): string {
    return this._nome;
  }

  get preco(): Preco {
    return this._preco;
  }

  get quantidadeEstoque(): number {
    return this._quantidadeEstoque;
  }

  get ativo(): boolean {
    return this._ativo;
  }

  toDTO(): ProdutoDTO {
    return {
      id: this.id,
      nome: this._nome,
      preco: {
        valor: this._preco.valor,
        formatado: this._preco.formatado,
      },
      quantidadeEstoque: this._quantidadeEstoque,
      categoriaId: this.categoriaId,
      imagemUrl: this.imagemUrl,
      ativo: this._ativo,
      categoria: this.categoria ? this.categoria.toDTO() : null,
    };
  }

  static fromDTO(dto: ProdutoDTO | Produto): Produto {
    if (dto instanceof Produto) {
      return dto;
    }
    return new Produto({
      id: dto.id,
      nome: dto.nome,
      preco: dto.preco instanceof Preco ? dto.preco : new Preco(dto.preco.valor),
      quantidadeEstoque: dto.quantidadeEstoque,
      categoriaId: dto.categoriaId,
      imagemUrl: dto.imagemUrl,
      ativo: dto.ativo,
      categoria: dto.categoria ? Categoria.fromDTO(dto.categoria) : null,
    });
  }

  temEstoqueDisponivel(): boolean {
    return this._quantidadeEstoque > 0;
  }

  isDisponivelParaProntaEntrega(): boolean {
    return this._ativo && this.temEstoqueDisponivel();
  }

  inativar(): void {
    this._ativo = false;
  }

  ativar(): void {
    this._ativo = true;
  }

  atualizarEstoque(novoEstoque: number): void {
    if (novoEstoque < 0) {
      throw new Error('A quantidade em estoque não pode ser negativa');
    }
    this._quantidadeEstoque = novoEstoque;
  }

  atualizarDados(nome: string, preco: Preco): void {
    if (!nome || !nome.trim()) {
      throw new Error('O nome do produto não pode ser vazio');
    }
    this._nome = nome.trim();
    this._preco = preco;
  }
}
