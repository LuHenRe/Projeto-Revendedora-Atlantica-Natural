# Especificações Técnicas: Plataforma de Conversão e Catálogo

## 1. Visão Geral do Produto
A plataforma é um canal digital focado na conversão de vendas de produtos de saúde, estética e bem-estar (chás, suplementos e óleos). 
Diferente de um e-commerce tradicional com carrinho e gateway de pagamento, o sistema atua como um **Catálogo de Captura de Leads**, onde a intenção de compra é redirecionada para o fechamento via WhatsApp.

O sistema é dividido em duas frentes de acesso:
* **Área Pública (Vitrine):** Landing page aberta a todos os visitantes, focada em SEO, carregamento ultrarrápido e alta taxa de conversão.
* **Área Administrativa (Backoffice):** Painel de controle restrito por login (autenticação JWT) para o gerenciamento de produtos, categorias e preços.

---

## 2. Modelagem de Domínio (DDD)

### Linguagem Onipresente (Ubiquitous Language)
* **Produto:** O item físico vendido (chá, óleo, suplemento).
* **Categoria:** O agrupamento lógico de produtos (ex: "Estética", "Emagrecimento").
* **Variante:** Opções de um mesmo produto (ex: tamanho, sabor).
* **Lead:** O visitante que clica no botão de contato demonstrando intenção de compra na área pública.
* **Redirecionamento de Conversão:** A ação de levar o usuário do site para o WhatsApp com uma mensagem pré-formatada.
* **Administrador:** Usuário com credenciais de acesso para gerenciar o catálogo.

### Contextos Delimitados (Bounded Contexts)
* **Contexto de Catálogo:** Gerencia produtos, categorias, descrições, imagens e preços.
* **Contexto de Engajamento:** Exibe a landing page e gera os links dinâmicos do WhatsApp (consome dados do Catálogo).
* **Contexto de Backoffice:** Gerencia o login, segurança e as permissões (CRUD) do administrador.

### Entidades e Invariantes
* **Agregado Principal:** `Produto` (Entity raiz).
* **Objetos de Valor:** `Preco` (não negativo, inclui moeda), `ContatoWhatsApp` (formato validado).
* **Regras Invariantes:** Um `Produto` exige imagem e `Preco` válidos para publicação. Uma `Categoria` não pode ser excluída se possuir produtos ativos.

---

## 3. Arquitetura de Software (Clean Architecture)
O núcleo da aplicação (regras de negócio) é independente de frameworks, banco de dados ou bibliotecas externas. 
As responsabilidades são divididas nas seguintes camadas:
* **Entidades:** Classes puras com regras intrínsecas ao negócio.
* **Casos de Uso (Use Cases):** Orquestradores das regras da aplicação (ex: `ListarProdutos`, `AutenticarAdministrador`).
* **Adaptadores de Interface:** Controllers (Backend) e Presenters (Frontend).
* **Infraestrutura:** PostgreSQL, FastAPI, Next.js e integrações de rede.

---

## 4. Backend (FastAPI, PostgreSQL e Python)

### Separação de Rotas e Segurança
* **APIs Públicas:** Endpoints abertos de leitura para alimentar a vitrine do frontend.
* **APIs Privadas:** Rotas protegidas por JSON Web Tokens (JWT) para as operações de escrita, edição e exclusão de catálogo.

### Persistência e Repositórios
A comunicação com o banco de dados relacional (PostgreSQL) ocorrerá estritamente através do Padrão Repository, utilizando um ORM (como SQLAlchemy/SQLModel) alocado na camada de infraestrutura.

### Type Safety e Injeção de Dependências
* O **Pydantic** será utilizado para validar DTOs de entrada e saída.
* O sistema de injeção de dependências do FastAPI (`Depends`) injetará repositórios e validará tokens, mantendo a inversão de controle para facilitar a testabilidade.

---

## 5. Frontend (Next.js, TypeScript e React)

### Roteamento e Estratégia de Renderização
* **Rotas Públicas (`/`, `/produtos`):** Utilização de SSG (Static Site Generation) ou ISR (Incremental Static Regeneration) para garantir performance extrema e SEO.
* **Rotas Privadas (`/admin`):** Protegidas por middlewares, acessíveis apenas com token válido no client-side.

### Interface e Design System
* **Estilização:** Tailwind CSS para classes utilitárias e consistência visual.
* **Componentes:** shadcn/ui para garantir acessibilidade (ARIA) e controle total sobre o código dos componentes interativos.

### Type Safety e Isolamento
* Tipagem estrita global com TypeScript (ausência de `any`).
* Isolamento lógico: Componentes de interface apenas recebem `props`, enquanto lógicas de requisição à API e gerenciamento de estado ficam encapsuladas em Custom Hooks (ex: `useCatalogo()`).

---

## 6. Qualidade e Testes (TDD)
O desenvolvimento seguirá o fluxo **Red-Green-Refactor**.

### Ferramental
* **Backend:** Pytest (runner e cobertura) + HTTPX (testes assíncronos de API).
* **Frontend:** Vitest/Jest + React Testing Library.

### Foco de Cobertura
* **Testes de Unidade:** Focados nas Entidades, Objetos de Valor e Casos de Uso (sem I/O, banco ou rede).
* **Testes de Integração:** Focados nos Repositórios (PostgreSQL) e no acoplamento das rotas da API.

---

## 7. Escopo Arquitetural de Mercado
Este projeto é classificado como um **Catálogo de Captura de Leads**. Diferencia-se de plataformas de E-commerce Transacionais (como Natura ou Avon) pela ausência intencional dos seguintes módulos no backend:
* Checkout e processamento de pagamentos.
* Gestão de contas de usuários finais (B2C).
* Controle logístico, cálculo de frete e integrações com WMS/ERPs.
* Emissão automatizada de notas fiscais sistêmicas.
Essa simplificação garante um sistema ágil, sem superengenharia, focando todos os recursos na conversão de vendas diretamente para os canais de atendimento humano.
