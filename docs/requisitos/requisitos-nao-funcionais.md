# Requisitos Não Funcionais

> Requisitos não funcionais priorizados para o sistema atual, com destaque aos 3 critérios principais exigidos para a operação mobile-first da vitrine.

## RNF01 - Usabilidade Mobile-First e Baixa Fricção (Principal)
A interface pública da vitrine deve ser projetada prioritariamente para smartphones, com tipografia legível, botões de chamada para ação (CTAs) amplos e bem espaçados, suporte a tema claro/escuro e fluxo direto de validação geográfica via modal.

## RNF02 - Segurança e Controle de Acesso no Backoffice (Principal)
As operações de escrita no painel administrativo (produtos, upload de imagens, categorias e destaques da matriz) devem exigir token JWT válido emitido pela API (`OAuth2/Bearer`) e proteção de rotas no frontend via middleware e cookies `HttpOnly`.

## RNF03 - Desempenho e Carregamento Ágil em Redes Móveis (Principal)
A página inicial da vitrine deve utilizar renderização no servidor com revalidação incremental (ISR) e payloads enxutos para carregar em menos de 3 segundos em conexões 4G, mantendo alta conversão.

## RNF04 - Integridade de Domínio e Consistência de Dados
As entidades e *Value Objects* devem validar invariantes de negócio (preço não negativo, estoque não negativo, URLs HTTP/HTTPS válidas, nome obrigatório), impedindo persistência ou exibição de estados inválidos.

## RNF05 - Manutenibilidade e Arquitetura em Camadas
Tanto o backend (FastAPI) quanto o frontend (Next.js) devem seguir separação clara entre Domínio, Aplicação, Infraestrutura e Apresentação (*Clean Architecture*), favorecendo testes automatizados e evolução modular.

## RNF06 - Confiabilidade das Conversões Externas
Os links gerados para WhatsApp (`wa.me` com codificação URI) e os redirecionamentos para a loja matriz e catálogo PDF devem ser validados e isolados em camadas específicas, evitando quebra dos canais de venda.

## RNF07 - Portabilidade entre Navegadores e Dispositivos
A aplicação web responsiva deve operar em navegadores modernos de desktop e dispositivos móveis (Android/iOS) sem necessidade de instalação de aplicativo nativo.

## RNF08 - Desacoplamento de Integrações Externas
A coleta de metadados do site da matriz (*Web Scraping*) e a abertura do WhatsApp devem permanecer desacopladas das regras centrais de estoque local, evitando que instabilidades externas comprometam a vitrine local.
