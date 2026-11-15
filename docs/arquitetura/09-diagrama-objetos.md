# Diagrama de Objetos

Este diagrama exemplifica um cenário real de execução do sistema atual, ilustrando instâncias em memória e persistidas para validar as cardinalidades do Diagrama de Classes (`04-diagrama-classes.md`).

## Cenário: Compra Local com Sacola e Categoria + Destaque da Matriz
Neste cenário, uma categoria agrupa um produto físico em estoque local, referenciado por um item na sacola do cliente para entrega em "Valparaíso de Goiás", coexistindo com um destaque da loja matriz.

```mermaid
classDiagram
    class catOleos {
        <<instance>>
        id = "a12bc34d-56ef-78gh-90ij-12kl34mn56op"
        nome = "Óleos Essenciais"
    }

    class prodLavanda {
        <<instance>>
        id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        nome = "Óleo Essencial de Lavanda 10ml"
        preco = "R$ 49,90"
        quantidadeEstoque = 8
        ativo = true
    }

    class itemSacola1 {
        <<instance>>
        quantidade = 2
        subtotal = "R$ 99,80"
    }

    class regiaoValparaiso {
        <<instance>>
        descricao = "Valparaíso de Goiás e DF/Entorno"
    }

    class destaqueMatriz1 {
        <<instance>>
        id = "c33de12a-91bc-4012-88aa-77bc99001122"
        nome = "Kit Spa Terapêutico"
        preco = "R$ 189,00"
        urlAfiliada = "https://atlanticanaturalbr.com.br/kit-spa?aff=padrao"
        ativo = true
    }

    catOleos --> prodLavanda
    itemSacola1 --> prodLavanda
```
