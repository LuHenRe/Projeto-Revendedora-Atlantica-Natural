# Deploy — Neon (PostgreSQL) + Docker Hub + Render (Backend) + Vercel (Frontend)

Este projeto usa um monorepo com:

- `backend/` — API FastAPI, empacotada via `backend/Dockerfile`, publicada no **Docker Hub** e executada no **Render**.
- `Banco de Dados` — PostgreSQL gerenciado no **Neon.tech** (Serverless, gratuito e sem expiração em 30 dias).
- `frontend/` — Next.js 16 (App Router), publicado na **Vercel**.
- `.github/workflows/ci-cd.yml` — Pipeline automatizado no **GitHub Actions**.

---

## Ordem de Execução (Importante para a 1ª vez!)

Como o repositório criado no Docker Hub começa vazio (sem a tag `:latest`), siga exatamente esta ordem na primeira publicação:

```text
1. Neon.tech (criar banco)
2. Docker Hub (token de acesso)
3. GitHub Secrets/Variables (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN, DOCKERHUB_IMAGE_NAME)
4. Push na main ──► GitHub Actions publica a 1ª imagem :latest no Docker Hub
5. Render (criar Web Service via "Existing Image" usando a imagem publicada)
6. Vercel (publicar frontend e copiar URL + credenciais para CI/CD)
7. Atualizar FRONTEND_URL no Render e RENDER_DEPLOY_HOOK_URL + secrets da Vercel no GitHub
```

---

## 1. Banco de Dados no Neon.tech

1. Acesse [neon.tech](https://neon.tech) e crie um projeto (ex: `atlantica-natural-db`, PostgreSQL 16, região `US East (Ohio)` ou `N. Virginia`).
2. No Dashboard do Neon, copie a **Connection String**:
   ```text
   postgresql://neondb_owner:SENHA@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   > Este backend utiliza SQLAlchemy síncrono com `psycopg2-binary`, portanto mantenha o prefixo `postgresql://` (não utilize `postgresql+asyncpg://`).

---

## 2. Docker Hub (Token e Nome da Imagem)

1. No [Docker Hub](https://hub.docker.com), confirme o nome exato do repositório da sua imagem (ex: `atlantica-natural-backend`).
2. Vá em **Account Settings → Security → Personal access tokens → Generate new token**.
   - Permissões: **Read, Write, Delete**.
   - Copie o token gerado (`DOCKERHUB_TOKEN`).

---

## 3. Primeira Publicação da Imagem via GitHub Actions

1. No seu repositório do GitHub, vá em **Settings → Secrets and variables → Actions**:
   - Na aba **Secrets**, cadastre:
     - `DOCKERHUB_USERNAME`: seu usuário do Docker Hub
     - `DOCKERHUB_TOKEN`: token gerado no passo 2
   - Na aba **Variables**, se o nome do repositório no Docker Hub for diferente de `atlantica-natural-backend`, crie:
     - `DOCKERHUB_IMAGE_NAME`: nome exato do repositório no Docker Hub (apenas o nome, sem seu usuário)
2. Faça `git push` para a branch `main` (ou rode o workflow manualmente na aba **Actions**).
   - O job `backend-tests` rodará os testes (`pytest`).
   - O job `docker-build-push` construirá `backend/Dockerfile` e enviará a imagem `:latest` para o Docker Hub.
   - *(Na 1ª vez, os jobs de deploy no Render/Vercel só serão completados após os passos 4 e 5 abaixo.)*

---

## 4. Backend no Render.com (Existing Image)

Agora que a tag `:latest` já existe no Docker Hub:

1. Acesse o [Render Dashboard](https://dashboard.render.com) → **New + → Web Service**.
2. Selecione **Existing Image**.
3. Informe em **Image URL**:
   ```text
   docker.io/<SEU_DOCKERHUB_USERNAME>/<NOME_DA_IMAGEM>:latest
   ```
   *(Se o repositório no Docker Hub for privado, adicione suas credenciais em **Add Credentials**).*
4. Selecione o plano **Free** e a região mais próxima do banco Neon.
5. Em **Health Check Path** (em *Advanced*), configure `/health`.
6. Em **Environment Variables**, cadastre:

| Variável | Valor |
| :--- | :--- |
| `DATABASE_URL` | Connection string do Neon (`postgresql://...?sslmode=require`) |
| `SECRET_KEY` | Chave secreta forte para JWT |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `ADMIN_USERNAME` | Usuário do painel admin |
| `ADMIN_PASSWORD` | Senha forte para o painel admin |
| `ATLANTICA_REVENDEDORA_URL` | `https://loja.atlanticanatural.com.br/valescareis` |
| `FRONTEND_URL` | URL do frontend na Vercel (preencher após o Passo 5) |
| `CORS_ORIGINS` | Opcional: URLs adicionais separadas por vírgula |

7. Crie o serviço e aguarde a inicialização (o container roda `alembic upgrade head` automaticamente antes de subir o Uvicorn).
8. Vá em **Settings → Deploy Hook → Create Deploy Hook** e copie a URL (`RENDER_DEPLOY_HOOK_URL`).
9. Teste o backend: `https://<seu-servico>.onrender.com/health` deve retornar `{"status":"ok"}`.

> [!WARNING]
> **Persistência de imagens enviadas localmente (`uploads/produtos`):**
> O sistema de arquivos do plano Free do Render é efêmero. Arquivos enviados manualmente via upload local pelo admin são perdidos quando o container reinicia ou hiberna. Links externos de imagens (incluindo produtos importados da loja matriz) permanecem salvos no PostgreSQL do Neon.

---

## 5. Frontend na Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New → Project** e selecione o repositório.
2. Em **Root Directory**, clique em **Edit** e escolha `frontend`.
3. Em **Environment Variables**, cadastre:

| Variável | Exemplo de Valor |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://<seu-backend>.onrender.com` *(obrigatório incluir `https://` e sem `/` no final)* |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5561999999999` |
| `NEXT_PUBLIC_CIDADE_ATENDIMENTO` | `Valparaíso de Goiás` |
| `NEXT_PUBLIC_LINK_CATALOGO_PDF` | URL do catálogo PDF |
| `NEXT_PUBLIC_LINK_RECRUTAMENTO_B2B` | URL do WhatsApp B2B |

4. Faça o **Deploy**, copie a URL gerada (ex: `https://atlantica-vitrine.vercel.app`) e adicione-a na variável `FRONTEND_URL` do Render.
5. Para habilitar o deploy automático pela esteira do GitHub Actions:
   - Crie um token na Vercel em **Account Settings → Tokens** (`VERCEL_TOKEN`).
   - No seu terminal local, execute na pasta `frontend/`:
     ```bash
     npx vercel link
     ```
   - Abra `frontend/.vercel/project.json` e copie `orgId` (`VERCEL_ORG_ID`) e `projectId` (`VERCEL_PROJECT_ID`).

---

## 6. Finalizar Secrets no GitHub Actions

Em **Settings → Secrets and variables → Actions → Secrets**, garanta que todos os 6 secrets existam:

| Secret | Origem |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | Usuário do Docker Hub |
| `DOCKERHUB_TOKEN` | Personal Access Token do Docker Hub |
| `RENDER_DEPLOY_HOOK_URL` | Render → Service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `orgId` em `frontend/.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` em `frontend/.vercel/project.json` |
