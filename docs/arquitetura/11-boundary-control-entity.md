# Boundary-Control-Entity

Mapeamento dos componentes implementados nos três estereótipos de análise:

- **Boundary (Fronteira)** → Páginas e componentes de UI (`Next.js` / `React`) e endpoints REST (`FastAPI`)
- **Control (Controle)** → Casos de uso (`Application/Use Cases`) e hooks/contextos de orquestração
- **Entity (Entidade)** → Entidades e *Value Objects* do domínio (`Domain`)

---

## Diagrama de Robustez — Compra Local com Trava Geográfica e Sacola

```mermaid
flowchart LR
    Ator((Cliente Final))
    B1[Vitrine / CardProduto «boundary»]
    B2[BarraSacolaFlutuante «boundary»]
    B3[ModalTravaGeografica «boundary»]
    C1[ValidarRegiaoAtendimentoUseCase «control»]
    C2[GerarMensagemWhatsAppUseCase «control»]
    E1[Produto «entity»]
    E2[ItemSacola «entity»]
    E3[RegiaoAtendimento «value object»]
    E4[ContatoWhatsApp «value object»]

    Ator --> B1
    Ator --> B2
    B1 --> B3
    B2 --> B3
    B3 --> C1
    C1 --> E3
    B1 --> C2
    B2 --> E2
    E2 --> E1
    C2 --> E4
```

---

## Diagrama de Robustez — Backoffice (Estoque Local e Matriz)

```mermaid
flowchart LR
    Ator((Administradora))
    B1[AdminLoginPage «boundary»]
    B2[GerenciadorProdutos / Matriz «boundary»]
    C1[AutenticarAdministradorUseCase «control»]
    C2[CriarProdutoUseCase «control»]
    C3[AdicionarProdutoMatrizUseCase «control»]
    E1[Produto «entity»]
    E2[Categoria «entity»]
    E3[ProdutoMatriz «entity»]

    Ator --> B1
    B1 --> C1
    Ator --> B2
    B2 --> C2
    C2 --> E1
    C2 --> E2
    B2 --> C3
    C3 --> E3
```

---

## Tabela de Mapeamento BCE por Caso de Uso

| Caso de Uso | Boundary | Control | Entities / VOs envolvidos |
|---|---|---|---|
| `UC01` Comprar Produto Pronta-Entrega Local | `CardProduto`, `BarraSacolaFlutuante`, `ModalTravaGeografica` | `VitrineContext`, `ValidarRegiaoAtendimentoUseCase`, `GerarMensagemWhatsAppUseCase` | `Produto`, `ItemSacola`, `RegiaoAtendimento`, `ContatoWhatsApp` |
| `UC05` Consultar Catálogo e Buscar Produtos | `BlocoEstoqueLocal`, `CatalogoInterativo` | `ListarVitrineProdutos` / `ProdutoRepositoryHttp` | `Produto`, `Categoria` |
| `UC06` Navegar por Destaques da Matriz | `BlocoDeepLinks`, `CardProdutoMatriz` | `ProdutoMatrizRepositoryHttp` | `ProdutoMatriz`, `UrlExterna`, `Preco` |
| `UC07` Visualizar / Baixar Catálogo PDF | `BlocoCatalogoPDF`, `CatalogoPage` | — (navegação direta) | — |
| `UC08` Acessar Captação B2B | `BlocoB2B` | — (redirecionamento WhatsApp) | — |
| `UC09` Autenticar no Backoffice | `AdminLoginPage`, `POST /admin/login` | `AutenticarAdministradorUseCase` | Token JWT |
| `UC10` Gerenciar Produtos do Estoque Local | `GerenciadorProdutos`, `/admin/produtos` | `CriarProdutoUseCase`, `InativarProdutoLocal` | `Produto`, `Categoria`, `Preco` |
| `UC11` Gerenciar Categorias | `GerenciadorCategorias`, `/admin/categorias` | `categoriaActions` / `CategoriaRepositoryDB` | `Categoria` |
| `UC12` Curar Destaques da Matriz | `GerenciadorProdutosMatriz`, `/admin/produtos-matriz` | `AdicionarProdutoMatrizUseCase`, `AtlanticaScraper` | `ProdutoMatriz`, `UrlExterna`, `Preco` |
