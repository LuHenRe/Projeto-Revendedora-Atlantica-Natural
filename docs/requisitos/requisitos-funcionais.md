# Requisitos Funcionais

> Requisitos alinhados ao estado atual do sistema (**Vitrine Virtual — Hub Híbrido Atlântica Natural**), contemplando vitrine pública, trava geográfica, sacola local, curadoria da matriz e backoffice administrativo.

## RF01 - Exibir produtos físicos em estoque local na vitrine
O sistema deve exibir na vitrine pública os produtos físicos ativos com estoque disponível para pronta-entrega local (`GET /produtos/ofertas-locais` na página inicial e `GET /produtos/` no catálogo completo).

## RF02 - Validar região de atendimento sob demanda (Trava Geográfica)
Ao acionar a compra de um produto de pronta-entrega ou o fechamento da sacola, o sistema deve verificar se o cliente já confirmou sua cidade; caso contrário, deve abrir a modal de validação geográfica (com campo para informar a cidade), validar a cobertura e persistir a confirmação no navegador (`localStorage`).

## RF03 - Gerar mensagem de WhatsApp pré-formatada
Após a validação da região de cobertura, o sistema deve gerar automaticamente o link `wa.me` com mensagem pré-formatada contendo o produto (ou os itens e total estimado da sacola) e a cidade informada pelo cliente.

## RF04 - Bloquear compra local fora da área de cobertura e orientar alternativa
Caso o cliente informe uma cidade fora da área de atendimento configurada (ou deixe o campo vazio), o sistema deve impedir o redirecionamento ao WhatsApp de pronta-entrega, exibir aviso explicativo e oferecer link direto para compra com frete nacional no site oficial da matriz.

## RF05 - Curar e exibir destaques da loja matriz com link de afiliada
O sistema deve permitir que a administradora importe produtos da loja oficial da matriz a partir da URL de origem (via *Web Scraping*), gere o link com parâmetro de afiliada e exiba esses destaques na vitrine pública (`GET /produtos-matriz/`). *(Evolução da concepção inicial de links estáticos para persistência em cache curado no banco `produtos_matriz`.)*

## RF06 - Disponibilizar bloco exclusivo de captação B2B
A vitrine deve apresentar uma seção segregada para interessadas em revenda (B2B), com benefícios da parceria e botão de redirecionamento direto para atendimento no WhatsApp da liderança, sem misturar o fluxo com a compra B2C e sem exigir formulário próprio no sistema.

## RF07 - Autenticar acesso ao painel administrativo (Backoffice)
O acesso às rotas e páginas administrativas (`/admin/*`) deve ser restrito a usuário autenticado por meio de login e token JWT (`POST /admin/login`).

## RF08 - Gerenciar produtos do estoque local e upload de imagens
O administrador autenticado deve poder cadastrar, editar e inativar (exclusão lógica) produtos físicos locais, definindo nome, descrição, preço, categoria, quantidade em estoque e enviando imagem (`POST /admin/produtos/upload-imagem`).

## RF09 - Controlar disponibilidade automática na pronta-entrega
O sistema deve publicar na vitrine de pronta-entrega apenas produtos com status ativo (`ativo = true`) e estoque maior que zero (`quantidade_estoque > 0`), ocultando itens inativos ou esgotados.

## RF10 - Gerenciar categorias de produtos
O administrador autenticado deve poder criar, listar, editar e excluir categorias para organizar os produtos do catálogo local.

## RF11 - Disponibilizar visualização e download do catálogo oficial em PDF
A vitrine deve oferecer acesso dedicado para visualização em tela (`/catalogo`) e download direto do catálogo digital oficial da Atlântica Natural em formato PDF.

## RF12 - Permitir sacola de pedidos local e busca/ordenação no catálogo
O sistema deve permitir ao cliente adicionar múltiplos produtos de pronta-entrega à sacola flutuante (ajustando quantidades e visualizando subtotal/total antes de enviar o pedido único ao WhatsApp), além de buscar por nome/categoria, filtrar por categoria e ordenar por preço no catálogo (`/produtos`).
