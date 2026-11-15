# Diagrama de Atividades

## Caso de Uso Modelado: Comprar Produtos de Pronta-Entrega com Trava Geográfica e Sacola (`UC01`)

**Justificativa da escolha:** Trata-se do caso de uso não básico mais crítico do sistema. Ele concentra múltiplas ramificações de decisão (compra unitária vs. sacola de pedidos, verificação de cidade previamente salva no navegador, validação de campo vazio, verificação de área de atendimento e redirecionamento para canais distintos conforme a cobertura geográfica).

```mermaid
flowchart TD
    Start((Início)) --> A1[Cliente acessa a Vitrine Virtual]
    A1 --> D1{Compra direta ou Sacola?}

    D1 -- Produto único --> A2[Clica em Pedir no WhatsApp no card]
    D1 -- Múltiplos itens --> A3[Adiciona produtos na Sacola Flutuante]
    A3 --> A4[Ajusta quantidades e clica em Fechar Pedido]

    A2 --> D2{Cidade já confirmada no localStorage?}
    A4 --> D2

    D2 -- Sim --> A9[Gera mensagem pré-formatada via ContatoWhatsApp]
    D2 -- Não --> A5[Abre Modal de Trava Geográfica]

    A5 --> A6[Cliente digita a cidade e confirma]
    A6 --> D3{Campo preenchido?}
    D3 -- Não --> A7[Exibe alerta: Informe sua cidade]
    A7 --> A6

    D3 -- Sim --> D4{Cidade atendida por RegiaoAtendimento?}
    D4 -- Não --> A8[Bloqueia envio local e exibe link para Site da Matriz]
    A8 --> EndAlt((Fim - Canal Matriz))

    D4 -- Sim --> A8b[Salva cidade no localStorage e fecha modal]
    A8b --> A9
    A9 --> A10[Redireciona para WhatsApp wa.me com pedido]
    A10 --> EndOk((Fim - Pedido Iniciado))
```
