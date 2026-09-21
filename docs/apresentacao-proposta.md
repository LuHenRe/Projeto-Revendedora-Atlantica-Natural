---
theme: seriph
background: https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Proposta de Especificação e Arquitetura
  Vitrine Virtual - Atlântica Natural
transition: slide-left
title: Vitrine Virtual Atlântica Natural
mdc: true
---

# PROPOSTA DE ESPECIFICAÇÃO E ARQUITETURA

## Vitrine Virtual - Atlântica Natural

Digitalização do Hub Híbrido de Curadoria — Next.js, FastAPI e PostgreSQL

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Pressione Espaço para avançar <carbon:arrow-right class="inline"/>
  </span>
</div>

---
transition: fade-out
---

# Agenda da Apresentação

<v-clicks>

- **01.** Contexto e escopo
- **02.** Stack de referência
- **03.** Requisitos funcionais e não funcionais
- **04.** Atores do sistema e Casos de Uso
- **05.** Diagrama de atividades (Jornada Principal)
- **06.** Arquitetura: Componentes e Clean Architecture
- **07.** Modelagem de Dados: Classes e DER
- **08.** Persistência e Diagrama de Objetos
- **09.** Diagramas de Estado
- **10.** Padrão Boundary-Control-Entity (BCE)
- **11.** Mapeamento DDD e Estratégia de Testes (TDD)
- **12.** Cronograma do Projeto

</v-clicks>

---
layout: default
---

# 01. Contexto: Por que este aplicativo existe

<v-clicks>

- **Problema:** Falta de centralização nas vendas da revendedora. Venda física, links de afiliada, e captação de parceiras acontecem em canais dispersos e não otimizados.
- **Restrição:** Não há escopo ou orçamento para um e-commerce complexo com gateway de pagamento nativo ou cálculo de frete.
- **Abordagem:** Hub Híbrido de Curadoria (Next.js + FastAPI) focando apenas em conversão via WhatsApp (pronta-entrega) e links externos, com área administrativa simples.
- **Método:** UML + DDD + Clean Architecture + TDD.

</v-clicks>

<br>

<v-click>

| Decisão | Resumo |
|---------|--------|
| **Fechamento via WhatsApp** | Mantém a proximidade do atendimento humano e elimina complexidade de checkout. |
| **Trava Geográfica (Frontend)** | Evita requisições ao backend e impede fechamento físico para clientes fora da região atendida. |
| **Bypass B2C x B2B** | Fluxo de captação de novas revendedoras isolado da experiência de compra. |

</v-click>

---
layout: default
---

# 02. Stack Tecnológico (Arquitetura de Referência)

| Camada | Escolha | Observação |
|--------|---------|------------|
| **Frontend / Web** | Next.js (React) + TypeScript | UX Mobile-first, alta performance, páginas rápidas para conversão. |
| **Backend / API** | FastAPI (Python) | Leve, assíncrono, documentação automática (Swagger). |
| **Persistência / BD** | PostgreSQL | Fonte da verdade relacional para o estoque físico e leads. |
| **Integração Externa** | Deep Links WhatsApp e Matriz | O sistema gera URLs dinâmicas e de afiliada. |
| **Design System** | Tailwind CSS | Estilização utilitária e responsiva focada em dispositivos móveis. |
| **Autenticação Admin** | JWT | Protege as rotas do Backoffice. |

---
layout: default
---

# 03. Requisitos Funcionais (Principais)

| ID | Descrição | Prior. | Ator |
|----|-----------|--------|------|
| RF01 | Exibir estoque físico local na vitrine. | Alta | Cliente Final |
| RF02 | Validar região de atendimento (trava geográfica) antes de liberar contato. | Alta | Sistema |
| RF03 | Redirecionar para WhatsApp com mensagem pré-formatada. | Alta | Cliente Final |
| RF04 | Exibir blocos com links externos de afiliada para a matriz. | Alta | Cliente Final |
| RF05 | Exibir catálogo oficial em PDF na página. | Média | Cliente Final |
| RF06 | Redirecionar para formulário externo de captação de revendedoras (B2B). | Alta | Cliente Final |
| RF07 | Gerenciar produtos, estoque físico e categorias por backoffice. | Alta | Revendedora |
| RF10 | Autenticar na área administrativa (segurança JWT). | Alta | Revendedora |

---
layout: default
---

# 03.1 Requisitos Não Funcionais

| ID | Categoria | Descrição + critério |
|----|-----------|----------------------|
| RNF01 | Performance | A página inicial deve carregar rapidamente em mobile (Mobile-first). |
| RNF02 | Usabilidade | Interface otimizada para celular (espaçamento de botões, leitura simples). |
| RNF03 | Segurança | Rotas de gestão no backend restritas via autenticação JWT. |
| RNF04 | Manutenibilidade | Frontend com componentes isolados e Clean Architecture no Backend. |
| RNF05 | Confiabilidade | A conversão e validação geográfica devem estar blindadas contra bypass no fluxo feliz. |

