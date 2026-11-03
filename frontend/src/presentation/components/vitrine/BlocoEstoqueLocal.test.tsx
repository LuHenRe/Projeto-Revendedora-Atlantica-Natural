import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlocoEstoqueLocal } from './BlocoEstoqueLocal';
import { ProdutoDTO } from '../../../domain/entities/Produto';
import { CategoriaDTO } from '../../../domain/entities/Categoria';
import { Preco } from '../../../domain/value-objects/Preco';
import * as VitrineContextModule from '../../context/VitrineContext';

vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

describe('Componente: BlocoEstoqueLocal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(VitrineContextModule, 'useVitrine').mockReturnValue({
      isRegiaoConfirmada: false,
      cidadeConfirmada: null,
      isModalAberta: false,
      regiaoPadrao: 'Valparaíso de Goiás',
      abrirModalTrava: vi.fn(),
      fecharModalTrava: vi.fn(),
      confirmarRegiao: vi.fn(),
      redefinirRegiao: vi.fn(),
      sacola: {
        itens: [],
        quantidadeTotal: 0,
        valorTotal: new Preco(0),
        temItens: false,
        adicionarProduto: vi.fn(),
        removerProduto: vi.fn(),
        atualizarQuantidade: vi.fn(),
        limparSacola: vi.fn(),
      },
      solicitarCompraProduto: vi.fn(),
      concluirPedidoSacola: vi.fn(),
      tirarDuvidaGeral: vi.fn(),
    });
  });

  const mockCategoriasDTO: CategoriaDTO[] = [
    { id: 'cat-1', nome: 'Aromaterapia' },
    { id: 'cat-2', nome: 'Cuidados Pessoais' },
  ];

  const mockProdutosDTO: ProdutoDTO[] = [
    {
      id: 'prod-1',
      nome: 'Óleo de Lavanda Francesa',
      preco: { valor: 55.0, formatado: 'R$ 55,00' },
      quantidadeEstoque: 10,
      categoriaId: 'cat-1',
      categoria: { id: 'cat-1', nome: 'Aromaterapia' },
      imagemUrl: null,
      ativo: true,
    },
    {
      id: 'prod-2',
      nome: 'Sabonete Argila Verde',
      preco: { valor: 22.0, formatado: 'R$ 22,00' },
      quantidadeEstoque: 5,
      categoriaId: 'cat-2',
      categoria: { id: 'cat-2', nome: 'Cuidados Pessoais' },
      imagemUrl: null,
      ativo: true,
    },
  ];

  it('deve renderizar produtos e categorias recebidos como DTOs serializáveis', () => {
    render(
      <BlocoEstoqueLocal
        produtosIniciais={mockProdutosDTO}
        categorias={mockCategoriasDTO}
      />
    );

    expect(screen.getByText('Disponíveis para Pronta-Entrega')).toBeDefined();
    expect(screen.getByText('Óleo de Lavanda Francesa')).toBeDefined();
    expect(screen.getByText('Sabonete Argila Verde')).toBeDefined();
    expect(screen.getByText('Aromaterapia (1)')).toBeDefined();
    expect(screen.getByText('Cuidados Pessoais (1)')).toBeDefined();
  });

  it('deve filtrar produtos ao selecionar uma categoria', () => {
    render(
      <BlocoEstoqueLocal
        produtosIniciais={mockProdutosDTO}
        categorias={mockCategoriasDTO}
      />
    );

    // Clica no filtro de Aromaterapia
    fireEvent.click(screen.getByText('Aromaterapia (1)'));

    expect(screen.getByText('Óleo de Lavanda Francesa')).toBeDefined();
    expect(screen.queryByText('Sabonete Argila Verde')).toBeNull();
  });
});

