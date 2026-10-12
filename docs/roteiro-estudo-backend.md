# Roteiro de Estudo e Preparação: Backend da Vitrine Virtual

Este documento serve como guia de estudos técnico e roteiro prático para dominar a arquitetura, as decisões de projeto e o código do backend da **Vitrine Virtual — Atlântica Natural**, preparando o desenvolvedor para apresentações e defesas técnicas.

---

## 🎯 0. O "Elevator Pitch" do Backend (Resumo Executivo)
> *"O nosso backend foi construído em Python 3.10+ com FastAPI e PostgreSQL, adotando os princípios de Clean Architecture e Domínio Rico. O sistema atua como o motor do Hub Híbrido de Curadoria: ele gerencia de forma transacional o **estoque físico local** da revendedora (para fechamento via WhatsApp) e provê uma área administrativa protegida por **JWT e Bcrypt**. Toda a regra de negócio central é desacoplada de frameworks externos e blindada por **uma suíte automatizada de testes com 100% de aprovação e meta de 80%+ de cobertura**."*

---

## 🧭 Módulos de Estudo Técnico

### Módulo 1: O Núcleo do Negócio (Clean Architecture & Domínio Rico)
* **Conceitos Teóricos:**
  * **Clean Architecture:** Divisão do software em camadas concêntricas onde a camada interna (regras de negócio) nunca conhece a camada externa (banco de dados, frameworks web, bibliotecas terceiras).
  * **Domínio Rico vs. Modelo Anêmico:** Em modelos anêmicos, as classes atuam como meros sacos de dados (`getters/setters`). No **Domínio Rico**, a entidade é auto-validável e encapsula comportamentos expressivos de negócio.
  * **Princípio da Inversão de Dependências (DIP):** O caso de uso depende de interfaces abstratas (`IProdutoRepository`) e não de implementações concretas (`ProdutoRepositoryDB`).
* **Arquivos-Chave no Repositório:**
  * `backend/src/domain/entities/produto.py`: Veja a proteção de invariantes no `__post_init__` (`preco < 0` e `nome` vazio disparam `ValueError`) e os métodos de comportamento `inativar()`, `em_estoque()` e `tem_oferta_local()`.
  * `backend/src/domain/repositories/i_produto_repository.py`: Interface abstrata (`ABC`) que dita o contrato sem tocar em SQLAlchemy.
  * `backend/src/application/use_cases/criar_produto.py`: Caso de uso orquestrando a validação de existência da categoria antes de persistir o produto.
* 💬 **Pergunta de Banca:** *"Por que vocês não colocaram o SQLAlchemy direto dentro da entidade Produto?"*
  * **Resposta:** *"Para evitar acoplamento tecnológico. Se decidirmos trocar o SQLAlchemy por outro ORM ou migrar para outro banco no futuro, nenhuma regra de negócio ou caso de uso precisará ser alterado."*

---

### Módulo 2: Persistência & Versionamento (PostgreSQL + Alembic)
* **Conceitos Teóricos:**
  * **Por que Alembic e não `Base.metadata.create_all()`?** O método simples do ORM não versiona alterações incrementais de colunas, índices nem permite rollbacks. O Alembic mantém o histórico versionado no Git (`upgrade` e `downgrade`), garantindo previsibilidade e idempotência entre ambientes de desenvolvimento e produção.
  * **Chaves e Índices:** Uso de `UUID` como chave primária (evita ID sequencial previsível) e índices de busca (`ix_produtos_nome`, `ix_categorias_nome`).
* **Arquivos-Chave no Repositório:**
  * `backend/src/infrastructure/database/models/produto.py`: Mapeamento ORM com chave estrangeira `ForeignKey("categorias.id")`.
  * `backend/alembic/versions/de4da57eb0d8_create_initial_tables.py`: Migração inicial rastreada com métodos reversíveis `upgrade()` e `downgrade()`.
* 💬 **Pergunta de Banca:** *"Como vocês garantem a integridade referencial se uma categoria for excluída?"*
  * **Resposta:** *"O PostgreSQL possui Foreign Key configurada. O banco impede a exclusão física órfã, e a nossa regra de domínio/repositório faz exclusão lógica (`ativo = False`), preservando a consistência histórica."*

