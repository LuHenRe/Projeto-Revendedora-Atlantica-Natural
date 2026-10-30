import { ContatoWhatsApp } from '../../domain/value-objects/ContatoWhatsApp';
import { Produto } from '../../domain/entities/Produto';
import { ItemSacola } from '../../domain/entities/ItemSacola';
import { Preco } from '../../domain/value-objects/Preco';

export class GerarMensagemWhatsAppUseCase {
  private readonly contato: ContatoWhatsApp;

  constructor(numeroWhatsApp: string) {
    this.contato = new ContatoWhatsApp(numeroWhatsApp);
  }

  gerarParaItemUnico(produto: Produto, cidadeConfirmada?: string): string {
    let mensagem = `Olá! Vi o produto *${produto.nome}* (${produto.preco.formatado}) na sua Vitrine Virtual e gostaria de pedir para pronta-entrega.`;
    if (cidadeConfirmada) {
      mensagem += `\nLocal de entrega: ${cidadeConfirmada}.`;
    }
    return this.contato.gerarLink(mensagem);
  }

  gerarParaSacola(itens: ItemSacola[], cidadeConfirmada?: string): string {
    if (!itens || itens.length === 0) {
      throw new Error('A sacola de compras está vazia');
    }

    const totalCalculado = itens.reduce((acc, item) => acc + item.subtotal.valor, 0);
    const precoTotal = new Preco(totalCalculado);

    let mensagem = 'Olá! Gostaria de fazer o pedido dos seguintes produtos de pronta-entrega:\n\n';
    itens.forEach((item) => {
      mensagem += `• ${item.quantidade}x *${item.produto.nome}* (${item.subtotal.formatado})\n`;
    });

    mensagem += `\n*Total estimado: ${precoTotal.formatado}*`;
    if (cidadeConfirmada) {
      mensagem += `\nLocal de entrega: ${cidadeConfirmada}`;
    }

    return this.contato.gerarLink(mensagem);
  }
}
