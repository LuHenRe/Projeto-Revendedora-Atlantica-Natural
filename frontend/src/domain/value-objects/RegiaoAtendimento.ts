export class RegiaoAtendimento {
  readonly descricao: string;

  constructor(descricao: string) {
    if (!descricao || !descricao.trim()) {
      throw new Error('A descrição da região não pode ser vazia');
    }
    this.descricao = descricao.trim();
  }

  /**
   * Verifica se a cidade/local informada pelo cliente é atendida pela revendedora.
   * Suporta validação flexível (case-insensitive e cidades do DF/Entorno).
   */
  isAtendida(cidadeCliente: string): boolean {
    if (!cidadeCliente || !cidadeCliente.trim()) return false;

    const normalizar = (texto: string) =>
      texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const cidadeNorm = normalizar(cidadeCliente);
    const regiaoNorm = normalizar(this.descricao);

    // Lista de palavras-chave e cidades padrão do DF e Entorno atendidas
    const palavrasChave = [
      'valparaiso',
      'brasilia',
      'df',
      'distrito federal',
      'gama',
      'santa maria',
      'luziania',
      'novo gama',
      'ocidental',
      'cidade ocidental',
      'aguas lindas',
      'taguatinga',
      'ceilandia',
      'guara',
      'samambaia',
    ];

    if (regiaoNorm.includes(cidadeNorm) || cidadeNorm.includes('valparaiso')) {
      return true;
    }

    return palavrasChave.some((chave) => cidadeNorm.includes(chave));
  }
}