---

### Módulo 3: Exposição de APIs & Contratos (FastAPI + Swagger)
* **Conceitos Teóricos:**
  * **Segregação de Contextos:** Rotas públicas da vitrine (leitura rápida) vs. rotas administrativas privadas (gestão de estoque e catálogo).
  * **Validação por Tipos com Pydantic:** Se um cliente enviar um payload com tipo inválido ou campo obrigatório ausente, o FastAPI responde automaticamente com `422 Unprocessable Entity` sem necessidade de validações manuais repetitivas.
  * **OpenAPI 3.0 (Swagger / ReDoc):** Geração automática de documentação interativa em `/docs`.
* **Arquivos-Chave no Repositório:**
  * `backend/src/main.py`: Registro de routers, tags semânticas e configuração de CORS.
  * `backend/src/api/routes/produtos.py`: Endpoints públicos (`GET /produtos/ofertas-locais`) e privados (`POST /admin/produtos`).
* 💬 **Pergunta de Banca:** *"Qual a diferença entre a rota `/produtos` e `/produtos/ofertas-locais`?"*
  * **Resposta:** *"`/produtos` retorna todo o catálogo ativo da revendedora. Já `/produtos/ofertas-locais` filtra apenas os produtos ativos que possuem estoque físico imediato (`quantidade_estoque > 0`), que é a condição necessária para disparar a venda física no WhatsApp."*

---

### Módulo 4: Segurança & Autenticação (JWT + Bcrypt)
* **Conceitos Teóricos:**
  * **Hashing vs. Criptografia:** Senhas nunca são armazenadas de forma reversível. O `bcrypt` adiciona um *salt* aleatório e gera um hash unidirecional computacionalmente custoso contra ataques de dicionário e rainbow tables.
  * **Stateless JWT:** O servidor não armazena sessão em memória/banco. O token contém os dados (`sub`, `exp`) e é assinado com `SECRET_KEY` via algoritmo `HS256`.
  * **Injeção de Dependências (`Depends`):** Padrão do FastAPI onde a validação de segurança é interceptada antes de executar o controller.
* **Arquivos-Chave no Repositório:**
  * `backend/src/core/security.py`: Funções `verify_password()`, `get_password_hash()` e `create_access_token()`.
  * `backend/src/api/deps.py`: Função `get_current_user` com o `OAuth2PasswordBearer`.
* 💬 **Pergunta de Banca:** *"Como uma rota descobre que quem está chamando é de fato o administrador?"*
  * **Resposta:** *"A rota declara `current_user: str = Depends(get_current_user)`. O FastAPI extrai o token do header `Authorization: Bearer <token>`, decodifica a assinatura usando a SECRET_KEY, checa se não expirou e confere se o usuário bate com as credenciais administrativas autorizadas."*

---

### Módulo 5: Qualidade & Estratégia de Testes (Pytest + TDD)
* **Conceitos Teóricos:**
  * **Pirâmide de Testes:**
    1. *Base:* Testes unitários de domínio (rápidos, sem I/O).
    2. *Meio:* Testes de casos de uso (validação de regras de negócio com repositórios em memória).
    3. *Topo:* Testes de integração de API (requisições HTTP via `TestClient` simulando chamadas reais).
  * **Isolamento nos Testes:** Uso de SQLite em memória (`sqlite:///:memory:`) em `conftest.py` para os testes rodarem em menos de 2 segundos sem sujar o PostgreSQL de desenvolvimento.
* **Arquivos-Chave no Repositório:**
  * `backend/tests/conftest.py`: Fixtures `db_session`, `client` e `admin_token_headers`.
  * `backend/tests/domain/test_produto_entity.py`: Testes de preço negativo e oferta local.
  * `backend/tests/test_produtos.py`: Testes de exclusão lógica e listagem de ofertas locais.
* 💬 **Pergunta de Banca:** *"Como vocês garantem que os testes não afetam os dados reais?"*
  * **Resposta:** *"Configuramos fixtures em `conftest.py` com banco SQLite temporário em memória e rollback automático entre os testes. O banco PostgreSQL do docker nem sequer é tocado durante a suíte de testes unitários e de integração."*

