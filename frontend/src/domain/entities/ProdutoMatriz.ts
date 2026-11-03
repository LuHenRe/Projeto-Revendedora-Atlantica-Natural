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

export interface ProdutoMatrizDTO {
  id: string;
  nome: string;
  preco: {
    valor: number;
    formatado: string;
  };
  urlOrigem: { valor: string };
  urlAfiliada: { valor: string };
  imagemUrl: string | null;
  descricao: string | null;
  ativo: boolean;
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

  toDTO(): ProdutoMatrizDTO {
    return {
      id: this.id,
      nome: this.nome,
      preco: {
        valor: this.preco.valor,
        formatado: this.preco.formatado,
      },
      urlOrigem: { valor: this.urlOrigem.valor },
      urlAfiliada: { valor: this.urlAfiliada.valor },
      imagemUrl: this.imagemUrl,
      descricao: this.descricao,
      ativo: this._ativo,
    };
  }

  static fromDTO(dto: ProdutoMatrizDTO | ProdutoMatriz): ProdutoMatriz {
    if (dto instanceof ProdutoMatriz) {
      return dto;
    }
    return new ProdutoMatriz({
      id: dto.id,
      nome: dto.nome,
      preco: dto.preco instanceof Preco ? dto.preco : new Preco(dto.preco.valor),
      urlOrigem:
        dto.urlOrigem instanceof UrlExterna ? dto.urlOrigem : new UrlExterna(dto.urlOrigem.valor),
      urlAfiliada:
        dto.urlAfiliada instanceof UrlExterna ? dto.urlAfiliada : new UrlExterna(dto.urlAfiliada.valor),
      imagemUrl: dto.imagemUrl,
      descricao: dto.descricao,
      ativo: dto.ativo,
    });
  }

  inativar(): void {
    this._ativo = false;
  }

  ativar(): void {
    this._ativo = true;
  }
}
