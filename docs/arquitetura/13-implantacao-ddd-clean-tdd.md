# Implementação: DDD, Clean Architecture e TDD

Insumo para implementação direta do software. Entidades/RF/casos de uso do documento viram código na ordem: **domínio → aplicação → infraestrutura/interface**. Nunca começar pelo banco ou pelo controller.

---

## 1. DDD (Domain-Driven Design)

### Entidades de domínio
Extraídas do diagrama de classes (seção 4):

| Entidade | Identidade | Ciclo de vida |
|---|---|---|
| `Produto` | uuid | cadastrar → publicar → ocultar/desativar (ver seção 10 — diagrama de estados) |
| `Categoria` | uuid | cadastro, atualização |
| `OfertaLocal` | uuid | habilitar → esgotar/repor → desabilitar |
| `Administrador` | uuid | login, gerenciar conteúdo |
| `LeadB2B` | uuid | cadastrar → marcar contactado/descartar |

### Value Objects

| Value Object | Valores | Usado em |
|---|---|---|
| `Preco` | valor: Decimal, moeda: BRL | `Produto.preco` |
| `RegiaoAtendimento` | cidade: string, uf: string | `OfertaLocal.regiao` |
| `ContatoWhatsApp` | telefone: string, mensagem: string | Montagem do link |
| `UrlExterna` | url: string (validada) | `LinkExterno` |

Value Objects são imutáveis e comparados por valor, não por identidade.

### Agregados

| Aggregate Root | Entidades internas | Value Objects | Repository |
|---|---|---|---|
| `Produto` | `OfertaLocal` (composição) | `Preco`, `RegiaoAtendimento` | `ProdutoRepository` |
| `Administrador` | — | — | `AdministradorRepository` |
| `LeadB2B` | — | — | `LeadB2BRepository` |

> Regra: `OfertaLocal` só é acessada por fora do agregado através de `Produto`. Nunca referenciar `OfertaLocal` direto de fora do agregado — sempre via `Produto.ofertas`.

### Repository (interfaces)

Interface no domínio, implementação na infra:

| Interface (domain) | Implementação (infra) |
|---|---|
| `ProdutoRepository` | `ProdutoRepositoryPostgres` |
| `AdministradorRepository` | `AdministradorRepositoryPostgres` |
| `LeadB2BRepository` | `LeadB2BRepositoryPostgres` |

Um repository por aggregate root, não por entidade filha.

### Domain Service
Não há regra de negócio que envolva mais de um aggregate neste sistema. Não aplicável.

### Linguagem ubíqua
Nomear classes e métodos sempre com os termos do domínio: `Produto`, `OfertaLocal`, `LeadB2B`. Evitar `Manager`, `Helper`, `Processor`.

---

## 2. Clean Architecture (camadas)

Mapeamento direto da seção 11 (boundary/control/entity):

```
src/
│
├── domain/                     # Camada mais interna — zero dependências externas
│   ├── entities/
│   │   ├── Produto.ts
│   │   ├── OfertaLocal.ts
│   │   ├── Categoria.ts
│   │   ├── Administrador.ts
│   │   ├── LeadB2B.ts
│   │   └── enums.ts            # StatusProduto, StatusOferta
│   ├── value_objects/
│   │   ├── Preco.ts
│   │   ├── RegiaoAtendimento.ts
│   │   ├── ContatoWhatsApp.ts
│   │   └── UrlExterna.ts
│   └── repositories/           # Interfaces (ports)
│       ├── ProdutoRepository.ts
│       ├── AdministradorRepository.ts
│       └── LeadB2BRepository.ts
│
├── application/                # Use cases — depende só de interfaces do domain
│   ├── use_cases/
│   │   ├── ConfirmarRegiaoUseCase.ts
│   │   ├── GerarLinkWhatsAppUseCase.ts
│   │   ├── CadastrarProdutoUseCase.ts
│   │   ├── AtualizarProdutoUseCase.ts
│   │   ├── AutenticarUseCase.ts
│   │   └── RegistrarLeadUseCase.ts
│   └── services/               # (se houver orquestração entre use cases)
│
├── adapters/                   # Boundary de entrada + implementações de saída
│   ├── controllers/            # Boundary de entrada
│   │   ├── VitrineController.ts
│   │   ├── RegiaoController.ts
│   │   ├── BackofficeController.ts
│   │   └── LeadController.ts
│   └── repositories/           # Implementação concreta dos ports
│       ├── ProdutoRepositoryPostgres.ts
│       ├── AdministradorRepositoryPostgres.ts
│       └── LeadB2BRepositoryPostgres.ts
│
├── infra/                      # Config, ORM, conexão banco
│   ├── database/
│   │   ├── connection.ts
│   │   └── migrations/
│   └── config/
│       └── env.ts
│
└── framework/                  # Framework web (FastAPI/Next.js)
    └── routes/
```

