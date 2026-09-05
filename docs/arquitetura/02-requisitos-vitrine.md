# Requisitos da Vitrine

## Requisitos funcionais

### RF01 - Exibir estoque físico local na vitrine
O sistema deve apresentar os produtos físicos disponíveis para venda na região de atendimento da revendedora.

### RF02 - Validar região de atendimento antes do WhatsApp
O sistema deve bloquear o botão de contato até que o usuário confirme ou informe a cidade/região de atendimento permitida.

### RF03 - Redirecionar para WhatsApp com mensagem pré-formatada
Ao confirmar a região e selecionar um produto, o sistema deve gerar um link para WhatsApp com mensagem pronta para atendimento.

### RF04 - Exibir blocos de links externos de afiliada
O sistema deve mostrar blocos com links de categorias ou produtos do site oficial da matriz para redirecionamento direto.

### RF05 - Exibir catálogo em PDF na página
O sistema deve disponibilizar o catálogo geral em PDF ou visualizador embutido para consulta do cliente.

### RF06 - Exibir bloco de captação B2B
O sistema deve disponibilizar uma área separada para captar novas parceiras, sem misturar com a experiência B2C.

### RF07 - Gerenciar catálogo físico por backoffice
O administrador deve poder cadastrar, editar e remover logicamente produtos do estoque físico e suas categorias.

### RF08 - Gerenciar conteúdo da vitrine
O administrador deve conseguir atualizar textos, imagens e blocos visuais da página pública.

### RF09 - Publicar e ocultar produtos conforme disponibilidade
O sistema deve controlar a publicação de itens com base no estoque e no status de disponibilidade.

### RF10 - Acessar área administrativa com autenticação
A área administrativa deve exigir autenticação segura para proteger os dados operacionais e o conteúdo da vitrine.

## Requisitos não funcionais

### RNF01 - Performance
A página inicial deve carregar rapidamente em dispositivos móveis, com foco em tempo de resposta e experiência fluida.

### RNF02 - Usabilidade mobile-first
A interface deve ser pensada para uso em celular, com CTAs claros, espaço de toque adequado e leitura simples.

### RNF03 - Segurança
As rotas administrativas devem exigir autenticação e autorização adequadas, com proteção contra acessos indevidos.

### RNF04 - Confiabilidade
A sequência de conversão deve evitar erros de navegação, bloqueios indevidos e links quebrados.

### RNF05 - Manutenibilidade
O frontend deve seguir componentes isolados e hooks para manter o código modular, escalável e fácil de evoluir.

### RNF06 - Integridade de dados
O banco deve manter consistência no estoque físico, com regras claras de publicação e ausência de duplicidade funcional.

## Critérios de aceitação
- A página principal exibe todos os blocos principais da vitrine em layout mobile-first.
- A validação geográfica impede o fechamento via WhatsApp antes da confirmação do cliente.
- O gerenciamento de estoque físico é possível no backoffice sem alteração de código.
- Links externos abrem corretamente para o destino correto.
- O catálogo em PDF é acessível no fluxo público.
- O CTA de B2B está separado da jornada de compra do cliente final.
- O sistema mantém o foco na conversão e não em operação de e-commerce completo.
