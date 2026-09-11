# Requisitos da Vitrine

## Requisitos funcionais (RF)

| ID | Descrição | Prioridade | Ator/Origem |
|----|-----------|------------|-------------|
| RF01 | Sistema deve exibir o estoque físico local disponível para venda na região de atendimento da revendedora na página principal | Alta | Cliente final |
| RF02 | Sistema deve validar/confirmar a região de atendimento antes de liberar o botão de contato via WhatsApp | Alta | Cliente final |
| RF03 | Sistema deve gerar o link do WhatsApp com mensagem pré-formatada após a confirmação da região e seleção do produto | Alta | Cliente final |
| RF04 | Sistema deve exibir blocos com links externos de categorias/produtos do site oficial da matriz para redirecionamento | Média | Cliente final |
| RF05 | Sistema deve disponibilizar o catálogo geral em PDF ou visualizador embutido na vitrine | Média | Cliente final |
| RF06 | Sistema deve exibir uma área separada de captação B2B, sem misturar com a experiência B2C | Média | Potencial parceira |
| RF07 | Sistema deve permitir que a administradora cadastre, edite e remova logicamente produtos do estoque físico e categorias | Alta | Revendedora/administradora |
| RF08 | Sistema deve permitir que a administradora atualize textos, imagens e blocos visuais da página pública | Média | Revendedora/administradora |
| RF09 | Sistema deve controlar a publicação/ocultação de itens com base no estoque e no status de disponibilidade | Alta | Sistema/Revendedora |
| RF10 | Sistema deve exigir autenticação segura para acesso à área administrativa | Alta | Revendedora/administradora |

## Requisitos não funcionais (RNF)

| ID | Descrição | Prioridade | Ator/Origem |
|----|-----------|------------|-------------|
| RNF01 | Desempenho: página inicial deve carregar em até 3s em dispositivos móveis com rede 4G, exibindo blocos principais sem bloqueio visual | Alta | Equipe |
| RNF02 | Usabilidade: interface mobile-first, com CTAs claros, áreas de toque ≥ 44px e leitura simples em tela até 360px de largura | Alta | Equipe |
| RNF03 | Segurança: rotas administrativas devem exigir autenticação e autorização, com proteção contra acesso indevido (ex: rate limit de login, sessão expirável) | Alta | Equipe |
| RNF04 | Confiabilidade: links externos e catálogo devem ser verificados para evitar quebras; erros de navegação devem ser mínimos | Média | Equipe |
| RNF05 | Manutenibilidade: frontend deve seguir componentes isolados e hooks, mantendo módulos pequenos e reutilizáveis | Média | Equipe |
| RNF06 | Integridade de dados: banco deve manter consistência do estoque físico, sem duplicidade funcional e com regras claras de publicação | Alta | Equipe |
| RNF07 | Portabilidade: vitrine deve funcionar em navegadores modernos de desktop e mobile, sem dependência de app nativo | Média | Equipe |

## Critérios de aceitação
- A página principal exibe todos os blocos principais da vitrine em layout mobile-first.
- A validação geográfica impede o fechamento via WhatsApp antes da confirmação do cliente.
- O gerenciamento de estoque físico é possível no backoffice sem alteração de código.
- Links externos abrem corretamente para o destino correto.
- O catálogo em PDF é acessível no fluxo público.
- O CTA de B2B está separado da jornada de compra do cliente final.
- O sistema mantém o foco na conversão e não em operação de e-commerce completo.