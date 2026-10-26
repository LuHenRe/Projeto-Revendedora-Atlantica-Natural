# Roteiro Prático: Criação de Backend com IA para Prova de Programação Web

Este guia foi elaborado para orientar o desenvolvimento completo e ágil de um backend profissional durante a **prova prática de Programação Web**, utilizando **Clean Architecture**, **FastAPI**, **SQLAlchemy**, **Alembic** e assistência de **IA**.

---

## 🎯 1. Visão Geral & Regra de Ouro da Prova

> **A Regra de Ouro ao Usar IA:**  
> **Nunca peça o projeto inteiro de uma só vez para a IA.** Isso gera alucinações, arquivos misturados, acoplamento de camadas e erros difíceis de depurar sob a pressão do tempo.  
> Desenvolva **de dentro para fora** (*Clean Architecture*), validando cada camada antes de avançar para a próxima:
> 
> $$\text{Domínio Rico} \longrightarrow \text{Casos de Uso} \longrightarrow \text{Infraestrutura/Banco} \longrightarrow \text{Autenticação} \longrightarrow \text{Rotas/Swagger} \longrightarrow \text{Testes}$$

---

## 🏗️ 2. Partes Essenciais do Backend (Critérios de Avaliação)

Baseado no roteiro de arquitetura e boas práticas exigidas na avaliação:

| Camada / Pilar | Localização no Repositório | Responsabilidade Principal |
| :--- | :--- | :--- |
| **Estrutura & Dependências** | `src/`, `tests/`, `pyproject.toml`, `.env` | Separação rigorosa entre código de produção e testes; gerenciamento moderno de dependências (PEP 621). |
| **Domínio Rico** | `src/domain/entities/` | Entidades com regras de negócio encapsuladas e auto-validação (evitando o modelo anêmico). Zero dependências de frameworks. |
| **Contratos de Repositório** | `src/domain/repositories/` | Interfaces abstratas (`ABC` / `Protocol`) para inversão de dependência. |
| **Casos de Uso (Application)** | `src/application/use_cases/` | Orquestração da lógica da aplicação e fluxo de dados. Dependem apenas das abstrações de domínio. |
| **Banco & Migrações** | `src/infrastructure/database/`, `alembic/` | Modelos ORM do SQLAlchemy, implementação concreta dos repositórios e versionamento do esquema com Alembic. |
| **Segurança & Acesso** | `src/core/security.py`, `src/api/deps.py` | Hashing unidirecional de senhas (`bcrypt`/`passlib`), geração e validação de tokens JWT (`python-jose`), proteção de rotas via `Depends`. |
| **Rotas REST & Swagger** | `src/schemas/`, `src/api/` | Validação de payloads via Pydantic (DTOs) e documentação OpenAPI interativa em `/docs`. |
| **Qualidade & Testes (80%+)** | `tests/unit/`, `tests/integration/` | Testes unitários com repositórios em memória + testes de integração com `TestClient` e SQLite temporário. |
| **Docker & Execução** | `Dockerfile`, `docker-compose.yml` | Orquestração do backend e do banco relacional (ex.: PostgreSQL). |

---

## ⏱️ 3. Roteiro Passo a Passo na Prova (Fluxo Cronológico)

### Passo 0: Interpretação do Cenário e Diagramas (5 a 10 min)
1. **Analise o Estudo de Caso / Diagrama de Classes / MER:**
   - Quais são as entidades principais? (Ex.: `Usuario`, `Produto`, `Pedido`).
   - Quais campos são obrigatórios? Quais são as chaves e relacionamentos (1:N, N:N)?
2. **Extraia as Regras de Negócio Inegociáveis:**
   - Ex.: *"O estoque não pode ser negativo"*, *"Email deve ser único"*, *"Apenas administradores alteram status"*.
3. **Mapeie os Casos de Uso:**
   - Ex.: `CadastrarUsuario`, `AutenticarUsuario`, `CriarPedido`, `ListarProdutos`.

---

### Passo 1: Domínio Rico (`src/domain/`)
> ⚠️ **Atenção:** Nenhum arquivo desta camada deve importar FastAPI, SQLAlchemy ou Pydantic!

1. **Entidades (`src/domain/entities/`):**
   - Implemente classes puras em Python com dataclasses.
   - Coloque validações de invariantes no construtor ou `__post_init__` (lançando `ValueError`).
   - Adicione métodos de ação da entidade (ex.: `descontar_estoque()`, `desativar()`).
