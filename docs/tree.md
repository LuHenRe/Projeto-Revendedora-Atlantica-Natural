meu-projeto-saude/
│
├── backend/                              # Aplicação Python / FastAPI
│   ├── src/
│   │   ├── core/                         # Configurações globais, DB e Segurança
│   │   │   ├── config.py                 # Variáveis de ambiente
│   │   │   ├── database.py               # Sessão do PostgreSQL
│   │   │   └── security.py               # Lógica de Hash e JWT
│   │   │
│   │   ├── modules/                      # Separação por Contextos Delimitados (DDD)
│   │   │   │
│   │   │   ├── catalog/                  # Contexto de Catálogo
│   │   │   │   ├── domain/               # Entidades Puras e Objetos de Valor
│   │   │   │   │   ├── entities.py
│   │   │   │   │   └── interfaces.py     # Contratos (ex: IProdutoRepository)
│   │   │   │   ├── application/          # Casos de Uso (Business Rules)
│   │   │   │   │   └── use_cases.py
│   │   │   │   ├── infrastructure/       # Implementações técnicas
│   │   │   │   │   ├── orm_models.py     # Tabelas do SQLAlchemy/SQLModel
│   │   │   │   │   └── repositories.py   # Implementação do acesso ao Postgres
│   │   │   │   └── presentation/         # Adaptadores HTTP (FastAPI)
│   │   │   │       ├── controllers.py    # Rotas (Endpoints)
│   │   │   │       └── schemas.py        # DTOs do Pydantic (Entrada/Saída)
│   │   │   │
│   │   │   └── admin/                    # Contexto de Backoffice / Autenticação
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       ├── infrastructure/
│   │   │       └── presentation/
│   │   │
│   │   └── main.py                       # Ponto de entrada (Entrypoint FastAPI)
│   │
│   ├── tests/                            # Testes (TDD)
│   │   ├── unit/                         # Testa 'domain' e 'application' isolados
│   │   └── integration/                  # Testa 'infrastructure' e 'presentation'
│   │
│   ├── alembic/                          # Migrations do banco de dados (se usar SQLAlchemy)
│   ├── requirements.txt                  # Dependências do Python (ou pyproject.toml)
│   └── pytest.ini
│
└── frontend/                             # Aplicação Next.js / React
    ├── src/
    │   ├── app/                          # Next.js App Router (Roteamento visual)
    │   │   ├── (public)/                 # Área Pública (Vitrine)
    │   │   │   ├── page.tsx              # Landing Page principal
    │   │   │   └── produtos/             # Listagem dinâmica
    │   │   │       └── [id]/page.tsx
    │   │   ├── (admin)/                  # Área Privada (Backoffice)
    │   │   │   ├── layout.tsx            # Layout com painel lateral do admin
    │   │   │   ├── dashboard/page.tsx
    │   │   │   └── login/page.tsx
    │   │   └── layout.tsx                # Layout global raiz
    │   │
    │   ├── components/                   # Isolamento Visual (Componentes Burros)
    │   │   ├── ui/                       # Componentes base do shadcn/ui (botões, modais)
    │   │   ├── catalog/                  # Componentes específicos de negócio (ProductCard)
    │   │   └── layout/                   # Header, Footer, Sidebar
    │   │
    │   ├── hooks/                        # Isolamento Lógico (Custom Hooks)
    │   │   ├── useAuth.ts                # Lógica de login e token
    │   │   └── useCatalog.ts             # Fetch e estados de produtos
    │   │
    │   ├── services/                     # Adaptadores para chamadas de Rede
    │   │   ├── api.ts                    # Configuração do Axios ou Fetch API global
    │   │   └── catalogService.ts         # Chamadas para os endpoints do backend
    │   │
    │   ├── types/                        # Tipagem Estrita (Contracts)
    │   │   └── index.ts                  # Interfaces globais do TypeScript (DTOs do Next)
    │   │
    │   └── utils/                        # Funções utilitárias puras
    │       ├── formatCurrency.ts         # Formatação de preços
    │       └── whatsappLink.ts           # Montagem da URL dinâmica do WhatsApp
    │
    ├── tests/                            # Testes Frontend
    │   ├── components/                   # Testes com React Testing Library
    │   └── hooks/
    │
    ├── tailwind.config.ts                # Design System (Cores e Fontes)
    ├── package.json
    └── tsconfig.json