### Regra de dependência
**Camada externa depende da interna, nunca o contrário.**
- `domain/` não importa nada
- `application/` importa só `domain/`
- `adapters/` importa `application/` e `domain/`
- `infra/` importa `adapters/` e `domain/`

Se importar ORM dentro de `use_case/` ou `entity/` → violação.

---

## 3. TDD (Test-Driven Development)

### Ciclo: Red → Green → Refactor

Implementar cada caso de uso seguindo esta pirâmide:

```
          ╱╲
         ╱e2e╲        Pouquíssimos
        ╱──────╲
       ╱integração╲   Poucos (repository real, controller HTTP)
      ╱──────────────╲
     ╱    unidade     ║ Muitos (entidade, value object, use case)
    ╱────────────────╲
```

### Plano de testes por caso de uso

| RF | Caso de uso | Camada de teste | Descrição do teste |
|---|---|---|---|
| RF01 | UC01 - Visualizar vitrine | Integração | GET /produtos retorna lista de produtos com status Ativo |
| RF02 | UC02 - Confirmar região | Unidade | `ConfirmarRegiaoUseCase` aceita região da lista e rejeita região fora da lista |
| RF03 | UC03 - WhatsApp | Unidade | `GerarLinkWhatsAppUseCase` gera URL com mensagem pré-formatada correta |
| RF04 | UC04 - Links externos | Unidade | Configuração de links externos é carregada corretamente |
| RF05 | UC05 - Catálogo PDF | Integração | Rota /catalogo retorna PDF válido |
| RF06 | UC06 - Captação B2B | Unidade + Integração | `RegistrarLeadUseCase` cria lead; POST /b2b/interesse retorna 201 |
| RF07 | UC07 - Gerenciar produto | Unidade + Integração | `CadastrarProdutoUseCase` cria produto; produto é salvo no banco com status Rascunho |
| RF08 | UC08 - Autenticar | Unidade + Integração | `AutenticarUseCase` valida credenciais; retorna erro com credenciais inválidas |
| RF09 | Publicar/ocultar produto | Unidade | `Produto.publicar()` muda status para Ativo; `Produto.ocultar()` muda para Oculto |
| RF10 | Autenticação admin | Integração | Rota /admin/* retorna 401 sem token válido |

### Ordem de implementação (de dentro pra fora)
1. **Domain** — Value Objects (`Preco`, `RegiaoAtendimento`), entidades (`Produto`, `OfertaLocal`) e suas validações
2. **Application** — Use cases com fake/in-memory repository (mockar só repository/externo, nunca entidade de domínio)
3. **Adapters** — Controllers HTTP e repositories reais contra banco
4. **Infra** — Migrations, config de banco

### Exemplo de teste de domínio
```typescript
// domain/entities/Produto.test.ts
it('deve mudar status para Ativo ao publicar', () => {
  const produto = Produto.criar({ nome: 'Sérum', preco: Preco.novo(149.90) })
  expect(produto.status).toBe(StatusProduto.Rascunho)
  produto.publicar()
  expect(produto.status).toBe(StatusProduto.Ativo)
})

it('não deve publicar produto descontinuado', () => {
  const produto = Produto.criar({ nome: 'Sérum', preco: Preco.novo(149.90) })
  produto.desativar()
  expect(() => produto.publicar()).toThrow('Produto descontinuado')
})
```

### Exemplo de teste de use case
```typescript
// application/use_cases/ConfirmarRegiaoUseCase.test.ts
it('deve liberar WhatsApp se região for válida', async () => {
  const repo = new FakeProdutoRepository() // in-memory
  const useCase = new ConfirmarRegiaoUseCase(repo)
  const resultado = await useCase.execute({ regiao: 'Cascavel/PR' })
  expect(resultado.liberado).toBe(true)
})

it('deve bloquear WhatsApp se região for inválida', async () => {
  const repo = new FakeProdutoRepository()
  const useCase = new ConfirmarRegiaoUseCase(repo)
  const resultado = await useCase.execute({ regiao: 'São Paulo/SP' })
  expect(resultado.liberado).toBe(false)
})
```

### Rastreabilidade RF → Caso de uso → Teste
Cada RF da tabela de requisitos (seção 2) deve ter pelo menos um teste de aceitação que comprove o comportamento descrito no requisito. Cada teste deve referenciar o RF de origem no nome ou em anotação.