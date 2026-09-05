# Especificações Técnicas: Hub Híbrido de Curadoria e Conversão

## 1. Visão Geral do Produto
A plataforma é um **Hub Híbrido de Curadoria** para uma vendedora parceira de uma marca de cosméticos e bem-estar. O objetivo principal é transformar a vitrine em um canal de conversão multimodal: vender produtos físicos prontos para entrega via WhatsApp, direcionar a compra para o e-commerce oficial com deep links (afiliados), disponibilizar um catálogo em PDF e captar novas parceiras B2B.

O sistema é dividido em duas frentes de acesso:
* **Área Pública (Vitrine):** landing page aberta, focada em SEO, UX mobile-first e alta taxa de conversão.
* **Área Administrativa (Backoffice):** painel restrito por autenticação para gestão do estoque físico, conteúdos e categorias.

---

## 2. Modelo de Negócio e Regras de Conversão

### 2.1. Fluxos de Conversão
A experiência é organizada em quatro fluxos principais:

1. **Venda Física (Pronta-Entrega):**
   * exibe produtos ativos com disponibilidade no estoque físico local;
   * o botão de redirecionamento para o WhatsApp só deve ser liberado após a validação no frontend da cidade/região de atendimento da vendedora;
   * prioriza a conversão direta e o fechamento humano.

2. **Venda Online (Links de Afiliados):**
   * redireciona para subcategorias ou produtos específicos do site oficial da matriz;
   * estes produtos não existem no banco local do sistema;
   * o frontend apenas gerencia as URLs de redirecionamento.

3. **Catálogo Digital (PDF):**
   * disponibiliza o material visual completo em PDF;
   * pode ser exibido em visualizador web ou link direto para nuvem;
   * não deve atrapalhar a jornada principal de conversão.

4. **Captação B2B:**
   * funil isolado para recrutamento de novas parceiras;
   * não compete diretamente com a jornada de compra B2C;
   * pode ser acessado por um bloco de rodapé ou CTA específico.

### 2.2. Regras de Negócio
* A área pública deve ser simples, clara e orientada à conversão.
* O WhatsApp deve ser usado como canal de fechamento para itens físicos ou por intenção local.
* Os links externos devem apontar para categorias estratégicas do site matriz, não para uma loja genérica.
* O catálogo digital deve ser acessível sem quebrar a narrativa principal da vitrine.
* A captação B2B deve permanecer separada da conversão de consumo final.
* **Trava Geográfica:** a validação da cidade de atendimento será executada exclusivamente no front-end. O botão de redirecionamento para o WhatsApp permanecerá bloqueado/inativo até que o usuário insira ou confirme que está na cidade/região de atendimento da vendedora.

---

## 3. Arquitetura do Sistema
A comunicação entre as camadas prioriza a agilidade no frontend e a segurança no backend. Abaixo, o diagrama em texto ilustrando o fluxo e as integrações:

```text
[ Cliente / Navegador Mobile ]
         |
         | (1. Validação de Trava Geográfica via React State)
         v
[ Frontend Next.js (React) ] -------------------> [ Integrações Externas ]
         |                                             (Deep Links Afiliados / API WhatsApp)
         |
         | (2. Consumo de API REST / JSON)
         v
[ Backend (FastAPI / Python) ]
         |
         | (3. ORM - Consulta de Estoque Físico)
         v
[ Banco de Dados (PostgreSQL) ]
```

### 3.1. Padrão de Comunicação
* O frontend é responsável por validar a cidade e bloquear o CTA antes do envio para o WhatsApp.
* O backend não deve receber chamadas desnecessárias para validação geográfica.
* O backend apenas expõe dados do estoque físico e demais conteúdos administrativos.
* Os afiliados são tratados como URLs externas configuradas no frontend, sem persistência no banco relacional.

---

## 4. Estrutura de Componentes React
A interface será construída de forma modular, com os principais componentes focados em conversão e isolamento lógico:

* **Header:** navegação principal e identidade da vendedora.
* **BlocoEstoqueLocal:** componente responsável por renderizar os produtos físicos. Contém a lógica de estado interno (validação do input de cidade) para liberar o WhatsAppButton.
* **BlocoDeepLinks:** renderiza os banners e links de afiliados externos estáticos ou configurados no CMS, sem bater no banco de dados de produtos.
* **BlocoCatalogoPDF:** componente de visualização ou download do material de campanha.
* **BlocoB2B:** CTA isolado para captação de revendedoras.
* **WhatsAppButton:** componente burro (Presentation Component) que recebe a URL gerada e o booleano `isDisabled` controlado pela trava geográfica.

