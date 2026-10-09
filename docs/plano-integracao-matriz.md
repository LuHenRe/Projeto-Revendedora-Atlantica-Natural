# Plano de Implementação: Integração com a Matriz (Web Scraping)

Como a Atlântica Natural não possui uma API pública documentada, a melhor alternativa técnica para puxar os dados essenciais (Nome, Foto, Preço e Descrição) é utilizar a técnica de **Web Scraping**. O backend irá visitar a URL do produto de forma programática e extrair essas informações direto do HTML da página.

Abaixo está o plano passo a passo para integrar isso ao backend atual respeitando a *Clean Architecture*.

---

## Fase 1: Setup de Dependências de Scraping
Para realizar a extração dos dados HTML com eficiência, vamos adicionar as bibliotecas padrões do mercado Python para esse fim:
- **`beautifulsoup4`**: Para navegar e buscar dados no HTML.
- **`lxml`**: Parser ultra-rápido para o BeautifulSoup.
- *(O `httpx` já está no projeto e será usado para fazer os downloads das páginas de forma assíncrona).*

**Ação:** Adicionar `beautifulsoup4` e `lxml` ao `pyproject.toml` e rodar `pip install`.

---

## Fase 2: Serviço de Scraping (Infrastructure)
Na Clean Architecture, acessos a serviços/sites externos ficam na camada de infraestrutura.
- Criar o pacote `src/infrastructure/external/`.
- Criar a classe `AtlanticaScraper` que conterá a lógica:
  1. Receber uma URL (ex: `https://atlanticanaturalbr.com.br/...`).
  2. Fazer uma requisição `GET` injetando *Headers* de navegador (User-Agent) para evitar bloqueios.
  3. Utilizar o BeautifulSoup para buscar no HTML os seletores (tags/classes CSS) que contenham o **Título**, **Preço**, **Imagem** e **Descrição**.
  4. Retornar um dicionário padronizado com esses dados.

---

## Fase 3: Modelagem e Banco de Dados (Domain & Infra)
Precisamos de uma tabela separada do "estoque local" para armazenar os itens destacados da matriz, servindo como um "Cache de Vitrine".

- **Domain Entity:** Criar `ProdutoMatriz` em `src/domain/entities/`.
  - Campos: `id`, `url_origem`, `url_afiliada`, `nome`, `preco`, `imagem_url`, `ativo`.
- **Infrastructure Model:** Criar `ProdutoMatrizModel` (SQLAlchemy).
- **Migration (Alembic):** Gerar a migration para criar a nova tabela `produtos_matriz` no PostgreSQL.
- **Repository:** Criar `ProdutoMatrizRepository` para as operações de Salvar, Listar e Deletar.

---

## Fase 4: Casos de Uso (Application)
Criar a lógica de negócio que liga o Scraper com o Banco de Dados.

- **`AdicionarProdutoMatrizUseCase`:** 
  1. O Admin fornece apenas a URL oficial.
  2. O Use Case chama o `AtlanticaScraper`.
  3. Com os dados em mãos, ele monta a `url_afiliada` (adicionando os parâmetros de rastreio da revendedora).
  4. Salva no banco de dados e retorna o produto formatado.
- **`ListarProdutosMatrizUseCase`:** 
  Retorna todos os produtos da matriz que estão com status `ativo=True` para exibição na vitrine.
- *(Futuro) `AtualizarPrecosMatrizUseCase`:* 
  Um script que pode ser rodado 1x ao dia para varrer as URLs salvas e atualizar o preço no nosso banco.

---

## Fase 5: Endpoints REST (Interfaces/API)
Criar os controladores FastAPI para expor as novas funcionalidades.

- **Rotas Administrativas (Protegidas por JWT):**
  - `POST /admin/produtos-matriz`: Recebe um JSON `{"url": "https://..."}` e executa o scraping.
  - `DELETE /admin/produtos-matriz/{id}`: Remove um destaque da vitrine.
- **Rotas Públicas:**
  - `GET /produtos-matriz`: Rota leve e otimizada (aproveitando o nosso cache local) consumida pelo Frontend para montar os blocos de Deep Links.
