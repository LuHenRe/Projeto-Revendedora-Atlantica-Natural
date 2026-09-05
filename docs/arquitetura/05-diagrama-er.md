# Diagrama Entidade-Relacionamento (MER)

## Entidades persistentes
- `categorias`
- `produtos`
- `ofertas_locais`
- `administradores`
- `leads_b2b`

## Relacionamentos
- uma categoria pode ter muitos produtos;
- um produto pode ter várias ofertas locais;
- um administrador pode gerenciar vários produtos;
- um lead B2B é um registro independente e não depende de produtos físicos.

## Observações
- o banco guarda somente o estoque físico e os dados operacionais do negócio;
- links de afiliada não fazem parte do MER principal;
- a região geográfica da venda fica como regra de interface e configuração operacional, e não como entidade central de produto.

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUTOS : contem
    PRODUTOS ||--o{ OFERTAS_LOCAIS : possui
    ADMINISTRADORES ||--o{ PRODUTOS : gerencia

    CATEGORIAS {
        uuid id PK
        varchar nome
    }

    PRODUTOS {
        uuid id PK
        uuid categoria_id FK
        varchar nome
        decimal preco
        integer quantidade_estoque
        varchar imagem_url
        boolean ativo
    }

    OFERTAS_LOCAIS {
        uuid id PK
        uuid produto_id FK
        varchar regiao_atendimento
        boolean disponivel
        integer estoque_disponivel
    }

    ADMINISTRADORES {
        uuid id PK
        varchar nome
        varchar email
        varchar senha_hash
    }

    LEADS_B2B {
        uuid id PK
        varchar nome
        varchar contato
        varchar interesse
        timestamp data_cadastro
    }
```
