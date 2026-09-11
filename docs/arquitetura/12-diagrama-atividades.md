# Diagrama de Atividades

Fluxos de decisão, alternativas e processos ponta a ponta do sistema.

---

## 1. Fluxo de compra local: validação geográfica → WhatsApp

Raia **Cliente** / Raia **Sistema (Frontend)** — decisão e alternativa.

```mermaid
flowchart TD
    Start((Início)) --> A1[Cliente visualiza vitrine]
    A1 --> A2[Cliente seleciona produto]
    A2 --> A3[Cliente clica em contato WhatsApp]
    A3 --> D1{Região informada?}
    D1 -- Não --> A4[Cliente informa cidade/região]
    A1 --> A4
    A4 --> D2{Região está na lista de atendimento?}
    D2 -- Sim --> A5[Sistema monta URL com mensagem]
    D2 -- Não --> A6[Sistema exibe mensagem de bloqueio]
    A6 --> FimBloqueio((Fim — compra bloqueada))
    A5 --> A7[Browser abre WhatsApp]
    A7 --> A8[Cliente inicia conversa com revendedora]
    A8 --> FimSucesso((Fim — compra iniciada))
```

> **Decisões:** `Região informada?` (verifica se o cliente já informou). `Região está na lista?` (verifica no front-end se a cidade está na coleção de regiões válidas).

---

## 2. Fluxo de cadastro B2B

Raia **Potencial parceira** / Raia **Sistema** — sem paralelismo.

```mermaid
flowchart TD
    Start((Início)) --> A1[Potencial parceira acessa CTA B2B]
    A1 --> A2[Sistema exibe página B2B]
    A2 --> A3[Visitante preenche formulário de interesse]
    A3 --> D1{Dados obrigatórios preenchidos?}
    D1 -- Sim --> A4[Sistema salva lead no banco]
    A4 --> A5[Sistema exibe confirmação]
    A5 --> Fim((Fim))
    D1 -- Não --> A6[Sistema exibe mensagem de erro]
    A6 --> A3
```

---

## 3. Fluxo de gestão de produto (backoffice)

Raia **Administradora** / Raia **Sistema Backend** — decisão de criação/edição.

```mermaid
flowchart TD
    Start((Início)) --> A1[Administradora acessa backoffice]
    A1 --> A2[Sistema exige autenticação]
    A2 --> D0{Credenciais válidas?}
    D0 -- Não --> A3[Sistema exibe erro]
    A3 --> A2
    D0 -- Sim --> A4[Painel liberado]
    A4 --> D1{Criar novo ou editar existente?}
    D1 -- Novo --> A5[Formulário vazio]
    D1 -- Editar --> A6[Sistema carrega dados do produto]
    A5 --> A7[Administradora preenche dados]
    A6 --> A7
    A7 --> D2{Todos os campos obrigatórios válidos?}
    D2 -- Sim --> A3b[Produto salvo com sucesso]
    D2 -- Não --> A4b[Sistema exibe erros de validação]
    A4b --> A7
    A3b --> Fim((Fim))
```

---

## Observações
- Os diagramas de atividades complementam os de sequência (seção 6) ao mostrar decisões e alternativas de fluxo; a ordem temporal fica nos de sequência.
- Para paralelismo neste sistema (não há no momento), usar raias ou fork/join com anotação `(fork)`/`(join)` no label do nó.
- Se sistema tiver múltiplos atores no mesmo fluxo, descrever raias antes do diagrama e listar quais ações pertencem a cada raia.