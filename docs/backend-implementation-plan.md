# Plano de Implementação: Backend - Vitrine Virtual

Este documento detalha o passo a passo para a construção do backend do Hub Híbrido de Curadoria, seguindo as definições estabelecidas na Arquitetura e Especificações Técnicas.

## Stack Tecnológico Definido
- **Linguagem:** Python
- **Framework Web:** FastAPI
- **Banco de Dados:** PostgreSQL
- **ORM:** SQLAlchemy (ou SQLModel)
- **Migrações:** Alembic
- **Validação de Dados:** Pydantic
- **Autenticação:** JWT (JSON Web Tokens)
- **Testes:** Pytest

---

## Fase 1: Setup e Configuração da Infraestrutura Inicial

**Objetivo:** Preparar o terreno, configurar o ambiente de desenvolvimento e conectar ao banco de dados.

1. **Configuração do Ambiente Virtual:**
   - Inicializar ambiente Python (ex: `python -m venv venv`).
   - Instalar dependências (`fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `alembic`, `pydantic`, `pydantic-settings`, `python-jose[cryptography]`, `passlib[bcrypt]`, `pytest`).
   - Criar `requirements.txt` / `pyproject.toml`.
2. **Estrutura de Pastas:**
   - Criar estrutura seguindo Clean Architecture/Repository Pattern dentro de `backend/src/` (ex: `api/`, `core/`, `models/`, `schemas/`, `repositories/`, `services/`).
3. **Configuração de Variáveis de Ambiente:**
   - Configurar o Pydantic Settings para ler o arquivo `.env` com a URL do banco, segredos do JWT, etc.
4. **Setup do PostgreSQL e SQLAlchemy:**
   - Criar o motor de banco de dados (`engine`) e o `SessionLocal`.
5. **Configuração do Alembic:**
   - Inicializar o Alembic (`alembic init alembic`).
   - Configurar `alembic.ini` e `env.py` para apontar para a base do SQLAlchemy e rastrear as models.

---

## Fase 2: Modelagem de Dados (ORM)

**Objetivo:** Criar as entidades no código que refletem o Diagrama de Entidade-Relacionamento e aplicar no banco.

1. **Modelo `Categoria`:**
   - Campos: `id` (UUID), `nome` (String).
2. **Modelo `Produto`:**
   - Campos: `id` (UUID), `categoria_id` (UUID - FK), `nome` (String), `preco` (Decimal/Float), `quantidade_estoque` (Integer), `imagem_url` (String), `ativo` (Boolean).
3. **Relacionamento:** 
   - Estabelecer a relação bidirecional entre `Categoria` e `Produto`.
4. **Migrações (Alembic):**
   - Gerar a primeira migration: `alembic revision --autogenerate -m "create_initial_tables"`.
   - Aplicar ao banco de dados: `alembic upgrade head`.

---

## Fase 3: Autenticação e Segurança (JWT)

**Objetivo:** Proteger as rotas administrativas e garantir que apenas o administrador possa gerir os produtos.

1. **Utilitários de Hashing:**
   - Usar `passlib` (bcrypt) para encriptação e verificação de senhas.
2. **Geração de Tokens JWT:**
   - Função para criar um token de acesso com tempo de expiração utilizando `python-jose`.
3. **Endpoint de Login:**
   - Criar a rota `POST /admin/login` recebendo usuário/senha e retornando o JWT.
   *(Nota: O admin pode ser inserido via seed script ou variável de ambiente, já que é uma aplicação focada numa única revendedora).*
4. **Dependência de Segurança (Depends):**
   - Criar função `get_current_user` usando `Depends(OAuth2PasswordBearer)` para validar o token nas rotas privadas.

---

## Fase 4: Schemas (Pydantic DTOs) e Repositórios

**Objetivo:** Validar os dados de entrada e saída (DTOs) e centralizar a lógica de manipulação do banco.

1. **Schemas para Categoria:**
   - `CategoriaCreate`, `CategoriaUpdate`, `CategoriaResponse`.
2. **Schemas para Produto:**
   - `ProdutoCreate`, `ProdutoUpdate`, `ProdutoResponse`.
3. **Repositórios (Padrão Repository):**
   - Criar funções CRUD isoladas da camada HTTP:
     - `get_produto(db, id)`, `get_produtos_ativos(db)`, `create_produto(db, produto)`, etc.
     - Funções equivalentes para Categorias.

---

## Fase 5: Desenvolvimento das Rotas (API REST)

**Objetivo:** Expor os recursos via HTTP.

1. **Rotas Públicas (Sem necessidade de token):**
   - `GET /produtos` (lista catálogo de produtos ativos).
   - `GET /produtos/{id}` (detalhes de um produto específico).
   - `GET /ofertas-locais` (lista itens onde `ativo=True` e `quantidade_estoque > 0`).
   - `GET /categorias` (lista categorias para os filtros do frontend).
   - *Rotas Complementares:* `GET /vitrine`, `GET /catalogo`, `GET /links-externos` (podem ser endpoints de configuração ou retornar JSON estático se o negócio ditar).
2. **Rotas Privadas Admin (Protegidas pelo Depend do JWT):**
   - `POST /admin/produtos` (criar novo produto).
   - `PUT /admin/produtos/{id}` (atualizar produto).
   - `DELETE /admin/produtos/{id}` (remoção lógica alterando `ativo=False` ou exclusão física).
   - Equivalentes para gestão de `/admin/categorias`.

---

## Fase 6: Integração e Configurações de API

**Objetivo:** Preparar a API para consumo pelo frontend.

1. **Configuração de CORS:**
   - Adicionar o middleware `CORSMiddleware` no `main.py` para permitir requisições do frontend (Next.js), configurando as origens permitidas.
2. **Documentação Swagger:**
   - Enriquecer a documentação automática interativa gerada pelo FastAPI incluindo descrições nas rotas, tags para organizar (Público vs Admin), e exemplos nos Schemas Pydantic.

---

## Fase 7: Testes (Pytest)

**Objetivo:** Garantir a qualidade e estabilidade do código.

1. **Setup de Testes:**
   - Configurar o `pytest.ini`.
   - Criar um banco de dados temporário ou usar SQLite em memória apenas para testes.
   - Criar fixtures no `conftest.py` para injetar cliente HTTP (`TestClient`) e sessões de banco.
2. **Testes Unitários:**
   - Testar a lógica de geração de tokens JWT e hashing.
   - Testar as regras dos Repositórios (se inserem e buscam corretamente no banco).
3. **Testes de Integração:**
   - Testar os endpoints públicos (verificar retornos 200 e validação de schema).
   - Testar bloqueio de rotas administrativas (verificar erro 401 sem token).
   - Testar o fluxo CRUD completo via endpoints usando um token de teste.