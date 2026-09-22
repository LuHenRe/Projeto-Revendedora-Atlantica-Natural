# Diagrama de Sequência

## Fluxo principal: compra local via WhatsApp

```mermaid
sequenceDiagram
    actor Cliente
    participant Frontend as Frontend (Next.js)
    participant API as Backend (FastAPI)
    participant DB as Banco (PostgreSQL)
    participant WhatsApp as WhatsApp

    Cliente->>Frontend: Acessa vitrine
    Frontend->>API: GET /produtos
    API->>DB: Consulta estoque físico
    DB-->>API: Lista de produtos ativos
    API-->>Frontend: Produtos disponíveis
    Cliente->>Frontend: Confirma cidade/região
    Frontend->>Frontend: Valida regra de geolocalização
    alt Região permitida
        Frontend-->>Cliente: Habilita botão WhatsApp
        Cliente->>Frontend: Clica em WhatsApp
        Frontend->>WhatsApp: Abre conversa pré-formatada
        WhatsApp-->>Cliente: Chat aberto com a revendedora
    else Região bloqueada
        Frontend-->>Cliente: Exibe mensagem de bloqueio
    end
```

## Fluxo alternativo: deep link de afiliada

```mermaid
sequenceDiagram
    actor Cliente
    participant Frontend as Frontend (Next.js)
    participant Externo as Loja matriz / afiliada

    Cliente->>Frontend: Clica em card de categoria
    Frontend-->>Cliente: Redireciona para URL externa
    Cliente->>Externo: Acessa a página de destino
    Externo-->>Cliente: Exibe oferta e checkout oficial
```

## Fluxo principal: cadastro B2B

```mermaid
sequenceDiagram
    actor Visitante
    participant Frontend as Frontend (Next.js)
    participant API as Backend (FastAPI)
    participant DB as Banco (PostgreSQL)

    Visitante->>Frontend: Acessa CTA de parceria
    Frontend-->>Visitante: Exibe página B2B
    Visitante->>Frontend: Envia interesse
    Frontend->>API: POST /b2b/interesse
    API->>DB: Salva lead
    DB-->>API: Confirma cadastro
    API-->>Frontend: Sucesso
    Frontend-->>Visitante: Mensagem de confirmação
```

## Premissas de comportamento
- a validação geográfica fica no front-end;
- produtos afiliados não são consultados no banco local;
- o backend trata apenas dados locais e administrativos;
- o fluxo B2B é um mero redirecionamento externo;
- o fechamento de venda local ocorre via WhatsApp e não por checkout nativo.
