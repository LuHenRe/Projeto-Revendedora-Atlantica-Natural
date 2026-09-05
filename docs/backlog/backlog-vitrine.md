# Backlog da Vitrine

## Backlog produtivo

### MVP - Primeira entrega

#### BP-01 - Exibir vitrine pública com catálogo local
- Prioridade: Alta
- Tipo: Produto
- Descrição: A vitrine pública deve apresentar os produtos físicos disponíveis no estoque local, organizados por categoria e com informações essenciais de compra.
- Critério de aceitação:
  - a página pública carrega a listagem de produtos ativos;
  - produtos indisponíveis ou inativos não são exibidos;
  - o usuário consegue navegar por categorias;
  - a interface é funcional em mobile.

#### BP-02 - Validar região e bloquear contato fora do escopo
- Prioridade: Alta
- Tipo: Produto
- Descrição: O sistema deve exigir a confirmação da região permitida antes de liberar o contato via WhatsApp.
- Critério de aceitação:
  - o usuário identifica a região de atendimento;
  - o botão de WhatsApp fica indisponível até a validação;
  - a lógica impede indicação de contato em regiões fora do escopo.

#### BP-03 - Gerar mensagem de WhatsApp por produto
- Prioridade: Alta
- Tipo: Produto
- Descrição: Ao selecionar um produto, o usuário deve conseguir abrir o WhatsApp com mensagem pré-formatada e contextualizada ao item escolhido.
- Critério de aceitação:
  - a mensagem inclui nome do produto ou categoria;
  - o fluxo funciona no celular;
  - o usuário inicia a conversa com contexto completo.

#### BP-04 - Exibir links externos para matriz/afiliados
- Prioridade: Média
- Tipo: Produto
- Descrição: A vitrine deve mostrar blocos de links externos para produtos, categorias ou campanhas da matriz, sem armazenar esses itens no banco local.
- Critério de aceitação:
  - os links são exibidos em blocos visuais;
  - o conteúdo não depende do cadastro local de produtos afiliados;
  - cada link encaminha corretamente para a rota externa.

#### BP-05 - Disponibilizar catálogo em PDF
- Prioridade: Média
- Tipo: Produto
- Descrição: A vitrine deve oferecer acesso ao catálogo em PDF para navegação em formato compacto e compartilhamento.
- Critério de aceitação:
  - o catálogo está acessível na área pública;
  - o arquivo abre corretamente em mobile e desktop;
  - a disponibilização não depende de fluxo de checkout interno.

#### BP-06 - CTA de captação de revendedoras e parceiros
- Prioridade: Média
- Tipo: Produto
- Descrição: A vitrine deve conter uma área específica para captar novas revendedoras e parceiros comerciais.
- Critério de aceitação:
  - há seção diferenciada da jornada B2C;
  - a ação de conversão direciona para o processo de captação;
  - o conteúdo pode ser editado pela administração.

#### BP-07 - Painel administrativo básico
- Prioridade: Alta
- Tipo: Produto
- Descrição: O administrador deve conseguir autenticar-se e gerenciar os dados essenciais da vitrine.
- Critério de aceitação:
  - login seguro com autenticação;
  - acesso restrito a usuários autorizados;
  - painel funcional para editar vitrine e dados operacionais.

#### BP-08 - Gestão de produtos e categorias
- Prioridade: Alta
- Tipo: Produto
- Descrição: O admin deve poder cadastrar, editar e desativar produtos e categorias da vitrine.
- Critério de aceitação:
  - é possível criar categoria;
  - é possível criar e editar produtos;
  - produtos fora de estoque ou inativos não aparecem na vitrine;
  - a categoria pode ser removida ou inativada sem quebrar a integridade do cadastro.

#### BP-09 - Gestão de conteúdo editável da página
- Prioridade: Média
- Tipo: Produto
- Descrição: O administrador deve alterar textos, imagens e blocos visuais da página principal sem necessidade de código.
- Critério de aceitação:
  - blocos e textos são editáveis no painel;
  - alterações refletem diretamente na vitrine;
  - o conteúdo tem validação básica de preenchimento.

#### BP-10 - Registro e consulta de leads B2B
- Prioridade: Média
- Tipo: Produto
- Descrição: O sistema deve registrar as interações de captação para revendedoras e parceiros e permitir consulta posterior.
- Critério de aceitação:
  - os leads são armazenados com dados mínimos obrigatórios;
  - o administrador consegue listar e filtrar os registros;
  - a jornada de captura permanece separada da compra local.

### Melhorias e expansão

#### BP-11 - Filtros por categoria e busca
- Prioridade: Média
- Tipo: Produto
- Descrição: Disponibilizar filtros e busca reduz a fricção da navegação e melhora a conversão.

