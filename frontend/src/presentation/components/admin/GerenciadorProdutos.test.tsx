import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GerenciadorProdutos } from './GerenciadorProdutos';
import * as produtoActions from '@/infrastructure/actions/produtoActions';

vi.mock('@/infrastructure/actions/produtoActions', () => ({
  salvarProdutoAction: vi.fn(),
  inativarProdutoAction: vi.fn(),
  uploadImagemProdutoAction: vi.fn(),
}));

describe('Componente: GerenciadorProdutos', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock URL.createObjectURL para testes no jsdom
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/fake-blob');
    }
  });

  const mockCategorias = [
    { id: 'cat-1', nome: 'Chás e Infusões' },
    { id: 'cat-2', nome: 'Óleos Essenciais' },
  ];

  const mockProdutos = [
    {
      id: 'prod-1',
      nome: 'Óleo de Melaleuca Puro 10ml',
      descricao: 'Antisséptico e cicatrizante natural',
      preco: { valor: 45.0, formatado: 'R$ 45,00' },
      estoque: 12,
      categoria: { id: 'cat-2', nome: 'Óleos Essenciais' },
      imagemUrl: '/uploads/produtos/melaleuca.jpg',
      ativo: true,
    },
  ];

  it('deve renderizar a tabela com os produtos iniciais e botão Novo Produto', () => {
    render(<GerenciadorProdutos initialProdutos={mockProdutos} categorias={mockCategorias} />);

    expect(screen.getByText('Estoque Local')).toBeInTheDocument();
    expect(screen.getByText('Óleo de Melaleuca Puro 10ml')).toBeInTheDocument();
    expect(screen.getByText('R$ 45,00')).toBeInTheDocument();
    expect(screen.getByText('12 un.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Novo Produto/i })).toBeInTheDocument();
  });

  it('deve abrir a modal com campo de upload de fotos do celular/PC', () => {
    render(<GerenciadorProdutos initialProdutos={mockProdutos} categorias={mockCategorias} />);

    fireEvent.click(screen.getByRole('button', { name: /Novo Produto/i }));

    expect(screen.getByText('Novo Produto para Pronta-Entrega')).toBeInTheDocument();
    expect(
      screen.getByText(/Tirar foto ou escolher do celular \/ computador/i)
    ).toBeInTheDocument();
  });

  it('deve permitir alternar para inserção por link (URL) e voltar para arquivo', () => {
    render(<GerenciadorProdutos initialProdutos={mockProdutos} categorias={mockCategorias} />);

    fireEvent.click(screen.getByRole('button', { name: /Novo Produto/i }));

    // Clica para alternar para URL
    const btnAlternar = screen.getByRole('button', { name: /Inserir por link \(URL\)/i });
    fireEvent.click(btnAlternar);

    expect(screen.getByPlaceholderText('https://exemplo.com/imagem.jpg')).toBeInTheDocument();

    // Volta para arquivo
    const btnVoltarArquivo = screen.getByRole('button', { name: /Carregar do celular\/PC/i });
    fireEvent.click(btnVoltarArquivo);

    expect(
      screen.getByText(/Tirar foto ou escolher do celular \/ computador/i)
    ).toBeInTheDocument();
  });

  it('deve realizar upload e exibir preview ao selecionar um arquivo de imagem', async () => {
    (produtoActions.uploadImagemProdutoAction as any).mockResolvedValue({
      success: true,
      data: { url: '/uploads/produtos/nova-foto.jpg' },
    });

    render(<GerenciadorProdutos initialProdutos={mockProdutos} categorias={mockCategorias} />);

    fireEvent.click(screen.getByRole('button', { name: /Novo Produto/i }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const fakeFile = new File(['conteudo-imagem'], 'foto-produto.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(produtoActions.uploadImagemProdutoAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText(/Foto Selecionada/i)).toBeInTheDocument();
      expect(screen.getByText(/Trocar Foto/i)).toBeInTheDocument();
      expect(screen.getByText(/Remover/i)).toBeInTheDocument();
    });
  });

  it('deve carregar foto existente ao abrir para edição e permitir remoção', async () => {
    render(<GerenciadorProdutos initialProdutos={mockProdutos} categorias={mockCategorias} />);

    // Clica no botão de editar do primeiro produto
    const btnEditar = screen.getByTitle('Editar');
    fireEvent.click(btnEditar);

    expect(screen.getByText('Editar Produto Local')).toBeInTheDocument();
    expect(screen.getByText(/Foto Selecionada/i)).toBeInTheDocument();

    // Remove a foto
    const btnRemover = screen.getByRole('button', { name: /Remover/i });
    fireEvent.click(btnRemover);

    expect(
      screen.getByText(/Tirar foto ou escolher do celular \/ computador/i)
    ).toBeInTheDocument();
  });
});
