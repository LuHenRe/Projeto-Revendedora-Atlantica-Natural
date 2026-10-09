# Plano de Implementação: Backend - Vitrine Virtual

Este documento detalha o passo a passo para a construção do backend do Hub Híbrido de Curadoria, seguindo as definições estabelecidas na Arquitetura, Especificações Técnicas e os princípios rigorosos da **Clean Architecture**, **Domain-Driven Design (DDD)** e **TDD**.

## Stack Tecnológico Definido
- **Linguagem:** Python >= 3.10
- **Gerenciador de Pacotes:** `pip` via `pyproject.toml`
- **Framework Web:** FastAPI
- **Banco de Dados:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrações:** Alembic
- **Validação de Dados e DTOs:** Pydantic
- **Autenticação:** JWT (JSON Web Tokens)
- **Testes:** Pytest (E2E e Unitários via TDD)

---

## Estrutura do Projeto (Clean Architecture)
A estrutura interna em `backend/src/` foi desenhada para isolar o núcleo do negócio de frameworks externos:
- `domain/`: Entidades puras em Python e Interfaces de Repositório (Regras de negócio isoladas).
- `application/`: Casos de Uso (*Use Cases*) que orquestram as entidades do domínio.
- `infrastructure/`: Adapters externos (Modelos SQLAlchemy, Repositórios de Banco de Dados reais).
- `interfaces/`: Controladores web HTTP (Rotas do FastAPI).

---

## Fase 1: Setup e Configuração da Infraestrutura Inicial

**Objetivo:** Preparar o terreno, configurar o ambiente de desenvolvimento e conectar ao banco de dados.

1. **Configuração do Ambiente Virtual:**
   - Inicializar ambiente Python (ex: `python -m venv venv`).
   - Instalar dependências via arquivo moderno `pyproject.toml` (`pip install -e ".[dev]"`).
2. **Estrutura de Pastas:**
   - Criar estrutura seguindo Clean Architecture: `domain/`, `application/`, `infrastructure/` e `interfaces/`.
3. **Configuração de Variáveis de Ambiente:**
   - Configurar o Pydantic Settings para ler o arquivo `.env` com a URL do banco, segredos do JWT, etc.
4. **Setup do PostgreSQL e SQLAlchemy:**
   - Criar o motor de banco de dados (`engine`) e o `SessionLocal`.
5. **Configuração do Alembic:**
   - Inicializar o Alembic (`alembic init alembic`).
   - Configurar `alembic.ini` e `env.py` para apontar para a base do SQLAlchemy e rastrear os models da infraestrutura.

---

## Fase 2: Domínio e Casos de Uso (DDD & TDD)

**Objetivo:** Definir o núcleo da aplicação guiado por testes (Red-Green-Refactor).

1. **Entidades do Domínio (Domain Entities):**
   - `Categoria`: Validação de nome não nulo.
   - `Produto`: Validações de preço positivo, exclusão lógica (`inativar()`, `ativar()`), checagem de estoque.
2. **Interfaces de Repositório:**
   - Contratos abstratos (`ICategoriaRepository`, `IProdutoRepository`).
3. **Casos de Uso (Application):**
   - Criação de fluxos orquestrados, como o `CriarProdutoUseCase`, que valida a existência da categoria antes de instanciar e salvar o produto.

---

## Fase 3: Infraestrutura de Dados (ORM)

**Objetivo:** Implementar os detalhes técnicos de acesso a banco de dados.

1. **Modelos de Banco (Infrastructure Models):**
   - `CategoriaModel` e `ProdutoModel` (SQLAlchemy).
2. **Repositórios de Banco:**
   - Implementar os repositórios reais mapeando as Entidades puras do Python para os Modelos do ORM e vice-versa (`CategoriaRepositoryDB`, `ProdutoRepositoryDB`).
3. **Migrações (Alembic):**
   - Gerar e aplicar migrations para tabelas no banco de dados.

---

## Fase 4: Autenticação e Segurança (JWT)

**Objetivo:** Proteger as rotas administrativas.

1. **Utilitários de Hashing:**
   - Usar `passlib` (bcrypt) para encriptação e verificação de senhas.
2. **Geração de Tokens JWT:**
   - Função para criar um token de acesso utilizando `python-jose`.
3. **Endpoint de Login:**
   - Rota `POST /admin/login` recebendo usuário/senha (lidos via `.env`) e retornando o JWT.
4. **Dependência de Segurança (Depends):**
   - Função `get_current_user` usando `Depends(OAuth2PasswordBearer)`.

---

## Fase 5: Desenvolvimento das Interfaces REST (FastAPI)

**Objetivo:** Expor os recursos via HTTP delegando o processamento para os Use Cases.

1. **Schemas (Pydantic DTOs):**
   - Definir os DTOs para entrada/saída HTTP (ex: `ProdutoCreate`, `ProdutoResponse`).
2. **Rotas Públicas:**
   - `GET /produtos`, `GET /produtos/{id}`, `GET /produtos/ofertas-locais`, `GET /categorias`.
3. **Rotas Privadas Admin:**
   - `POST`, `PUT`, `DELETE` para gestão de `/admin/produtos` e `/admin/categorias`.

---

## Fase 6: Integração, Documentação e Cors

**Objetivo:** Preparar a API para consumo pelo frontend.

1. **Configuração de CORS:**
   - Adicionar `CORSMiddleware` para permitir acesso de clientes HTTP.
2. **Documentação Swagger:**
   - Tags e resumos (summary) nas rotas e Schema Examples na documentação automática.

---

## Fase 7: Testes (Pytest E2E e Unitários)

**Objetivo:** Garantir a qualidade, resiliência do código e do fluxo HTTP.

1. **Setup de Testes E2E:**
   - Configuração de banco de dados SQLite em memória para testes velozes via `tests/conftest.py`.
2. **Cobertura Implementada:**
   - Unitários: Testes do core de domínio e use cases (com *Fake Repositories*).
   - E2E: Autenticação, CRUD Categoria, CRUD Produto (verificando fluxos como inativação lógica de produtos e visualização pública).

---

## Fase 8: Integração de Destaques da Matriz (Scraping)

**Objetivo:** Permitir exibir produtos da matriz na vitrine sem a necessidade de digitação manual de fotos e nomes, utilizando *Web Scraping* para gerar os deep links.

1. **Scraper (Infraestrutura):**
   - Criação da classe `AtlanticaScraper` (usando `beautifulsoup4` e `httpx`) para extrair Título, Imagem, Preço e Descrição de uma URL oficial da matriz.
2. **Entidades e Repositórios:**
   - Modelagem de `ProdutoMatriz` e `ProdutoMatrizModel` em uma tabela PostgreSQL separada para cache (não afeta o estoque local).
3. **Casos de Uso e Endpoints:**
   - Rota admin (`POST /admin/produtos-matriz`) que processa a URL original, faz o scraping, adiciona o código de rastreamento do afiliado e salva no cache.
   - Rota pública (`GET /produtos-matriz`) super rápida para o Frontend renderizar a vitrine.
4. **Dependências Extras:**
   - Adicionado `beautifulsoup4` e `lxml` ao pacote do projeto.
