# Requisitos da Vitrine

## Requisitos Funcionais (RF)

| ID | Descrição | Prioridade | Ator/Origem |
|---|---|---|---|
| RF01 | Exibir catálogo de produtos físicos ativos com estoque local na vitrine principal | Alta | Cliente final |
| RF02 | Validar região de atendimento sob demanda via modal de trava geográfica com persistência local | Alta | Cliente final |
| RF03 | Gerar link do WhatsApp com mensagem pré-formatada (item único ou sacola) após confirmação da região | Alta | Cliente final |
| RF04 | Bloquear redirecionamento de WhatsApp fora da área de cobertura e orientar compra com frete no site oficial da matriz | Alta | Cliente final |
| RF05 | Curar produtos da loja matriz via extração por URL (*Web Scraping*) e exibi-los com link de afiliada | Média | Administradora / Cliente final |
| RF06 | Disponibilizar bloco exclusivo de captação B2B com redirecionamento direto para o WhatsApp da liderança | Média | Potencial parceira |
| RF07 | Restringir o acesso ao Backoffice administrativo por autenticação JWT | Alta | Administradora |
| RF08 | Gerenciar produtos do estoque local (criar, editar, inativar logicamente e enviar imagem) | Alta | Administradora |
| RF09 | Controlar publicação automática de pronta-entrega com base em `ativo` e `quantidade_estoque > 0` | Alta | Sistema / Administradora |
| RF10 | Gerenciar categorias de produtos no Backoffice (criar, editar, excluir) | Média | Administradora |
| RF11 | Disponibilizar visualização em tela (`/catalogo`) e download do catálogo oficial em PDF | Média | Cliente final |
| RF12 | Permitir sacola flutuante multi-item para pronta-entrega e busca/filtro/ordenação no catálogo (`/produtos`) | Média | Cliente final |

## Requisitos Não Funcionais (RNF)

| ID | Descrição | Prioridade | Ator/Origem |
|---|---|---|---|
| RNF01 | **Usabilidade (Mobile-First)**: interface otimizada para celular, CTAs claros, baixa fricção na modal geográfica e suporte a tema claro/escuro | Alta | Equipe |
| RNF02 | **Segurança**: rotas administrativas protegidas por autenticação JWT na API e middleware no frontend | Alta | Equipe |
| RNF03 | **Desempenho**: página principal com renderização SSR/ISR (60s) e carregamento ágil (< 3s em 4G) | Alta | Equipe |
| RNF04 | **Integridade de dados**: validação de invariantes no domínio (preço/estoque não negativos, URLs válidas) | Alta | Equipe |
| RNF05 | **Manutenibilidade**: arquitetura limpa em camadas no backend e frontend com testes unitários | Média | Equipe |
| RNF06 | **Confiabilidade e desacoplamento**: integrações externas (WhatsApp e *scraping* da matriz) isoladas da lógica central | Média | Equipe |
| RNF07 | **Portabilidade**: funcionamento consistente em navegadores modernos desktop e mobile | Média | Equipe |

## Critérios de Aceitação
- A página principal exibe vitrine de pronta-entrega, destaques da matriz, acesso ao catálogo PDF e bloco B2B em layout mobile-first.
- O fechamento de compra local (direto ou via sacola) exige região válida confirmada na `ModalTravaGeografica` ou em `localStorage`.
- Clientes fora da região recebem orientação clara com link para a loja oficial da matriz.
- O Backoffice permite gestão completa de estoque local, categorias e curadoria de produtos da matriz sem alteração de código.
- A captação B2B permanece visualmente segregada da jornada de compra B2C.
