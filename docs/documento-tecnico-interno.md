# Documento Técnico Interno

## 1. Contexto do projeto
O projeto consiste em uma vitrine virtual para uma revendedora parceira de uma marca de cosméticos e bem-estar. A solução foi concebida como um Hub Híbrido de Curadoria, em que o cliente final tem acesso a uma experiência simples, orientada à conversão, e a equipe administrativa possui controle do catálogo local, blocos de conteúdo e fluxo de captação.

O sistema é composto por:
- área pública com vitrine e catálogo;
- área administrativa protegida por autenticação;
- backend para gestão do estoque local e conteúdo;
- frontend mobile-first para UX e conversão;
- integrações externas para links de afiliados e WhatsApp.

## 2. Objetivos e escopo
### Objetivo principal
Empoderar a revendedora a vender produtos físicos locais, direcionar compras externas e captar parceiros sem depender de uma loja digital completa.

### Escopo funcional principal
- exibição de produtos físicos ativos;
- controle de disponibilidade e status de produtos;
- bloqueio de CTA por região de atendimento;
- geração de mensagens do WhatsApp com contexto do produto;
- visualização de links externos e deep links;
- catálogo em PDF;
- CTA de captação B2B;
- gestão administrativa de produtos, categorias e conteúdo

### Escopo fora do escopo
- checkout nativo;
- processamento de pagamentos;
- gestão de logística;
- emissão fiscal;
- ERP ou WMS;
- CRM completo para clientes finais;
- aplicativo nativo.

## 3. Regras de negócio
### 3.1. Fluxo de conversão local
A vitrine exibe somente itens físicos e ativos no estoque local. O cliente pode consultar os produtos e, ao clicar em contato, deve passar por validação da região de atendimento antes de continuar.

### 3.2. Trava geográfica
A regra de geofencing deve permanecer no frontend. Isso evita requisições desnecessárias ao backend e melhora a experiência do usuário.

### 3.3. Links externos
Produtos e categorias da matriz não são armazenados como entidades do banco local do sistema. A URL externa deve ser tratada como configuração de conteúdo, frontend ou CMS, e não como item de banco relacional do estoque local.

### 3.4. Catálogo digital
O catálogo deve estar acessível em PDF ou em visualizador web, servindo como suporte e material complementar à conversão.

### 3.5. Captação B2B
O fluxo de parceiros é separado da jornada B2C e deve ser acessado por CTA específico, mantendo clareza e evitando conflito na experiência do cliente final.

## 4. Arquitetura do sistema
### 4.1. Frontend
Tecnologias previstas:
- Next.js
- React
- TypeScript
- Tailwind CSS
- UI components modulares

Responsabilidades:
- renderização da vitrine pública;
- controle de estado da regra geográfica;
- montagem de links do WhatsApp;
- exibição de links externos;
- painel administrativo.

### 4.2. Backend
Tecnologias previstas:
- FastAPI
- Python
- PostgreSQL

Responsabilidades:
- autenticação de usuários do painel administrativo;
- gerenciamento de produtos e categorias;
- consulta de catálogo local;
- gerenciamento de conteúdo e leads B2B;
- APIs para frontend.

### 4.3. Modelo de integração
A arquitetura favorece desacoplamento entre:
- dados locais do estoque físico;
- URLs e campanhas externas;
- conteúdo editável da vitrine;
- processo administrativo.

## 5. Estrutura de domínio
### Contextos delimitados
- Catálogo: gerenciamento de produtos e categorias locais
- Vitrine: composição visual e conteúdo público
- Conversão: WhatsApp, deep links e CTA
- Backoffice: autenticação, autorização e gestão interna
- B2B: leads e parceiros

### Entidades principais
- Produto
- Categoria
- OfertaLocal
- LinkExterno
- CatalogoDigital
- Lead
- ParceiraB2B
- Administrador

### Invariantes centrais
- produto ativo deve possuir categoria válida;
- item físico local deve conter disponibilidade real;
- categoria não pode ser removida se ainda tiver produtos ativos;
- links externos devem ter destino explícito e URL válida;
- a jornada B2B deve permanecer separada da venda direta.

## 6. Modelagem de dados
O banco relacional deve armazenar apenas o dado local necessário ao funcionamento da vitrine. O estoque físico e as categorias são as entidades primárias.

### Entidades sugeridas
- Categorias
  - id
  - nome
- Produtos
  - id
  - categoria_id
  - nome
  - preco
  - quantidade_estoque
  - imagem_url
  - ativo

### Observação importante
Links externos, campanhas e URLs de afiliados não devem ser tratados como produtos do banco local. Esses elementos são integrados ao frontend ou a uma camada de configuração específica.

## 7. Requisitos funcionais e não funcionais
### Requisitos funcionais principais
- exibir produtos físicos ativos;
- validar região antes do clique em WhatsApp;
- gerar mensagem pré-formatada para contato;
- apresentar blocos com links externos;
- disponibilizar catálogo em PDF;
- permitir gestão do catálogo e categorias por admin;
- disponibilizar autenticação segura para área administrativa;
- permitir acesso a leads B2B.

### Requisitos não funcionais principais
- performance em mobile;
- usabilidade mobile-first;
- segurança de autenticação e autorização;
- integridade de dados;
- manutenibilidade do código;
- portabilidade em navegadores modernos;
- acessibilidade básica.

## 8. Backlog e priorização
### MVP
- vitrine pública com produtos locais;
- validação de região;
- WhatsApp com mensagem contextualizada;
- gestão básica de produtos e categorias;
- autenticação do administrador.

### P1
- links externos e blocos de campanhas;
- catálogo PDF;
- conteúdo editável da página;
- registro de leads B2B.

### P2
- filtros por categoria e busca;
- campanhas promocionais;
- métricas e observabilidade.

## 9. Decisões arquiteturais relevantes
### 9.1. Frontend para regra de geolocalização
A regra de atendimento fica no frontend para reduzir requisições desnecessárias e melhorar a experiência do usuário.

### 9.2. Banco local somente para estoque físico
A base de dados não deve armazenar a representação completa de links externos ou produtos afiliados. Esse desacoplamento reduz complexidade e mantém o domínio claro.

### 9.3. Separação entre B2C e B2B
A jornada de compra e a jornada de captação não compartilham o mesmo fluxo, pois têm objetivos e públicos diferentes.

## 10. Riscos e pontos de atenção
- excesso de escopo em comparação ao objetivo do projeto;
- misturar dados locais com dados externos;
- permitir a venda de itens sem disponibilidade real;
- tornar a vitrine mais complexa do que necessário;
- falhar na diferenciação entre compra e recrutamento.

## 11. Conclusão
O projeto foi concebido para ser uma solução de conversão híbrida, com foco em simplicidade, velocidade e clareza. A arquitetura e o modelo de dados foram desenhados para preservar esse princípio, evitando excesso de complexidade sem sacrificar escalabilidade e operação.

A equipe de desenvolvimento deve seguir a regra central do projeto: vender o que a revendedora realmente tem, encaminhar o cliente para canais externos quando necessário e manter a captação B2B em um fluxo separado e bem definido.
