# Diagrama de Objetos

Instantâneo (snapshot) do diagrama de classes em tempo de execução, validando as multiplicidades e relações definidas no diagrama de classes.

> **Notação Mermaid:** como o Mermaid não tem diagrama de objetos nativo, usamos `classDiagram` com o estereótipo `<<instance>>` e valores concretos, sem métodos.

## Cenário: cliente confirma região e envia mensagem via WhatsApp

O cliente visualiza um produto de skincare, confirma que sua região está coberta e envia mensagem de interesse via WhatsApp. Este cenário valida as cardinalidades: um produto com uma oferta local, e um link externo de configuração (não persistente).

```mermaid
classDiagram
    class produto_001 {
        <<instance>>
        id = "a1b2c3d4"
        nome = "Sérum Vitamina C"
        preco = Preco(149.90)
        imagemUrl = "/img/serum-vc.jpg"
        status = Ativo
    }

    class categoria_001 {
        <<instance>>
        id = "e5f6a7b8"
        nome = "Skincare"
    }

    class oferta_001 {
        <<instance>>
        id = "c9d0e1f2"
        regiao = RegiaoAtendimento("Cascavel/PR")
        estoqueDisponivel = 5
        disponivel = true
    }

    class oferta_002 {
        <<instance>>
        id = "f3a4b5c6"
        regiao = RegiaoAtendimento("Toledo/PR")
        estoqueDisponivel = 3
        disponivel = true
    }

    class admin_001 {
        <<instance>>
        id = "x7y8z9w0"
        nome = "Maria Silva"
        email = "maria@atlanticanatural.com.br"
    }

    class link_001 {
        <<instance>>
        nome = "Skincare Oficial"
        url = "https://oficial.com/skincare"
        categoria = "skincare"
    }

    class lead_001 {
        <<instance>>
        id = "l1m2n3o4"
        nome = "Ana Souza"
        contato = "ana@email.com"
        interesse = "Revenda"
        dataCadastro = 2026-09-10
    }

    categoria_001 --> produto_001 : agrupa
    produto_001 *-- oferta_001 : compoe
    produto_001 *-- oferta_002 : compoe
    admin_001 --> produto_001 : gerencia
    link_001 ..> produto_001 : referencia externa
    lead_001 ..> admin_001 : contato potencial
```

## Validação de multiplicidades

| Relação do diagrama de classes | Validação neste snapshot | Status |
|---|---|---|
| `Categoria "1" --> "0..* Produto"` | Uma categoria (Skincare) com 1 produto registrado | OK |
| `Produto "1" *-- "1..* OfertaLocal"` | Um produto (Sérum) composto por 2 ofertas locais (Cascavel/Toledo) | OK |
| `Administrador "1" --> "0..* Produto"` | Um admin gerenciando 1 produto | OK |
| `LinkExterno` sem persistência | Configurado como valor externo, não está na tabela de objetos persistentes | OK |
| `LeadB2B` independente | Lead registrado sem vínculo a produto | OK |

## Observação
Este diagrama serve como massa de teste para os testes de aceitação do `RF01` (exibir estoque físico) e `RF07` (gerenciar produto): as instâncias acima descrevem dados que alimentam os cenários de teste de integração.