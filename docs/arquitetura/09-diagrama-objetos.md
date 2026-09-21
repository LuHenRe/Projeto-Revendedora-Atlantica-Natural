# Diagrama de Objetos

Este diagrama exemplifica um cenário real de execução, ilustrando as entidades e seus valores em um momento específico para validar as cardinalidades definidas no diagrama de classes.

## Cenário: Produto com Oferta Local
Neste cenário, temos um produto associado a uma categoria e uma oferta local que define sua disponibilidade para a região de "São Paulo - SP".

```mermaid
classDiagram
    class produtoPerfume {
        <<instance>>
        id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        nome = "Perfume Atlântica"
        preco = 159.90
        quantidadeEstoque = 10
        imagemUrl = "http://exemplo.com/img.jpg"
        ativo = true
    }
    class categoriaBeleza {
        <<instance>>
        id = "a12bc34d-56ef-78gh-90ij-12kl34mn56op"
        nome = "Beleza e Perfumaria"
    }
    class ofertaSP {
        <<instance>>
        id = "b98cd76e-54fa-32bc-10de-98fe76dc54ba"
        produtoId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        regiaoAtendimento = "São Paulo - SP"
        disponivel = true
        estoqueDisponivel = 10
    }

    categoriaBeleza --> produtoPerfume
    produtoPerfume "1" --> "1" ofertaSP
```