### 4.1. Decisão de Arquitetura da Trava Geográfica
A regra da região de atendimento deve ficar no front-end por três motivos:
* reduz requisições desnecessárias ao backend;
* melhora a experiência do usuário, bloqueando o CTA antes do atrito;
* evita persistência de regras de geolocalização em entidades do banco que não são parte do estoque físico.

---

## 5. Modelagem de Domínio (DDD)

### Linguagem Onipresente (Ubiquitous Language)
* **Vendedora/Parceira:** responsável pela curadoria, identidade da loja e região de atendimento.
* **Produto:** item apresentado na vitrine e disponível em estoque físico local.
* **Categoria:** agrupamento lógico da oferta (ex.: skincare, beleza, kits, perfumes, wellness).
* **OfertaLocal:** produto disponível para venda física com estoque local e disponibilidade imediata.
* **LinkExterno:** URL de afiliado apontando para a matriz; não é uma entidade persistida no banco de produtos.
* **CatalogoDigital:** material em PDF ou visualizador web.
* **Lead:** visitante que demonstra intenção de compra ou contato.
* **ParceiraB2B:** lead de recrutamento para o programa de revenda.
* **Administrador:** usuário autenticado para gerir conteúdos, produtos e links do hub.

### Contextos Delimitados (Bounded Contexts)
* **Contexto de Catálogo:** gestão de produtos e categorias do estoque físico.
* **Contexto de Vitrine:** renderização da landing page, blocos de conteúdo e jornadas de conversão.
* **Contexto de Conversão:** geração de links para WhatsApp e deep links externos.
* **Contexto de Backoffice:** autenticação, autorização e gerenciamento do conteúdo administrativo.

### Entidades e Invariantes
* **Agregado Principal:** `Produto`.
* **Entidades de Apoio:** `Categoria`, `OfertaLocal`, `CatalogoDigital`, `ParceiraB2B`.
* **Objetos de Valor:** `Preco` (não negativo, inclui moeda), `ContatoWhatsApp` (validado), `RegiaoAtendimento`.
* **Regras Invariantes:**
  * um produto deve possuir nome, categoria e imagem para publicação;
  * um produto com disponibilidade local deve ter `OfertaLocal` válida;
  * uma categoria não pode ser excluída se ainda possui produtos ativos;
  * links externos devem apontar para URL válida e com destino explícito;
  * a jornada B2B deve ser acessada por rota específica e não mesclada ao fluxo de compra B2C.

---

## 6. Modelagem de Dados (MER) - Estoque Físico
Respeitando as restrições arquiteturais, o banco de dados gerenciará apenas o estoque físico de pronta-entrega. Produtos de links afiliados não constam na modelagem relacional.

| Tabela | Coluna | Tipo | Descrição |
| :--- | :--- | :--- | :--- |
| `Categorias` | `id` | `UUID` | Identificador único da categoria. |
| `Categorias` | `nome` | `VARCHAR` | Nome da categoria (ex.: Skincare, Perfumaria). |
| `Produtos` | `id` | `UUID` | Identificador único do produto físico. |
| `Produtos` | `categoria_id` | `UUID` | Chave estrangeira referenciando `Categorias`. |
| `Produtos` | `nome` | `VARCHAR` | Nome comercial do produto de pronta-entrega. |
| `Produtos` | `preco` | `DECIMAL` | Valor de venda do produto físico. |
| `Produtos` | `quantidade_estoque` | `INTEGER` | Quantidade física real disponível com a parceira. |
| `Produtos` | `imagem_url` | `VARCHAR` | Caminho para a foto do produto. |
| `Produtos` | `ativo` | `BOOLEAN` | Define se o produto físico está visível na vitrine. |

### 6.1. Observação sobre a persistência
* URLs de afiliados e links externos não devem ser armazenadas como entidades de produto.
* O frontend deve carregar essas URLs a partir de configuração de conteúdo, CMS ou arquivo de ambiente, conforme a estratégia de integração adotada.

---

## 7. Backend (FastAPI, PostgreSQL e Python)

### 7.1. Separação de Rotas e Segurança
* **APIs Públicas:** leitura de vitrines, categorias, produtos ativos e material de catálogo.
* **APIs Privadas:** cadastro e edição de produtos, categorias, estoque físico, PDF e dados administrativos.
* **Autenticação:** JWT para proteger as rotas de administração e gestão de conteúdo.

