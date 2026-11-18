import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GerenciadorProdutosMatriz } from './GerenciadorProdutosMatriz';

const adicionarMock = vi.fn();
const removerMock = vi.fn();
const listarCategoriasMock = vi.fn();
const sincronizarCategoriaMock = vi.fn();

vi.mock('@/infrastructure/actions/matrizActions', () => ({
  adicionarDestaqueMatrizAction: (...args: any[]) => adicionarMock(...args),
  removerDestaqueMatrizAction: (...args: any[]) => removerMock(...args),
  listarCategoriasMatrizAction: (...args: any[]) => listarCategoriasMock(...args),
  sincronizarCategoriaMatrizAction: (...args: any[]) => sincronizarCategoriaMock(...args),
}));

describe('GerenciadorProdutosMatriz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não duplica produto na lista ao enviar a mesma URL duas vezes', async () => {
    const initial = [
      {
        id: 'e2f0addf-8c9c-4efd-a859-3698af2bc7a7',
        nome: 'Fragrância Athenna 15ml',
        preco: { valor: 39.98, formatado: 'R$ 39,98' },
        imagemUrl: 'https://img.com/athenna.jpg',
        urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml',
        urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml?aff=padrao',
        categoriaOrigem: null,
      },
    ];

    adicionarMock.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'e2f0addf-8c9c-4efd-a859-3698af2bc7a7',
        nome: 'Fragrância Athenna 15ml',
        preco: { valor: 39.98, formatado: 'R$ 39,98' },
        imagemUrl: 'https://img.com/athenna.jpg',
        urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml',
        urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml?aff=padrao',
        categoriaOrigem: null,
      },
    });

    render(<GerenciadorProdutosMatriz initialProdutos={initial} initialCategorias={[]} />);

    const input = screen.getByLabelText(/URL do produto/i);
    fireEvent.change(input, {
      target: { value: 'https://loja.atlanticanatural.com.br/produtos/fragrancia-athenna-15ml' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Puxar Dados da Matriz/i }));

    await waitFor(() => {
      expect(screen.getByText(/mantido sem duplicação/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('Fragrância Athenna 15ml')).toHaveLength(1);
    expect(screen.getByText(/Destaques Ativos na Vitrine \(1\)/i)).toBeInTheDocument();
  });

  it('sincroniza categoria atualizando itens existentes e removendo os ausentes', async () => {
    const catUrl = 'https://loja.atlanticanatural.com.br/produtos/categoria/academia/4';
    const initial = [
      {
        id: 'prod-1',
        nome: 'Creatina Antiga',
        preco: { valor: 100, formatado: 'R$ 100,00' },
        imagemUrl: '',
        urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/creatina-1',
        urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/creatina-1?aff=padrao',
        categoriaOrigem: catUrl,
      },
      {
        id: 'prod-removido',
        nome: 'Item Removido',
        preco: { valor: 50, formatado: 'R$ 50,00' },
        imagemUrl: '',
        urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/removido',
        urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/removido?aff=padrao',
        categoriaOrigem: catUrl,
      },
      {
        id: 'prod-outra-cat',
        nome: 'Chá Verde',
        preco: { valor: 30, formatado: 'R$ 30,00' },
        imagemUrl: '',
        urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/cha-verde',
        urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/cha-verde?aff=padrao',
        categoriaOrigem: 'https://loja.atlanticanatural.com.br/produtos/categoria/chas/5',
      },
    ];

    sincronizarCategoriaMock.mockResolvedValueOnce({
      success: true,
      data: {
        categoriaUrl: catUrl,
        adicionados: 1,
        atualizados: 1,
        removidos: 1,
        produtos: [
          {
            id: 'prod-1',
            nome: 'Creatina Atualizada',
            preco: { valor: 153.78, formatado: 'R$ 153,78' },
            imagemUrl: 'https://img.com/c1.png',
            urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/creatina-1',
            urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/creatina-1?aff=padrao',
            categoriaOrigem: catUrl,
          },
          {
            id: 'prod-2',
            nome: 'Creatina Nova',
            preco: { valor: 160, formatado: 'R$ 160,00' },
            imagemUrl: 'https://img.com/c2.png',
            urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/creatina-2',
            urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/creatina-2?aff=padrao',
            categoriaOrigem: catUrl,
          },
        ],
      },
    });

    render(
      <GerenciadorProdutosMatriz
        initialProdutos={initial}
        initialCategorias={[{ nome: 'Academia', url: catUrl }]}
      />
    );

    const select = screen.getByLabelText(/Categoria oficial/i);
    fireEvent.change(select, { target: { value: catUrl } });
    fireEvent.click(screen.getByRole('button', { name: /Sincronizar Categoria/i }));

    await waitFor(() => {
      expect(screen.getByText(/1 adicionado\(s\), 1 atualizado\(s\) e 1 removido\(s\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Creatina Atualizada')).toBeInTheDocument();
    expect(screen.getByText('Creatina Nova')).toBeInTheDocument();
    expect(screen.getByText('Chá Verde')).toBeInTheDocument();
    expect(screen.queryByText('Item Removido')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sincronizar Categoria/i })).not.toBeDisabled();

    // Segunda sincronização seguida na mesma categoria não deve travar em "Sincronizando..."
    sincronizarCategoriaMock.mockResolvedValueOnce({
      success: true,
      data: {
        categoriaUrl: catUrl,
        adicionados: 0,
        atualizados: 2,
        removidos: 0,
        produtos: [
          {
            id: 'prod-1',
            nome: 'Creatina Atualizada',
            preco: { valor: 153.78, formatado: 'R$ 153,78' },
            imagemUrl: 'https://img.com/c1.png',
            urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/creatina-1',
            urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/creatina-1?aff=padrao',
            categoriaOrigem: catUrl,
          },
          {
            id: 'prod-2',
            nome: 'Creatina Nova',
            preco: { valor: 160, formatado: 'R$ 160,00' },
            imagemUrl: 'https://img.com/c2.png',
            urlOrigem: 'https://loja.atlanticanatural.com.br/produtos/creatina-2',
            urlAfiliada: 'https://loja.atlanticanatural.com.br/produtos/creatina-2?aff=padrao',
            categoriaOrigem: catUrl,
          },
        ],
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sincronizar Categoria/i }));

    await waitFor(() => {
      expect(screen.getByText(/0 adicionado\(s\), 2 atualizado\(s\) e 0 removido\(s\)/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Sincronizar Categoria/i })).not.toBeDisabled();
  });
});