---

### Módulo 6: Infraestrutura & DevOps (Docker Compose & PEP 621)
* **Conceitos Teóricos:**
  * **Docker Compose:** Orquestração declarativa. Um desenvolvedor novo precisa apenas de `docker compose up -d` para ter o PostgreSQL 15 e o Adminer (porta 8080) prontos para uso.
  * **`pyproject.toml` (PEP 621):** O padrão moderno da comunidade Python que substitui arquivos soltos de `setup.py` e `requirements.txt`, unificando metadados e dependências principais e de desenvolvimento.
* **Arquivos-Chave no Repositório:**
  * `backend/docker-compose.yml`: Definição dos containers de banco e interface web.
  * `backend/pyproject.toml`: Metadados, dependências e flags do pytest.

---

## 🎤 Roteiro Verbal Slide a Slide (Apresentação HTML)

A apresentação visual correspondente está em [`docs/apresentacao-backend.html`](./apresentacao-backend.html).

| Slide | Título no Slide | Roteiro de Fala Sugerido |
|---|---|---|
| **01** | Capa | *"Olá a todos. Hoje apresentaremos a arquitetura e engenharia do backend da Vitrine Virtual da Atlântica Natural, destacando Clean Architecture, robustez no domínio e qualidade com testes."* |
| **02** | Estrutura & Gerenciamento | *"Organizamos o projeto separando claramente o código da aplicação em `src/` e a suíte de testes em `tests/`. No `src/`, temos a divisão por camadas limpas. Toda a gestão de dependências está padronizada no `pyproject.toml` sob a PEP 621."* |
| **03** | Domínio Rico & Clean Arch | *(Destaque o editor de código)*: *"Aqui vemos a entidade `Produto`. Diferente de um modelo anêmico, ela protege suas próprias regras: preço negativo lança exceção e o método `tem_oferta_local` garante que só vendemos itens com estoque físico real."* *(Pode clicar no diagrama para abrir o zoom)* |
| **04** | Banco & Alembic | *"Nosso banco PostgreSQL armazena apenas os dados locais essenciais. Todas as tabelas e alterações de esquema são versionadas pelo Alembic com funções `upgrade` e `downgrade`, garantindo idempotência e rastreabilidade entre dev e prod."* |
| **05** | Rotas REST & Swagger | *"Exponibilizamos rotas públicas otimizadas para o frontend mobile-first e rotas `/admin` restritas. Toda a API possui documentação interativa gerada em tempo real pelo Swagger OpenAPI no `/docs`."* |
| **06** | Segurança & JWT | *"Para a segurança do painel administrativo, não armazenamos senhas puras: utilizamos Bcrypt com salt dinâmico. As rotas são guardadas via injeção de dependências do FastAPI, validando a assinatura e expiração de tokens JWT."* |
| **07** | Qualidade & Testes | *"Nossa pirâmide de testes cobre desde as entidades de domínio até a integração das rotas. Temos 20 testes automatizados passando com 100% de sucesso em 1.5s, mantendo meta de 80%+ de cobertura de código."* |
| **08** | Destaques da Arquitetura | *"Como destaques de infraestrutura, utilizamos Docker Compose para banco e Adminer, mantemos a trava geográfica no frontend para não sobrecarregar a API e adotamos soft-delete para garantir integridade referencial."* |
| **09** | Conclusão & Q&A | *"Com isso, entregamos um backend escalável, seguro e testado. Estamos abertos a perguntas!"* |

---

## ⚡ Comandos Úteis para o Momento da Apresentação

```powershell
# 1. Executar a suíte de testes automatizados com relatório detalhado:
cd backend
$env:PYTHONPATH="."
.\venv\Scripts\pytest -v

# 2. Subir os serviços de banco e adminer via Docker:
docker compose up -d

# 3. Rodar a API localmente:
.\venv\Scripts\uvicorn src.main:app --reload

# 4. Acessar a documentação Swagger interativa:
# http://127.0.0.1:8000/docs
```
