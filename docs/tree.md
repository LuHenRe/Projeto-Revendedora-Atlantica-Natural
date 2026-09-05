# Estrutura de Diretórios e Documentação do Projeto

A estrutura abaixo organiza o projeto em três camadas principais: documentação, backend e frontend. O objetivo é manter o escopo de produto, requisitos, arquitetura e implementação em alinhamento constante.

```text
projeto-revendedora-atlantica-natural/
├── README.md                                     # Visão geral do projeto e mapa documental
├── docs/                                         # Documentação de produto, arquitetura e backlog
│   ├── ideacao.md                                # Visão de produto, proposta de valor e UX
│   ├── especificacoes_tecnicas.md                # Regras de negócio, arquitetura e modelagem
│   ├── tree.md                                   # Estrutura organizada do repositório
│   ├── proposta.md                               # Proposta comercial e escopo do projeto
│   ├── arquitetura/                              # Documentos de arquitetura
│   │   ├── 01-visao-produto.md                   # Visão geral e objetivos do produto
│   │   ├── 02-requisitos-vitrine.md             # Requisitos específicos da vitrine
│   │   ├── 03-casos-de-uso.md                   # Casos de uso e atores
│   │   ├── 04-diagrama-classes.md               # Diagramas de classes do domínio
│   │   ├── 05-diagrama-er.md                    # Modelo de dados e entidades
│   │   ├── 06-diagrama-sequencia.md             # Fluxos de interação e conversão
│   │   ├── 07-diagrama-componentes.md           # Componentes e dependências de sistema
│   │   └── 08-decisao-arquitetura.md            # Decisões de arquitetura e trade-offs
│   ├── requisitos/                               # Requisitos funcionais e não funcionais
│   │   ├── requisitos-funcionais.md             # RFs do sistema
│   │   └── requisitos-nao-funcionais.md         # RNFs da solução
│   └── backlog/                                  # Planejamento do produto e execução
│       └── backlog-vitrine.md                   # Priorização por MVP e evolução
├── backend/                                      # Aplicação de API e regras de negócio
│   ├── src/
│   │   ├── core/                                 # Configuração global, segurança e banco
│   │   │   ├── config.py                         # Variáveis de ambiente
│   │   │   ├── database.py                       # Sessão do PostgreSQL
│   │   │   └── security.py                       # JWT e hash de senha
│   │   ├── modules/                              # Contextos delimitados (DDD)
│   │   │   ├── catalog/
│   │   │   ├── vitrine/
│   │   │   ├── conversion/
│   │   │   ├── b2b/
│   │   │   └── admin/
│   │   └── main.py                               # Ponto de entrada da API
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── alembic/
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── pytest.ini
├── frontend/                                     # Aplicação web da vitrine e painel admin
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── (admin)/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── lib/
│   ├── tests/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
├── .gitignore
├── .env.example
└── .vscode/
```

## Observações de organização
- A pasta docs concentra o produto, o escopo e a arquitetura de decisão.
- O backend é responsável pela gestão do estoque local, segurança e dados administrativos.
- O frontend cuida da experiência pública, dos blocos da vitrine e do painel de administração.
- A separação entre dados locais, links externos e funil B2B é um princípio da arquitetura.

## Documento de referência
Para uma leitura completa do projeto, recomenda-se seguir esta ordem:
1. [README.md](README.md)
2. [docs/ideacao.md](docs/ideacao.md)
3. [docs/especificacoes_tecnicas.md](docs/especificacoes_tecnicas.md)
4. [docs/requisitos](docs/requisitos)
5. [docs/arquitetura](docs/arquitetura)
6. [docs/backlog](docs/backlog)
