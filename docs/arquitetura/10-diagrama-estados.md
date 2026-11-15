# Diagrama de Estados

O diagrama de estados detalha o ciclo de vida da entidade `Produto` no estoque físico local, controlada por `ativo` e `quantidade_estoque`.

## Entidade: Produto (Estoque Físico)

```mermaid
stateDiagram-v2
    [*] --> AtivoDisponivel : criar_produto(ativo=true, estoque>0)
    [*] --> AtivoEsgotado : criar_produto(ativo=true, estoque=0)
    [*] --> Inativo : criar_produto(ativo=false)

    AtivoDisponivel --> AtivoEsgotado : atualizar_estoque(0)
    AtivoEsgotado --> AtivoDisponivel : repor_estoque(>0)

    AtivoDisponivel --> Inativo : inativar() / excluir_logicamente()
    AtivoEsgotado --> Inativo : inativar() / excluir_logicamente()
    Inativo --> AtivoDisponivel : ativar() [estoque > 0]
    Inativo --> AtivoEsgotado : ativar() [estoque == 0]
```

> Apenas produtos no estado **AtivoDisponivel** (`ativo = true` e `quantidade_estoque > 0`) são retornados por `GET /produtos/ofertas-locais` na vitrine de pronta-entrega.