---
layout: default
---

# 04. Atores do Sistema

| Ator | Tipo | Papel |
|------|------|-------|
| **Cliente final (B2C)** | Usuário não autenticado | Acessa vitrine, valida região, clica no WhatsApp, acessa links, lê PDF. |
| **Lead (B2B)** | Usuário não autenticado | Interessado em revender a marca. Clica no link e é redirecionado para a matriz. |
| **Revendedora (Admin)** | Usuário autenticado | Gerencia estoque, categorias e conteúdo da vitrine via painel. |
| **Sistema WhatsApp** | Sistema externo | Recebe o tráfego gerado pela vitrine virtual. |
| **Loja Matriz** | Sistema externo | Destino dos links de afiliada para produtos de cauda longa. |

---
layout: image-right
image: ./docs/fotos-diagramas/12-diagrama-atividades_1.png
backgroundSize: contain
---

# 05. Diagrama de Atividades 

A jornada principal do Hub Híbrido, dividindo o fluxo de decisão:
- Venda Local
- Venda Matriz
- Catálogo
- Revendedora (B2B)

*(A imagem ao lado renderiza o diagrama gerado na documentação de arquitetura).*

---
layout: center
---

# 06. Arquitetura: Componentes e Clean Architecture

O Backend adota Clean Architecture isolando domínio de frameworks (FastAPI/SQLAlchemy).

<img src="./docs/fotos-diagramas/07-diagrama-componentes_1.png" class="h-80 mx-auto" />

---
layout: center
---

# 07. Modelagem de Dados: Diagrama de Classes

Centraliza a lógica nas entidades puras (Produto como Aggregate Root).

<img src="./docs/fotos-diagramas/04-diagrama-classes_1.png" class="h-90 mx-auto" />

---
layout: center
---

# 07.1 Modelo Entidade-Relacionamento (DER)

Reflete o banco de dados PostgreSQL.

<img src="./docs/fotos-diagramas/05-diagrama-er_1.png" class="h-80 mx-auto" />

---
layout: center
---

# 08. Diagrama de Objetos

Exemplo de um cenário real (Produto associado a uma Oferta Local para São Paulo).

<img src="./docs/fotos-diagramas/09-diagrama-objetos_1.png" class="h-80 mx-auto" />

---
layout: center
---

# 09. Diagrama de Estado

Exemplo de ciclo de vida do Produto (Estoque Físico).

<img src="./docs/fotos-diagramas/10-diagrama-estados_1.png" class="h-80 mx-auto" />

---
layout: center
---

# 10. Padrão Boundary-Control-Entity (BCE)

Mapeamento estrutural separando interface gráfica/API, regras de orquestração e entidades de domínio.

<img src="./docs/fotos-diagramas/11-bce-mapeamento_1.png" class="h-80 mx-auto" />

---
layout: default
---

# 11. Implementação: Mapeamento DDD e TDD

| Aggregate Root | Entidades Internas | Value Objects | Repository |
|----------------|--------------------|---------------|------------|
| **Produto** | OfertaLocal | Preco, RegiaoAtendimento | ProdutoRepository |
| **Categoria** | - | - | CategoriaRepository |


<br/>

### Pirâmide de Testes (TDD: Red → Green → Refactor)
1. **Domínio:** Sem mock — validações de `Preco` e `RegiaoAtendimento`.
2. **Use Case:** Fakes in-memory de repositórios (ex: testar `CadastrarProdutoUseCase`).
3. **Gateway/Adapter/API:** Controllers do FastAPI e ORM testados com cliente HTTP e DB real em ambiente de testes.

---
layout: default
---

# 12. Cronograma Estimado (14 a 18 semanas)

| Fase | O que | Tempo |
|------|-------|-------|
| **Fase 1** | Levantamento, UX e Estrutura Inicial (Foco Mobile) | 2 - 3 semanas |
| **Fase 2** | Design e Prototipação dos blocos do Hub Híbrido | 2 - 3 semanas |
| **Fase 3** | Desenvolvimento do Frontend (Next.js + trava geográfica) | 4 - 5 semanas |
| **Fase 4** | Desenvolvimento do Backend (FastAPI, Postgres, Admin) | 3 - 4 semanas |
| **Fase 5** | Testes, Homologação e Ajustes Finais | 2 semanas |
| **Fase 6** | Lançamento e Suporte Inicial (Deploy) | 1 semana |

---
layout: center
class: text-center
---

# Muito Obrigado!

### Vitrine Virtual Atlântica Natural
