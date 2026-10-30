import { Preco } from '../value-objects/Preco';
import { UrlExterna } from '../value-objects/UrlExterna';

export interface ProdutoMatrizProps {
  id: string;
  nome: string;
  preco: Preco;
  urlOrigem: UrlExterna;
  urlAfiliada: UrlExterna;
  imagemUrl?: string | null;
  descricao?: string | null;
  ativo?: boolean;
}

export class ProdutoMatriz {
  readonly id: string;
  readonly nome: string;
  readonly preco: Preco;
  readonly urlOrigem: UrlExterna;
  readonly urlAfiliada: UrlExterna;
  readonly imagemUrl: string | null;
  readonly descricao: string | null;
  private _ativo: boolean;

  constructor(props: ProdutoMatrizProps) {
    if (!props.id || !props.id.trim()) {
      throw new Error('O ID do produto da matriz é obrigatório');
    }
    if (!props.nome || !props.nome.trim()) {
      throw new Error('O nome do produto da matriz é obrigatório');
    }

    this.id = props.id.trim();
    this.nome = props.nome.trim();
    this.preco = props.preco;
    this.urlOrigem = props.urlOrigem;
    this.urlAfiliada = props.urlAfiliada;
    this.imagemUrl = props.imagemUrl ?? null;
    this.descricao = props.descricao ?? null;
    this._ativo = props.ativo ?? true;
  }

  get ativo(): boolean {
    return this._ativo;
  }

  inativar(): void {
    this._ativo = false;
  }

  ativar(): void {
    this._ativo = true;
  }
}
