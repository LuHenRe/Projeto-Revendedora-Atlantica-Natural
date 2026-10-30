'use client';

import { useState, useCallback, useMemo } from 'react';
import { Produto } from '../../domain/entities/Produto';
import { ItemSacola } from '../../domain/entities/ItemSacola';
import { Preco } from '../../domain/value-objects/Preco';

export function useSacola() {
  const [itens, setItens] = useState<ItemSacola[]>([]);

  const adicionarProduto = useCallback((produto: Produto, quantidade: number = 1) => {
    setItens((atuais) => {
      const index = atuais.findIndex((i) => i.produto.id === produto.id);
      if (index >= 0) {
        const itemExistente = atuais[index];
        const novoItem = new ItemSacola(itemExistente.produto, itemExistente.quantidade + quantidade);
        const copia = [...atuais];
        copia[index] = novoItem;
        return copia;
      } else {
        return [...atuais, new ItemSacola(produto, quantidade)];
      }
    });
  }, []);

  const removerProduto = useCallback((produtoId: string) => {
    setItens((atuais) => atuais.filter((i) => i.produto.id !== produtoId));
  }, []);

  const atualizarQuantidade = useCallback((produtoId: string, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    setItens((atuais) =>
      atuais.map((i) => (i.produto.id === produtoId ? new ItemSacola(i.produto, novaQuantidade) : i))
    );
  }, []);

  const limparSacola = useCallback(() => {
    setItens([]);
  }, []);

  const quantidadeTotal = useMemo(() => {
    return itens.reduce((acc, item) => acc + item.quantidade, 0);
  }, [itens]);

  const valorTotal = useMemo(() => {
    const soma = itens.reduce((acc, item) => acc + item.subtotal.valor, 0);
    return new Preco(soma);
  }, [itens]);

  return {
    itens,
    quantidadeTotal,
    valorTotal,
    temItens: itens.length > 0,
    adicionarProduto,
    removerProduto,
    atualizarQuantidade,
    limparSacola,
  };
}

