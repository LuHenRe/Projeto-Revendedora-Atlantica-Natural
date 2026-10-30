# Plano de Implementação: Frontend - Hub Híbrido de Curadoria (Vitrine Virtual)

Este documento detalha o passo a passo para a construção do frontend do Hub Híbrido de Curadoria da Revendedora Atlântica Natural. O projeto segue as diretrizes da Arquitetura, Especificações Técnicas e os princípios rigorosos da **Clean Architecture**, **Domain-Driven Design (DDD)** com domínio rico em TypeScript puro, **TDD (Test-Driven Development)**, renderização híbrida no **Next.js 16+ com App Router**, bibliotecas **Tailwind CSS + Shadcn/UI**, **TanStack Query (Offline-First)** e preparação completa para deploy no **Render**.

---

## 1. Stack Tecnológico Definido

- **Framework Web:** **Next.js 16 ou superior**
  - App Router nativo com Turbopack habilitado.
  - Renderização híbrida: **Server-Side Rendering (SSR / React Server Components)** para SEO e performance de vitrine + **Client-Side Rendering (CSR)** para interatividades ricas.
  - Otimizações automáticas habilitadas: Turbopack, Cache Components, Partial Prefetching, Image Optimization e minificação nativa.
  - SEO robusto e Metadata dinâmico configurados em todas as páginas públicas.
- **Domínio de Negócio (DDD):** Domínio rico desacoplado com validações de regras invariantes em **TypeScript puro**, guiado por **TDD (Red-Green-Refactor)**.
- **Bibliotecas de Interface:**
  - **Tailwind CSS v4:** Design system moderno, tokens customizados para a marca Atlântica Natural.
  - **Shadcn/UI (Radix UI primitives):** Componentes acessíveis, responsivos e sem acoplamento a bibliotecas monolíticas.
  - **Lucide React:** Ícones modernos e vetoriais em SVG.
- **Gerenciamento de Estado e Dados:**
  - **TanStack Query (`@tanstack/react-query`):** Execução com suporte a **Offline-First** (`networkMode: 'offlineFirst'`), cache reativo em memória e sincronização inteligente para vitrine e estoque local.
  - Custom Hooks e Context API para regras de trava geográfica e sacola de pronta-entrega.
- **Formulários e Validação:** React Hook Form + `@hookform/resolvers/zod` + Zod (sincronizado com os schemas Pydantic do backend FastAPI).
- **Sessão e Segurança:** Cookies HTTP-Only geridos no servidor + `middleware.ts` do Next.js (proteção server-side contra XSS e zero flicker na área `/admin`).
- **Testes Automatizados:** **Vitest** + **React Testing Library** executando tanto **testes unitários** (entidades puras e use cases de domínio) quanto **testes de interface** (componentes interativos).
- **Plataforma de Deploy:** **Render** (Node.js Web Service orquestrado via `render.yaml` integrado ao backend FastAPI).

---

## 2. Estrutura do Projeto (Clean Architecture & Domínio Espelhado)

O frontend reflete a separação estrita de responsabilidades: o domínio não conhece o React nem o Next.js, permitindo testes unitários ultrarrápidos e independência de frameworks:

