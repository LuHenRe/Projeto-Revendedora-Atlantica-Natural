# Estrutura de Camadas (Clean Architecture)

A arquitetura do backend do projeto segue os princípios da Clean Architecture para garantir o isolamento das regras de domínio em relação a frameworks e bancos de dados.

## Camadas (de dentro para fora)

1. **Domain (Entities / Value Objects):**
   - Contém as entidades puras (`Produto`, `Categoria`) e os Value Objects.
   - Não possui nenhuma dependência de bibliotecas externas ou frameworks (ex: sem FastAPI ou SQLAlchemy aqui).
   - Contém as interfaces (ports) dos repositórios (ex: `ProdutoRepositoryInterface`).

2. **Application (Use Cases):**
   - Contém a lógica de orquestração da aplicação, implementando os Casos de Uso (ex: `ListarProdutosVitrineUseCase`, `CadastrarProdutoUseCase`).
   - Depende apenas da camada Domain. Interage com repositórios através de injeção de dependência via suas interfaces.

3. **Interface Adapters (Controllers & Gateways):**
   - **Entrada:** Controllers (FastAPI routes) que recebem a requisição HTTP, validam o payload e chamam o Use Case adequado.
   - **Saída:** Implementações concretas dos repositórios (ex: `ProdutoRepositoryPostgres`) que falam com o banco de dados via ORM.

4. **Frameworks & Drivers (Infrastructure):**
   - Configurações do FastAPI, conexão com o PostgreSQL, middlewares, scripts de migração (Alembic) e dependências externas reais.

## Diretrizes de Código
- Um arquivo da camada `Domain` ou `Application` **NUNCA** pode importar pacotes de `infra` ou `adapters`.
- O ORM (SQLAlchemy) só deve ser utilizado na camada de infraestrutura/adapters.