2. **Interfaces de Repositório (`src/domain/repositories/`):**
   - Crie as classes abstratas herdando de `abc.ABC` com métodos `@abstractmethod`.

---

### Passo 2: Casos de Uso (`src/application/use_cases/`)
1. Crie um arquivo para cada ação do sistema (ex.: `cadastrar_usuario_usecase.py`).
2. O construtor recebe a interface do repositório (`def __init__(self, repo: IUsuarioRepository)`).
3. O método principal `executar(...)` aplica a lógica:
   - Verifica duplicidades ou pré-condições.
   - Instancia/atualiza a entidade de domínio.
   - Salva usando o repositório.
   - Retorna o resultado.

---

### Passo 3: Banco de Dados e Migrações (`src/infrastructure/` e `alembic/`)
1. **Modelos ORM (`src/infrastructure/database/models/`):**
   - Mapeie as tabelas usando SQLAlchemy Declarative Base.
   - Defina chaves primárias, estrangeiras e colunas indexadas.
2. **Repositório Concreto (`src/infrastructure/database/repositories/`):**
   - Implemente a interface do domínio recebendo `db: Session`.
3. **Alembic (Versionamento de Esquema):**
   - Certifique-se de que `alembic/env.py` referencia `Base.metadata`.
   - Gere e aplique a migração:
     ```bash
     alembic revision --autogenerate -m "criar tabelas iniciais"
     alembic upgrade head
     ```

---

### Passo 4: Segurança & Autenticação (`src/core/` e `src/api/deps.py`)
1. **Hashing:** `get_password_hash(password)` e `verify_password(plain, hashed)`.
2. **JWT:** `create_access_token(data, expires_delta)`.
3. **Dependência de Segurança:** Crie `get_current_user` com `OAuth2PasswordBearer(tokenUrl="/api/auth/login")` para injetar nas rotas privadas.

---

### Passo 5: DTOs Pydantic e Rotas FastAPI (`src/schemas/` e `src/api/`)
1. **Schemas (`src/schemas/`):**
   - Schemas de entrada (Request) e saída (Response).
   - Configure `model_config = ConfigDict(from_attributes=True)` para serializar entidades ORM.
2. **Controllers / Routers (`src/api/routes/`):**
   - Defina verbos e status HTTP semânticos:
     - `POST /recurso` ➔ `201 Created`
     - `GET /recurso/{id}` ➔ `200 OK` (ou `404 Not Found`)
     - `DELETE /recurso/{id}` ➔ `204 No Content`
   - Instancie os use cases com os repositórios concretos injetados.
3. Conecte os routers no `src/main.py` e verifique a documentação interativa em `http://localhost:8000/docs`.

---

### Passo 6: Suíte de Testes & Meta de 80% de Cobertura (`tests/`)
Para atingir 80%+ de cobertura rapidamente:
1. **Testes Unitários de Casos de Uso (Massa rápida de cobertura):**
   - Crie repositórios falsos em memória (usando dicionário/lista).
   - Teste o caminho de sucesso e os caminhos de erro/exceção.
2. **Testes de Integração de Rotas:**
   - Configure `conftest.py` com `TestClient(app)` e SQLite em memória (`sqlite:///:memory:`).
   - Teste login e requisição com token no cabeçalho `Authorization: Bearer <token>`.
3. **Execute o comando com cobertura:**
   ```bash
   pytest --cov=src tests/ --cov-report=term-missing
   ```

---

### Passo 7: Docker & Validação Final
1. Teste o build do `Dockerfile`:
   ```bash
   docker build -t backend-prova .
   ```
2. Valide se o `docker-compose up` sobe o banco de dados e a aplicação integrados.

---

## 🤖 4. Guia de Prompts Práticos para a IA na Prova

Utilize prompts específicos e contextuais para manter a IA no padrão correto:

### Prompt A — Entidade de Domínio Rico e Interface
```text
Atue como um arquiteto backend sênior. Baseado no seguinte cenário/diagrama:
[COLE O CENÁRIO OU ATRIBUTOS DA ENTIDADE AQUI]

Gere:
1. A entidade de Domínio Rico em Python puro (dataclass) para 'src/domain/entities/'. As regras de validação (ex: [LISTE REGRAS]) devem estar no próprio construtor/métodos da entidade disparando ValueError. Não utilize SQLAlchemy ou Pydantic nesta classe.
2. A interface abstrata de repositório em 'src/domain/repositories/' utilizando abc.ABC e @abstractmethod com os métodos essenciais de persistência e busca.
```