```text
frontend/
├── src/
│   ├── middleware.ts                   # Proteção Server-Side das rotas /admin via Cookies HTTP-Only
│   │
│   ├── domain/                         # Camada de Domínio Rico Puro (TypeScript puro, sem dependências externas)
│   │   ├── entities/                   # Entidades com regras e validações invariantes
│   │   │   ├── Produto.ts
│   │   │   ├── Categoria.ts
│   │   │   ├── ProdutoMatriz.ts
│   │   │   ├── OfertaLocal.ts
│   │   │   └── ItemSacola.ts           # Item agrupado na sacola de pronta-entrega
│   │   ├── value-objects/              # Objetos de Valor Imutáveis
│   │   │   ├── Preco.ts
│   │   │   ├── RegiaoAtendimento.ts
│   │   │   ├── ContatoWhatsApp.ts
│   │   │   └── UrlExterna.ts
│   │   └── repositories/               # Contratos Abstratos (Interfaces/Ports)
│   │       ├── IProdutoRepository.ts
│   │       ├── ICategoriaRepository.ts
│   │       ├── IProdutoMatrizRepository.ts
│   │       └── IAuthRepository.ts
│   │
│   ├── application/                    # Casos de Uso (Use Cases testados via TDD)
│   │   ├── use-cases/
│   │   │   ├── ValidarRegiaoAtendimento.ts
│   │   │   ├── GerarMensagemWhatsApp.ts   # Suporta item único direto (1 clique) ou sacola combinada
│   │   │   ├── ListarVitrineProdutos.ts
│   │   │   ├── ListarOfertasLocais.ts
│   │   │   ├── ListarDestaquesMatriz.ts
│   │   │   ├── AutenticarAdministrador.ts
│   │   │   ├── SalvarProdutoLocal.ts
│   │   │   └── InativarProdutoLocal.ts
│   │   └── dtos/                       # DTOs de entrada e saída dos casos de uso
│   │
│   ├── infrastructure/                 # Adapters e Implementações Técnicas Externas
│   │   ├── api/                        # Repositórios HTTP que conversam com o FastAPI
│   │   │   ├── httpClient.ts
│   │   │   ├── ProdutoRepositoryHttp.ts
│   │   │   ├── CategoriaRepositoryHttp.ts
│   │   │   ├── ProdutoMatrizRepositoryHttp.ts
│   │   │   └── AuthRepositoryHttp.ts
│   │   ├── query/                      # Configuração do TanStack Query (Cache & Offline-First)
│   │   │   ├── queryClient.ts          # QueryClient com networkMode offlineFirst e retry inteligente
│   │   │   └── QueryProvider.tsx       # Provider React para a aplicação
│   │   ├── actions/                    # Server Actions (Next.js BFF seguro para Admin Mutations)
│   │   │   ├── authActions.ts          # Login/Logout gravando Cookie HTTP-Only
│   │   │   ├── produtoActions.ts       # Criar, editar, inativar com revalidatePath
│   │   │   └── matrizActions.ts        # Disparar web scraping no backend
│   │   ├── storage/                    # Persistência Local (apenas preferências e cache do cliente)
│   │   │   └── LocalStorageAdapter.ts  # Trava geográfica e itens da sacola
│   │   ├── analytics/                  # Módulo de Rastreamento de Conversões
│   │   │   └── tracker.ts              # Eventos: click_whatsapp_direto, checkout_sacola, click_afiliado
│   │   └── config/                     # Variáveis de Ambiente e Constantes da Aplicação
│   │       └── env.ts
│   │
│   └── presentation/                   # Camada de Apresentação (React 19 / Next.js 16)
│       ├── app/                        # App Router do Next.js (SSR / RSC + CSR)
│       │   ├── page.tsx                # Vitrine Pública (RSC com ISR - Super rápido & SEO)
│       │   ├── layout.tsx              # Layout Global (Fontes, Metatags, Theme, QueryProvider)
│       │   ├── produtos/               # Catálogo completo com busca e filtros
│       │   │   └── page.tsx
│       │   ├── catalogo/               # Visualizador de Catálogo em PDF
│       │   │   └── page.tsx
│       │   ├── admin/                  # Área Restrita (Protegida no Servidor via Middleware)
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── produtos/
│       │   │   │   └── page.tsx
│       │   │   ├── categorias/
│       │   │   │   └── page.tsx
│       │   │   └── produtos-matriz/
│       │   │       └── page.tsx
│       ├── components/                 # Componentes Visuais (Shadcn/UI + Tailwind)
│       │   ├── ui/                     # Primitivos Shadcn/UI (Button, Dialog, Input, Badge, Card, etc.)
│       │   ├── common/                 # Header, Footer, Navbar, Badges de Status
│       │   ├── vitrine/                # Blocos da Vitrine Pública
│       │   │   ├── HeroBanner.tsx      # RSC
│       │   │   ├── BlocoEstoqueLocal.tsx # RSC / TanStack Query
│       │   │   ├── CardProduto.tsx     # Client Component (CTA WhatsApp ou Adicionar à Sacola)
│       │   │   ├── ModalTravaGeografica.tsx # Client Component com Shadcn Dialog
│       │   │   ├── WhatsAppButton.tsx  # Client Component com feedback visual
│       │   │   ├── BarraSacolaFlutuante.tsx # Client Component
│       │   │   ├── BlocoDeepLinks.tsx  # RSC
│       │   │   ├── CardProdutoMatriz.tsx # Client Component com telemetria
│       │   │   ├── BlocoCatalogoPDF.tsx# RSC
│       │   │   └── BlocoB2B.tsx        # RSC
│       │   └── admin/                  # Componentes do Backoffice
│       │       ├── AdminHeader.tsx
│       │       ├── AdminSidebar.tsx
│       │       ├── TabelaProdutos.tsx
│       │       ├── ModalProdutoForm.tsx# React Hook Form + Zod
│       │       ├── TabelaCategorias.tsx
│       │       ├── ModalCategoriaForm.tsx # React Hook Form + Zod
│       │       └── FormScraperMatriz.tsx # React Hook Form + Zod
│       ├── hooks/                      # Custom Hooks (Conectam TanStack Query e Casos de Uso à UI)
│       │   ├── useTravaGeografica.ts
│       │   ├── useWhatsApp.ts
│       │   ├── useSacola.ts
│       │   ├── useProdutosQuery.ts     # TanStack Query com offline-first
│       │   └── useAuth.ts
│       └── utils/                      # Utilitários (cn, formatadores de moeda)
│           └── cn.ts
```

