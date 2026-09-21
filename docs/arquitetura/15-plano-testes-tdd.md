# Plano de Testes (TDD)

O desenvolvimento deverá seguir a abordagem Test-Driven Development (TDD), priorizando a pirâmide de testes. O fluxo de testes sempre começa da camada mais interna para a mais externa.

## 1. Testes de Unidade (Domain)
- **Foco:** Entidades, Value Objects e suas validações inerentes.
- **Exemplo (Produto/RegiaoAtendimento):** 
  - Testar se o Value Object `RegiaoAtendimento` lança erro ao receber uma string vazia ou inválida.
  - Testar se um `Produto` altera seu status corretamente para `Inativo` quando o método `desativar()` é chamado.

## 2. Testes de Aplicação (Use Cases)
- **Foco:** Regras de orquestração do caso de uso. Utilizam *Fake Repositories* (em memória) para isolar do banco de dados real.
- **Exemplo (CadastrarProdutoUseCase):**
  - Dado um payload válido, verificar se o produto é criado e o método `save()` do repositório é chamado 1 vez.
  - Dado um produto sem categoria associada (se obrigatório), o caso de uso deve lançar um erro de negócio (`DomainException`).

## 3. Testes de Integração (Adapters / Infra)
- **Foco:** Banco de dados, ORM, serialização JSON e endpoints HTTP.
- **Exemplo (ProdutoRepositoryPostgres / FastAPI Endpoint):**
  - Salvar um produto usando a implementação real do PostgreSQL e realizar um fetch no banco para verificar se os dados persistiram corretamente.
  - Fazer um GET `/api/produtos` com um `TestClient` e verificar se a resposta retorna status HTTP 200 com a estrutura JSON correta da vitrine.

## Rastreabilidade
Cada Requisito Funcional (RF) mapeado na documentação de requisitos (seção 02) deve ser coberto por ao menos um teste de integração de aceitação e pelos testes de unidade correspondentes de suas entidades de domínio.