#### BP-12 - Destaques promocionais e campanhas sazonais
- Prioridade: Baixa
- Tipo: Produto
- Descrição: Permitir destaque de produtos ou campanhas especiais na vitrine pública.

#### BP-13 - Observabilidade e métricas de conversão
- Prioridade: Baixa
- Tipo: Produto
- Descrição: Coletar dados de cliques, conversões e atuação em campanhas para otimizar resultados.

## Backlog técnico

#### BT-01 - Estruturar API para catálogo local
- Prioridade: Alta
- Tipo: Técnico
- Descrição: Criar endpoints para listar produtos ativos, categorias e regras de disponibilidade.
- Entregáveis:
  - CRUD de produtos;
  - CRUD de categorias;
  - filtro por status e visibilidade.

#### BT-02 - Implementar autenticação JWT para administração
- Prioridade: Alta
- Tipo: Técnico
- Descrição: Proteger rotas administrativas com autenticação segura e sessão curta e revogável.
- Entregáveis:
  - login do admin;
  - middleware de autorização;
  - controle de token e refresh.

#### BT-03 - Definir camada de regras de região/geofencing
- Prioridade: Alta
- Tipo: Técnico
- Descrição: Implementar a lógica de validação de região para liberar ou bloquear fluxo de contato.
- Entregáveis:
  - regra de geolocalização ou confirmação manual;
  - estado de atendimento por região;
  - fallback para casos sem validação.

#### BT-04 - Estruturar integrador de WhatsApp
- Prioridade: Alta
- Tipo: Técnico
- Descrição: Criar serviço para montar a mensagem pré-formatada e redirecionar para o contato do WhatsApp correto.
- Entregáveis:
  - construção de texto contextualizado;
  - integração com URL de WhatsApp;
  - suporte para produto e categoria.

#### BT-05 - Montar camada de conteúdo dinâmico da vitrine
- Prioridade: Média
- Tipo: Técnico
- Descrição: Expor templates e blocos editáveis para textos, CTA e imagens em painel admin.
- Entregáveis:
  - modelagem de conteúdo configurável;
  - API para leitura do conteúdo público;
  - renderização no frontend.

#### BT-06 - Planejar armazenamento de links externos e campanhas
- Prioridade: Média
- Tipo: Técnico
- Descrição: Definir como os dados externos e campanhas serão armazenados e consultados sem misturar com o estoque local.
- Entregáveis:
  - domínio separado para links externos;
  - regras de rastreio;
  - validação de URLs.

#### BT-07 - Implementar PDF do catálogo
- Prioridade: Média
- Tipo: Técnico
- Descrição: Disponibilizar o arquivo do catálogo com geração ou upload em ambiente público.
- Entregáveis:
  - versão estável do PDF;
  - link público;
  - gestão de atualização por administração.

#### BT-08 - Modelar banco de dados para vitrine e B2B
- Prioridade: Média
- Tipo: Técnico
- Descrição: Estruturar tabelas para produtos, categorias, conteúdo público e leads de parceiros.
- Entregáveis:
  - schema inicial e relações;
  - integridade de dados;
  - suporte a consultas e relatórios.

#### BT-09 - Definir testes de regressão para principais fluxos
- Prioridade: Média
- Tipo: Técnico
- Descrição: Garantir qualidade e estabilidade dos fluxos de vitrine, contato e administração.
- Entregáveis:
  - testes para produto e categoria;
  - testes para autenticação;
  - testes para CTA de WhatsApp e região.

#### BT-10 - Implementar observabilidade básica
- Prioridade: Baixa
- Tipo: Técnico
- Descrição: Instrumentar a aplicação para capturar erros de produção e monitorar principais ações de conversão.
- Entregáveis:
  - logs estruturados;
  - métrica de cliques e conversões;
  - alertas básicos para falhas críticas.

## Priorização

### P0 - MVP obrigatório
- BP-01
- BP-02
- BP-03
- BP-07
- BP-08
- BT-01
- BT-02
- BT-03
- BT-04

### P1 - Entrega funcional importante
- BP-04
- BP-05
- BP-06
- BP-09
- BP-10
- BT-05
- BT-06
- BT-07
- BT-08
- BT-09

### P2 - Expansão e melhorias
- BP-11
- BP-12
- BP-13
- BT-10

## Resumo executivo
O backlog foi organizado para priorizar a vitrine pública, a conversão por WhatsApp e a gestão administrativa mínima do catálogo local. A partir do MVP, o projeto evolui para conteúdo editável, captação B2B e integrações externas sem perder o foco de manter o estoque local e as ações de conversão separadas dos dados da matriz.
