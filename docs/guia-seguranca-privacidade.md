# 🛡️ Guia de Segurança, Privacidade e Hardening do Repositório

Este guia reúne as etapas práticas e recomendações para manter o repositório público protegido contra vazamentos de dados pessoais, credenciais e configurações sensíveis.

---

## 📋 Sumário
1. [Privacidade de E-mail e Metadados do Git](#1-privacidade-de-e-mail-e-metadados-do-git)
2. [Parametrização Segura do Docker Compose](#2-parametrização-segura-do-docker-compose)
3. [Higienização do `.gitignore` e Artefatos Locais](#3-higienização-do-gitignore-e-artefatos-locais)
4. [Prevenção Automática de Vazamento de Segredos](#4-prevenção-automática-de-vazamento-de-segredos)
5. [Plano de Ação em Caso de Incidente (Vazamento Real)](#5-plano-de-ação-em-caso-de-incidente-vazamento-real)

---

## 1. Privacidade de E-mail e Metadados do Git

Em repositórios públicos, qualquer commit enviado expõe publicamente o nome e e-mail configurados no Git. Para evitar a exposição do seu e-mail pessoal nos próximos commits:

### Passo 1.1: Ativar proteção no GitHub
1. Acesse o GitHub e vá em **Settings > Emails** (ou acesse diretamente [github.com/settings/emails](https://github.com/settings/emails)).
2. Marque a opção:
   - ✅ **Keep my email addresses private** (Mantém seu e-mail pessoal oculto e gera um endereço `noreply`).
   - ✅ **Block command line pushes that expose my email** (Bloqueia automaticamente qualquer `git push` via terminal se ele contiver seu e-mail pessoal no commit).
3. Localize o endereço anônimo gerado pelo GitHub, no formato:
   `154239376+LuHenRe@users.noreply.github.com`

### Passo 1.2: Configurar o Git local no terminal
No seu computador, configure o Git globalmente para assinar commits com o e-mail anônimo:

```powershell
git config --global user.email "154239376+LuHenRe@users.noreply.github.com"
git config --global user.name "LuHenRe"
```

Para verificar se a configuração está ativa:
```powershell
git config user.email
```

> **Nota sobre o histórico anterior:** Se no futuro desejar remover seu e-mail pessoal dos commits antigos que já estão no GitHub, será necessário reescrever o histórico da árvore git usando a ferramenta [git-filter-repo](https://github.com/newren/git-filter-repo) seguido de um `git push --force --all`. Como não são senhas vazadas e sim apenas autoria de commits de estudo, a configuração acima para os próximos commits já costuma ser suficiente.

---

## 2. Parametrização Segura do Docker Compose

Atualmente, o arquivo `backend/docker-compose.yml` utiliza credenciais padrão (`postgres:postgres`), ideais para desenvolvimento local rápido, mas vulneráveis se implantadas diretamente em produção.

### Passo 2.1: Parametrizar com variáveis de ambiente
No arquivo `backend/docker-compose.yml`, substitua as senhas fixas por variáveis que serão lidas do `.env`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: atlanticanatural-db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-atlanticanatural}
    ports:
      # Em produção, EVITE expor a porta 5432 diretamente para a internet
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  adminer:
    image: adminer
    container_name: atlanticanatural-adminer
    restart: always
    ports:
      # Em produção, desative o adminer ou amarre apenas ao localhost
      - "127.0.0.1:8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

### Boas práticas para o ambiente de produção (VPS / Nuvem):
* **Não expor a porta 5432 publicamente:** Usar `"127.0.0.1:5432:5432"` garante que apenas conexões originadas do próprio servidor consigam falar com o banco.
* **Desativar o Adminer em produção:** Interfaces gráficas de administração web não devem ficar abertas na internet sem autenticação prévia por proxy reverso (Nginx/Traefik) ou VPN.

---

## 3. Higienização do `.gitignore` e Artefatos Locais

Mantenha o `.gitignore` sempre atualizado para impedir que metadados gerados pelo ambiente Python sejam acidentalmente incluídos no Git.

### Passo 3.1: Regras recomendadas para o `.gitignore` da raiz
Verifique se as seguintes entradas estão presentes no arquivo `.gitignore`:

```gitignore
# Ambientes virtuais e pacotes locais
.venv/
venv/
ENV/
*.egg-info/
dist/
build/

# Cache do Python e testes
__pycache__/
*.py[cod]
.pytest_cache/
.coverage
htmlcov/

# Segredos e variáveis de ambiente
.env
.env.local
.env.*.local
*.pem
*.key
```

### Passo 3.2: Limpar artefatos locais que não deveriam estar no Git
Se alguma pasta como `*.egg-info/` já foi criada localmente:
```powershell
# Remove a pasta do índice do git caso já tenha sido rastreada acidentalmente:
git rm -r --cached backend/src/*.egg-info/ 2>$null
```

---

## 4. Prevenção Automática de Vazamento de Segredos

Para evitar que senhas reais, tokens da API ou chaves JWT sejam comitados por descuido antes de você perceber:

### Opção A: Auditoria local sob demanda com Gitleaks
Você pode instalar o [Gitleaks](https://github.com/gitleaks/gitleaks) para auditar todo o repositório a qualquer momento:

```powershell
# Executa uma análise em todo o histórico e arquivos atuais
gitleaks detect --source . --verbose
```

### Opção B: Checklist rápido pré-commit (Rotina do Desenvolvedor)
Antes de executar qualquer `git commit` e `git push`, crie o hábito de verificar:
1. `git status` — Confirme que nenhum arquivo `.env`, `.pem` ou arquivo temporário está na lista de staged files.
2. `git diff --staged` — Revise linha por linha o que está sendo empacotado para o commit.

---

## 5. Plano de Ação em Caso de Incidente (Vazamento Real)

Se algum dia uma credencial real (ex: senha de produção, chave do WhatsApp Cloud API, token do GitHub, chave da AWS) for comitada por engano em um repositório público:

1. **🚨 Passo 1: Invalidar e Rotacionar Imediatamente**
   * *Regra de Ouro:* Uma credencial comitada em repositório público **deve ser considerada comprometida no mesmo segundo**.
   * Troque a senha no provedor ou delete a chave de API e gere uma nova imediatamente. Apenas apagar a linha de código no commit seguinte NÃO anula o vazamento, pois a versão continuará viva no histórico.
2. **🧹 Passo 2: Limpar o Histórico do Git**
   * Utilize `git-filter-repo` ou `BFG Repo-Cleaner` para expurgar o arquivo ou a string do histórico completo do Git.
3. **🔄 Passo 3: Forçar Atualização Remota**
   * Faça `git push origin --force --all` para sobrepor o histórico do GitHub.
