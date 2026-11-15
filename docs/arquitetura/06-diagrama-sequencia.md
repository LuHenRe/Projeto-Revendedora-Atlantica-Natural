# Diagrama de Sequência

## Fluxo Principal (Selecionado para Modelagem Comportamental): Compra Local com Trava Geográfica e Sacola

**Justificativa da escolha:** É o fluxo não trivial mais representativo da arquitetura do sistema, conectando renderização SSR (`Next.js`), API REST (`FastAPI`), banco relacional (`PostgreSQL`), gerenciamento de estado da sacola em domínio frontend (`ItemSacola`), validação da trava geográfica com persistência em navegador (`ModalTravaGeografica` + `RegiaoAtendimento` + `localStorage`) e integração externa com o WhatsApp ou site oficial da matriz.

```mermaid
sequenceDiagram
    actor Cliente
    participant Vitrine as Frontend (Next.js)
    participant API as Backend (FastAPI)
    participant DB as Banco (PostgreSQL)
    participant Modal as ModalTravaGeografica
    participant Storage as LocalStorage
    participant WhatsApp as WhatsApp / Matriz

    Cliente->>Vitrine: Acessa a vitrine (/)
    Vitrine->>API: GET /produtos/ofertas-locais, /categorias/, /produtos-matriz/
    API->>DB: Consulta produtos ativos em estoque, categorias e destaques
    DB-->>API: Registros persistidos
    API-->>Vitrine: Catálogo inicial (SSR/ISR)
    Vitrine-->>Cliente: Exibe vitrine de pronta-entrega

    opt Cliente utiliza a Sacola de Pedidos
        Cliente->>Vitrine: Adiciona produto(s) e ajusta quantidades
        Vitrine->>Vitrine: Instancia ItemSacola e calcula valorTotal
    end

    Cliente->>Vitrine: Clica em "Pedir no WhatsApp" ou "Fechar Pedido"
    Vitrine->>Storage: Consulta região confirmada
    Storage-->>Vitrine: Cidade salva ou null

    alt Cidade ainda não confirmada
        Vitrine->>Modal: Abre modal ("Qual é a sua cidade?")
        Cliente->>Modal: Digita a cidade e confirma
        Modal->>Vitrine: Valida via RegiaoAtendimento.isAtendida(cidade)
        alt Região permitida (DF / Entorno)
            Vitrine->>Storage: Salva cidade confirmada
            Vitrine->>Modal: Fecha modal
            Vitrine->>Vitrine: GerarMensagemWhatsAppUseCase (item ou sacola)
            Vitrine->>WhatsApp: Redireciona para wa.me com mensagem pré-formatada
            WhatsApp-->>Cliente: Chat aberto com a revendedora
        else Região fora da cobertura
            Modal-->>Cliente: Exibe bloqueio e link "Comprar no Site Oficial da Matriz"
        end
    else Cidade já confirmada
        Vitrine->>Vitrine: GerarMensagemWhatsAppUseCase (item ou sacola)
        Vitrine->>WhatsApp: Redireciona para wa.me com mensagem pré-formatada
        WhatsApp-->>Cliente: Chat aberto com a revendedora
    end
```

---

## Fluxo Secundário: Curadoria e Exibição de Produto da Matriz (Web Scraping + Afiliada)

```mermaid
sequenceDiagram
    actor Admin as Administradora
    participant Backoffice as Admin (Next.js)
    participant API as Backend (FastAPI)
    participant Scraper as AtlanticaScraper
    participant DB as Banco (PostgreSQL)

    Admin->>Backoffice: Informa URL do produto da matriz
    Backoffice->>API: POST /admin/produtos-matriz/ (Bearer JWT)
    API->>DB: Verifica se url_origem já existe
    alt URL ainda não cadastrada
        API->>Scraper: fetch_product_data(url_origem)
        Scraper-->>API: Nome, preço, imagem e descrição
        API->>API: Gera url_afiliada (?aff=codigo)
        API->>DB: Salva em produtos_matriz
    end
    API-->>Backoffice: 201 Created (ProdutoMatriz)
```

---

## Fluxo Secundário: Captação B2B

```mermaid
sequenceDiagram
    actor Visitante as Potencial Parceira B2B
    participant Vitrine as Frontend (Next.js)
    participant WhatsApp as WhatsApp (Liderança)

    Visitante->>Vitrine: Acessa bloco "Seja um(a) Revendedor(a)"
    Visitante->>Vitrine: Clica no CTA "Quero Ser um(a) Revendedor(a)"
    Vitrine->>WhatsApp: Abre link externo configurado (NEXT_PUBLIC_LINK_RECRUTAMENTO_B2B)
    WhatsApp-->>Visitante: Inicia atendimento de expansão B2B
```