### 7.2. Persistência e Repositórios
A comunicação com PostgreSQL deve seguir o padrão Repository, com ORM (SQLAlchemy/SQLModel) na camada de infraestrutura.

### 7.3. DTOs e Injeção de Dependências
* **Pydantic** para validação de entrada/saída.
* **FastAPI `Depends`** para injeção de repositórios, autenticação e permissões.
* Criação de serviços isolados para geração de links de WhatsApp e montagem de URLs externas.

### 7.4. Endpoints Sugeridos
* `GET /vitrine` — conteúdo público da landing page.
* `GET /produtos` — catálogo de produtos ativos.
* `GET /produtos/{id}` — detalhe do item.
* `GET /ofertas-locais` — itens disponíveis para pronta-entrega.
* `GET /catalogo` — informações do PDF / visualizador.
* `GET /links-externos` — deep links de afiliados configurados no frontend ou CMS.
* `POST /admin/login` — autenticação do administrador.
* `POST /admin/produtos` — criação de produto.
* `PUT /admin/produtos/{id}` — atualização.
* `DELETE /admin/produtos/{id}` — remoção lógica.
* `GET /admin/b2b` — lista de leads ou oportunidades de recrutamento.

---

## 8. Frontend (Next.js, TypeScript e React)

### 8.1. Roteamento e Estratégia de Renderização
* **Rotas Públicas:** `/`, `/produtos`, `/catalogo`.
* **Rotas Privadas:** `/admin`, `/admin/login`, `/admin/dashboard`.
* **Estratégia:** SSG/ISR para páginas públicas, favorecendo SEO e velocidade.

### 8.2. Arquitetura de Componentes
A proposta da ideação segue um modelo de blocos visuais, o que combina com a arquitetura de componentes em React:
* `Header`;
* `BlocoEstoqueLocal`;
* `BlocoDeepLinks`;
* `BlocoCatalogoPDF`;
* `BlocoB2B`;
* `Footer`;
* `WhatsAppButton`.

### 8.3. Design System
* **Estilização:** Tailwind CSS.
* **Componentes UI:** shadcn/ui para consistência e acessibilidade.
* **Diretrizes visuais:** mobile-first, mínima fricção, forte contraste de CTA e clareza na intenção do cliente.

### 8.4. Type Safety e Isolamento
* TypeScript estritamente tipado, sem `any`.
* Componentes sem lógica de negócio, apenas recebendo props.
* Hooks dedicados para `useCatalogo`, `useVitrine`, `useWhatsApp`, `useAuth`, `useTravaGeografica`.
* Serviços encapsulados para requisições e geração dinâmica de URLs externas.

---

## 9. Qualidade e Restrições Técnicas
* **Desacoplamento Visual e Lógico:** o consumo da API (fetch) e o gerenciamento de estado da Trava Geográfica ficarão isolados em Custom Hooks (ex.: `useEstoqueLocal()`, `useTravaGeografica()`), mantendo os componentes React limpos.
* **Segurança de Tipos:** o frontend utilizará TypeScript de forma estrita para mapear os retornos exatos do MER acima.
* **Backend Clean Architecture:** as requisições do front-end passarão por validações do Pydantic no FastAPI, garantindo que operações no banco (como baixa de estoque após confirmação manual) sejam seguras e atômicas.

---

## 10. Escopo Arquitetural de Mercado
Este projeto se classifica como um **Hub Híbrido de Curadoria**, e não como um e-commerce transacional completo. Ele exclui, intencionalmente, módulos como:
* checkout e processamento de pagamentos;
* contas de usuários finais (B2C);
* gestão logística e frete;
* emissão automatizada de notas fiscais;
* gestão complexa de ERP/WMS.

A simplificação é estratégica: o sistema deve ser leve, rápido e altamente orientado à conversão, priorizando conteúdo, intenção e canal humano de atendimento.

---

## 11. Alinhamento com a Ideação
O desenho técnico foi ajustado para refletir diretamente a visão da ideação:
* a vitrine centraliza diversas frentes de monetização em um único layout;
* o WhatsApp é o canal de fechamento para venda localizada;
* os links externos mantêm o bypass do menu da loja matriz;
* o catálogo em PDF entra como acesso complementar, sem atrapalhar a conversão;
* a captação B2B permanece isolada e não compete com a jornada B2C;
* a arquitetura de software suporta os blocos configuráveis e os fluxos de conversão híbrida.

Esse alinhamento mantém a viabilidade técnica do projeto e preserva a proposta de produto definida na ideação.