### Prompt B — Caso de Uso (Application Layer)
```text
Crie o caso de uso '[NomeDoCasoDeUso]' em 'src/application/use_cases/'.
- Ele deve receber a interface do repositório através de injeção de dependência no __init__.
- No método 'executar(...)', aplique as seguintes regras: [DESCREVA O FLUXO].
- Mantenha Clean Architecture: não faça imports de FastAPI, SQLAlchemy nem HTTP status codes aqui.
```

### Prompt C — Modelo SQLAlchemy & Repositório Concreto
```text
Com base na entidade de domínio e na interface do repositório criadas, implemente:
1. O modelo ORM do SQLAlchemy em 'src/infrastructure/database/models/' com as colunas, tipos e índices adequados.
2. O repositório concreto em 'src/infrastructure/database/repositories/' que herda da interface do domínio e utiliza a Session do SQLAlchemy para executar as operações de banco.
```

### Prompt D — Rotas FastAPI & Schemas Pydantic
```text
Crie:
1. Os schemas Pydantic (Request e Response) em 'src/schemas/' para o recurso '[NomeDoRecurso]'.
2. O router do FastAPI em 'src/api/routes/' expondo os endpoints REST com status codes adequados (201 para criação, 204 para deleção, 404 para não encontrado).
3. A rota deve receber 'db: Session = Depends(get_db)', instanciar o Caso de Uso com o repositório concreto e tratar exceções de negócio retornando HTTPException apropriado.
```

### Prompt E — Testes Unitários para Bater 80%+ de Cobertura
```text
Gere uma suíte completa de testes unitários com pytest para o use case '[NomeDoCasoDeUso]' em 'tests/unit/'.
- Crie uma implementação de repositório fake em memória (utilizando listas/dicts) dentro do próprio arquivo ou fixture para não depender de banco real.
- Cubra:
  a) Cenário de sucesso retornando os dados corretos.
  b) Todos os cenários de exceção e validação de regras de negócio com pytest.raises.
- Foque em maximizar a cobertura de linhas de código.
```

---

## ⚠️ 5. Armadilhas Comuns e Como Evitar

| Erro Comum | Causa | Como Prevenir / Resolver |
| :--- | :--- | :--- |
| **Import Circular** | Rota importa modelo que importa db que importa rota. | Siga a hierarquia de camadas: `domain` não importa ninguém; `application` importa só `domain`; `infrastructure` e `api` importam as camadas internas. |
| **Alembic não detecta modelos** | `target_metadata` no `env.py` está vazio ou `None`. | No `alembic/env.py`, importe sua `Base` e configure: `target_metadata = Base.metadata`. Importe todos os modelos antes de chamar a migração. |
| **Senha em texto puro no banco** | Esquecer de aplicar hash no use case de cadastro. | Nunca faça `Usuario(senha=dados.senha)`. Sempre faça `Usuario(senha_hash=security.get_password_hash(dados.senha))`. |
| **Testes lentos ou poluindo banco** | Teste unitário tentando conectar no PostgreSQL. | Use repositório em memória para use cases e `sqlite:///:memory:` para testes de integração. |
| **Payload do Swagger dá 422** | Divergência entre schema Pydantic e payload enviado. | Verifique se campos obrigatórios estão sem valor default ou se os tipos de data/UUID estão no formato esperado. |

---

## ✅ 6. Checklist de Entrega / Apresentação da Prova

Antes de submeter o código ou chamar o avaliador, valide:

- [ ] **Documentação Swagger ativa:** Navegue até `http://localhost:8000/docs` e teste ao menos 1 requisição com sucesso.
- [ ] **Autenticação funcionando:** Faça login em `/auth/login`, copie o token JWT retornado e clique no botão **Authorize** (cadeado) do Swagger para testar rotas protegidas.
- [ ] **Alembic versionado:** A pasta `alembic/versions/` possui ao menos um arquivo de migração executável.
- [ ] **Suíte de testes verde (100% de sucesso):**
  ```powershell
  pytest -v
  ```
- [ ] **Meta de 80%+ de cobertura atingida:**
  ```powershell
  pytest --cov=src --cov-report=term-missing
  ```
- [ ] **Código limpo:** Sem blocos `pass`, `TODO` esquecidos ou prints de depuração soltos no código.
- [ ] **Docker:** O comando `docker compose up -d` sobe os serviços sem apresentar erro no log (`docker compose logs -f`).
