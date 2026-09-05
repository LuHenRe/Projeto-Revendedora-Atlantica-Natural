# Decisões de Arquitetura

## Decisões principais

### 1. Trava geográfica no frontend
A regra de validação de região de atendimento foi definida no frontend para melhorar a experiência do usuário e evitar requisições inúteis ao backend. Isso mantém o fluxo mais rápido e reduz atrito antes do clique no WhatsApp.

### 2. Banco de dados focado em estoque físico
A infraestrutura persiste somente produtos físicos e categorias da vitrine local. Links externos de afiliada não entram no MER principal porque não representam itens do catálogo local.

### 3. Vitrine como hub híbrido
A interface centraliza diferentes canais dentro de uma experiência única: venda local, compra online, catálogo PDF e recrutamento B2B. Isso cria valor de organização e conversão sem transformar o sistema em um e-commerce completo.

### 4. WhatsApp como canal de fechamento
A conversão local acontece por mensagem direta, respeitando o modelo de atendimento pessoal característico da revendedora. Isso reduz perda de tempo e melhora a qualificação do cliente.

### 5. Estrutura modular em frontend
O código da interface foi pensado em blocos independentes: estoque, deep links, PDF e B2B. Isso ajuda na manutenção, na evolução visual e na reutilização do layout.

## Trade-offs
- manter a regra geográfica no frontend reduz custo de infraestrutura, mas exige cuidado para evitar bypass por cliente sem validação;
- separar links externos do banco mantém a modelagem limpa, mas exige gerenciamento de URLs em configuração ou CMS;
- manter o sistema fora do formato de e-commerce completo reduz complexidade operacional, mas limita outros tipos de venda ou integração.

## Riscos e mitigações
### Risco: conflito entre sales local e links externos
**Mitigação:** manter os fluxos separados visual e conceitualmente, com blocos claramente distintos.

### Risco: atrito na validação geográfica
**Mitigação:** usar mensagens claras, feedback visual e confirmação simples do cliente.

### Risco: gerenciamento de conteúdo disperso
**Mitigação:** centralizar no backoffice textos, PDFs, categoria e disponibilidade de produtos físicos.

### Risco: scope creep
**Mitigação:** manter a proposta fora do escopo de checkout, frete, ERP e gestão fiscal.
