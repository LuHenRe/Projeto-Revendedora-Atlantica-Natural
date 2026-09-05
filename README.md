# Vitrine Virtual - Atlântica Natural

## Resumo Executivo
Este projeto consiste na criação de uma vitrine virtual para uma revendedora parceira de uma marca de cosméticos e bem-estar. A solução foi desenhada para centralizar as principais formas de conversão em uma experiência mobile-first, clara, rápida e orientada ao cliente.

O produto é organizado como um Hub Híbrido de Curadoria, combinando:
- venda de produtos físicos com entrega imediata;
- redirecionamento para compras online por links externos;
- catálogo digital em PDF;
- captação de novas parceiras por meio de um funil B2B separado.

## Objetivo do Projeto
O objetivo principal é profissionalizar a presença digital da revendedora, reduzir atrito na jornada de compra e aumentar a conversão sem depender de um e-commerce completo. A solução atua como uma vitrine de curadoria e conversão, conectando o cliente ao canal mais adequado conforme sua intenção.

## Escopo Principal
### 1. Venda física e pronta-entrega
- catálogo local com itens ativos e disponíveis;
- validação de região antes do envio para o WhatsApp;
- uso do WhatsApp como canal de fechamento comercial.

### 2. Venda online por links externos
- redirecionamento para categorias ou produtos da matriz;
- bypass do menu tradicional da loja oficial;
- encurtamento do caminho até a compra.

### 3. Catálogo digital em PDF
- acesso ao material em formato PDF ou visualizador web;
- experiência complementar à jornada de conversão;
- navegação simples e adaptada ao mobile.

### 4. Captação B2B
- CTA isolado para recrutar novas parceiras;
- fluxo separado da jornada B2C;
- foco em expansão comercial e relacionamento estratégico.

## Nomenclatura adotada
- O projeto é chamado de Vitrine Virtual.
- O modelo estratégico por trás da solução é o Hub Híbrido de Curadoria.
- O fluxo de consumo final é B2C.
- O fluxo de captação de parceiros é B2B.

Essa padronização evita ambiguidade entre produto, estratégia de negócio e jornada de usuário.

## Arquitetura Geral
O sistema foi estruturado em duas frentes principais:

### Frontend
- Next.js + React + TypeScript
- UX mobile-first
- componentes modulares para vitrine, catálogo, links e CTA de parceiros
- regra de trava geográfica tratada no frontend para evitar requisições desnecessárias

### Backend
- FastAPI + Python
- PostgreSQL
- gestão de estoque físico, categorias, conteúdo da vitrine e operações administrativas
- autenticação via JWT para áreas restritas

## Estrutura da documentação
```text
projeto-revendedora-atlantica-natural/
├── README.md
├── docs/
│   ├── ideacao.md
│   ├── especificacoes_tecnicas.md
│   ├── tree.md
│   ├── proposta.md
│   ├── arquitetura/
│   │   ├── 01-visao-produto.md
│   │   ├── 02-requisitos-vitrine.md
│   │   ├── 03-casos-de-uso.md
│   │   ├── 04-diagrama-classes.md
│   │   ├── 05-diagrama-er.md
│   │   ├── 06-diagrama-sequencia.md
│   │   ├── 07-diagrama-componentes.md
│   │   └── 08-decisao-arquitetura.md
│   ├── requisitos/
│   │   ├── requisitos-funcionais.md
│   │   └── requisitos-nao-funcionais.md
│   └── backlog/
│       └── backlog-vitrine.md
├── backend/
│   ├── src/
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── pytest.ini
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
├── .gitignore
└── .env.example
```

## Fora de escopo
O projeto não inclui:
- checkout nativo e gateway de pagamento;
- gestão logística e cálculo de frete;
- ERP/WMS ou emissão fiscal;
- conta de cliente final e cadastro B2C completo;
- aplicativo nativo mobile;
- tráfego pago ou gestão de anúncios.

## Resultado esperado
A solução deve entregar uma vitrine mais profissional, mais rápida, mais clara e mais eficiente em conversão, transformando a presença digital da revendedora em uma ferramenta de venda, relacionamento e expansão comercial.

## Referências documentais
- [docs/ideacao.md](docs/ideacao.md)
- [docs/especificacoes_tecnicas.md](docs/especificacoes_tecnicas.md)
- [docs/tree.md](docs/tree.md)
- [docs/proposta.md](docs/proposta.md)
- [docs/arquitetura](docs/arquitetura)
- [docs/requisitos](docs/requisitos)
- [docs/backlog](docs/backlog)
