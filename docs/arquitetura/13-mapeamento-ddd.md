# Mapeamento DDD (Domain-Driven Design)

Este documento define os principais conceitos de DDD (Domain-Driven Design) aplicados ao projeto da Vitrine Virtual.

## Aggregates e Entidades

| Aggregate Root | Entidades Internas | Value Objects | Repository Interface |
|----------------|--------------------|---------------|----------------------|
| `Produto` | `OfertaLocal` | `Preco`, `RegiaoAtendimento` | `ProdutoRepository` |
| `Categoria` | - | - | `CategoriaRepository` |
| `Administrador`| - | - | `AdminRepository` |

## Detalhamento

- **Produto (Aggregate Root):** Centraliza as informações do item à venda. A `OfertaLocal` é gerenciada a partir dele.
- **Value Objects:** 
  - `Preco`: Garante que não haverá valores negativos e centraliza regras de formatação monetária.
  - `RegiaoAtendimento`: Representa a cidade/estado atendida, encapsulando a regra de negócio de validação de área (trava geográfica).
  - `ContatoWhatsApp`: Valida o formato numérico e DDI/DDD.