---

## 3. Fases de Execução

---

### Fase 1: Setup do Projeto, Dependências e Design System (Concluída)
**Objetivo:** Inicializar o projeto Next.js 16 com Turbopack, configurar bibliotecas de produtividade, TanStack Query, Shadcn/UI e estabelecer o Design System mobile-first.

1. **Setup Inicial Concluído:**
   - Projeto Next.js 16.4.3 configurado com TypeScript strict, Turbopack e ESLint.
   - Dependências essenciais instaladas:
     - Interface: `tailwindcss`, `lucide-react`, `clsx`, `tailwind-merge`.
     - Validação e Formulários: `zod`, `react-hook-form`, `@hookform/resolvers`.
     - Estado e Offline-First: `@tanstack/react-query`.
     - Testes: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`.
2. **Design System & SEO:**
   - Paleta de cores da Atlântica Natural (verde esmeralda, oliva, ouro/amber, whatsapp) configurada no `globals.css`.
   - Fontes modernas (`Inter` e `Outfit`) e metatags de SEO no `layout.tsx`.
   - Path aliases configurados no `tsconfig.json` e `vitest.config.mts` (`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`).
3. **Ambiente:**
   - `.env.example`, `.env.local` e módulo tipado `src/infrastructure/config/env.ts`.

---

### Fase 2: Modelagem do Domínio Rico e Casos de Uso (DDD & TDD Puro)
**Objetivo:** Implementar o núcleo de negócio puro em TypeScript orientado estritamente por **TDD (Red-Green-Refactor)**, garantindo que 100% das regras e invariantes sejam validadas por testes unitários antes de qualquer interface gráfica.

1. **Ciclo TDD:**
   - Para cada entidade ou value object, escreve-se primeiro o teste unitário (`*.test.ts`) descrevendo o comportamento esperado, assiste-se ao teste falhar (Red), implementa-se o código mínimo suficiente (Green) e refatora-se para máxima legibilidade (Refactor).
2. **Entidades do Domínio Rico:**
   - `Produto`:
     - Invariantes: nome não vazio, preço estritamente positivo, quantidade de estoque não negativa, categoria obrigatória.
     - Métodos de negócio: `temEstoqueDisponivel()`, `isAtivo()`, `inativar()`, `ativar()`.
   - `Categoria`:
     - Invariantes: nome válido não vazio.
   - `ProdutoMatriz`:
     - Entidade de destaque externo com `urlOrigem` e `urlAfiliada` validada para deep linking.
   - `OfertaLocal`:
     - Encapsula o produto, estoque disponível e regras de entrega imediata.
   - `ItemSacola`:
     - Encapsula a seleção de múltiplos produtos locais, cálculo de subtotal e controle de quantidade.
3. **Objetos de Valor (Value Objects Imutáveis):**
   - `Preco`: Representação monetária segura com formatação em BRL (`R$ 49,90`), arredondamento e proibição de valores negativos.
   - `RegiaoAtendimento`: Lógica da trava geográfica (validação da cidade/região atendida pela vendedora).
   - `ContatoWhatsApp`: Higienização do número (formato internacional E.164) e sanitização de texto para URLs (`encodeURIComponent`).
   - `UrlExterna`: Validação estrita de formato de URL para direcionamento à matriz.
4. **Casos de Uso da Aplicação (Application Use Cases):**
   - `ValidarRegiaoAtendimentoUseCase`: Processa a confirmação de localidade e libera o botão de WhatsApp.
   - `GerarMensagemWhatsAppUseCase`:
     - Fluxo 1 Clique: Gera texto contextualizado para um único item (`"Olá! Gostei do produto X..."`).
     - Fluxo Sacola: Gera texto agrupado para múltiplos itens (`"Olá! Gostaria de pedir: 2x Item A, 1x Item B. Total: R$ Z..."`).
   - `AutenticarAdministradorUseCase`: Valida credenciais e prepara o DTO de login.

---

### Fase 3: Infraestrutura, TanStack Query (Offline-First) e Segurança
**Objetivo:** Estabelecer a comunicação com o backend FastAPI, implementar estratégia Offline-First com TanStack Query e proteger a área restrita com Cookies HTTP-Only no servidor.

1. **Configuração do TanStack Query com Offline-First:**
   - Criação de `QueryClient` configurado com:
     - `defaultOptions.queries.networkMode: 'offlineFirst'` (permite consumir cache prévio mesmo em conexões instáveis de celular).
     - `staleTime`: 5 minutos para dados de vitrine, garantindo navegação instantânea.
     - `gcTime`: 24 horas para retenção de catálogo em memória.
   - `QueryProvider` encapsulado para alimentar os Client Components.
2. **Segurança de Sessão com Cookies HTTP-Only:**
   - O token JWT é armazenado em **Cookies HTTP-Only**, eliminando risco de roubo por scripts XSS.
   - Server Actions / Route Handlers no Next.js (`src/infrastructure/actions/authActions.ts`) recebem as credenciais, chamam o FastAPI `POST /admin/login` e gravam o cookie seguro com `httpOnly: true`, `secure: true`, `sameSite: 'lax'`.
   - `src/middleware.ts` intercepta qualquer acesso a `/admin/*` (exceto `/admin/login`) no nível do servidor (Edge/Node), redirecionando requisições sem cookie antes mesmo de iniciar a renderização da página (Zero Flash of Unauthenticated Content).
3. **Repositórios HTTP (Adapters):**
   - `ProdutoRepositoryHttp`, `CategoriaRepositoryHttp`, `ProdutoMatrizRepositoryHttp`.
   - Injeção automática do cabeçalho `Authorization: Bearer <token>` nas requisições administrativas.

---

### Fase 4: Paradigma App Router (RSC + CSR) e Hooks Reativos
**Objetivo:** Otimizar a performance entregando HTML pré-renderizado no servidor (RSC/ISR) e reservando o JavaScript cliente aos componentes interativos.

1. **Vitrine Pública via React Server Components (RSC):**
   - A página principal `src/presentation/app/page.tsx` executa `fetch` dos produtos no servidor com ISR (`next: { revalidate: 60 }`), entregando catálogo já pré-renderizado para o Google e redes sociais.
2. **Camada Interativa Client-Side (CSR):**
   - **`useTravaGeografica`:** Gerencia a confirmação da cidade do usuário e o bloqueio/desbloqueio do CTA de compra.
   - **`useWhatsApp`:** Conecta o produto ao caso de uso de montagem de link do WhatsApp.
   - **`useSacola`:** Permite acumular itens para compra combinada, persistindo a sacola localmente.
   - **`useProdutosQuery`:** Hook com TanStack Query para catálogo dinâmico com suporte offline.

---

### Fase 5: Desenvolvimento da Vitrine Pública com Shadcn/UI e Telemetria
**Objetivo:** Construir a interface mobile-first com design botânico refinado, alta taxa de conversão e rastreamento de métricas.

1. **Componentes Shadcn/UI Integrados:**
   - Instalação e uso de primitivos como `Dialog` (Modal da Trava Geográfica), `Button` com variantes de conversão, `Badge` para estoque/pronta-entrega e `Card` para vitrine.
2. **Blocos de Conversão:**
   - **Header & Identidade:** Nome da revendedora e badge da região de atendimento.
   - **Modal da Trava Geográfica:** Diálogo elegante com confirmação de região.
   - **Bloco 1 (Estoque Físico Local):** Cards ricos com duplo CTA (1 clique no WhatsApp + adicionar à sacola) e barra flutuante de sacola.
   - **Bloco 2 (Destaques da Matriz):** Cards com redirecionamento de afiliada obtidos via scraping.
   - **Bloco 3 (Catálogo PDF) & Bloco 4 (Captação B2B):** Download da revista e funil para novas parceiras.
3. **Telemetria de Conversão (`tracker.ts`):**
   - Disparo de eventos analíticos (`lead_whatsapp_direto`, `lead_whatsapp_sacola`, `click_afiliado_matriz`) para otimização de campanhas de tráfego pago.

---

### Fase 6: Painel Administrativo com React Hook Form + Zod
**Objetivo:** Interface protegida para a revendedora gerenciar seus produtos, categorias e importar itens da matriz.

1. **Login Seguro (`/admin/login`):**
   - Formulário com React Hook Form + Zod autenticando via Cookie HTTP-Only.
2. **Gestão de Produtos (`/admin/produtos`):**
   - Tabela responsiva com listagem, busca e edição em modal com validação Zod.
   - Ações de exclusão lógica (inativação) e reativação chamando Server Actions com `revalidatePath`.
3. **Gestão de Categorias (`/admin/categorias`):**
   - CRUD simplificado de categorias.
4. **Scraper da Matriz (`/admin/produtos-matriz`):**
   - Campo para colar a URL do produto na loja oficial da Atlântica Natural para acionar a extração automática.

---

### Fase 7: Suíte Completa de Testes com Vitest e Testing Library
**Objetivo:** Validar a integridade das regras de negócio e a experiência do usuário tanto em nível unitário quanto de interface.

1. **Testes Unitários (Vitest puro):**
   - Testes das entidades de domínio (`Produto.test.ts`, `Preco.test.ts`, `RegiaoAtendimento.test.ts`).
   - Testes dos casos de uso (`GerarMensagemWhatsApp.test.ts`, `ValidarRegiaoAtendimento.test.ts`).
2. **Testes de Interface / Componentes (React Testing Library + Vitest):**
   - Teste do `WhatsAppButton`: verifica se o clique abre a modal quando a trava não está confirmada e se redireciona com o link formatado quando confirmada.
   - Teste do `CardProduto`: renderização de badges de pronta-entrega versus indisponível.
   - Teste da `BarraSacolaFlutuante`: validação da soma de itens e subtotal.
3. **Testes de Segurança:**
   - Validação do middleware bloqueando acessos anônimos a `/admin`.

---

### Fase 8: Deploy no Render e Configurações de Produção
**Objetivo:** Deploy automatizado e resiliente no Render integrado ao backend.

1. **Deploy como Web Service Node.js:**
   - Build: `npm install && npm run build`
   - Start: `npm start`
2. **Infraestrutura como Código (`render.yaml`):**
   - Blueprint com banco PostgreSQL, Backend FastAPI e Frontend Next.js 16.
3. **CORS & Otimizações:**
   - Permissão do domínio de produção no CORS do FastAPI.
   - Headers de segurança e tags Open Graph para pré-visualização no WhatsApp.

---

## 4. Próximos Passos Imediatos

Com a **Fase 1 já concluída** e o plano atualizado com todas as diretrizes de Domínio Rico (DDD/TDD), Next.js 16+, Shadcn/UI, TanStack Query (Offline-First) e Vitest/RTL:
1. Avançar para a **Fase 2: Modelagem do Domínio Rico e Casos de Uso com TDD**.
