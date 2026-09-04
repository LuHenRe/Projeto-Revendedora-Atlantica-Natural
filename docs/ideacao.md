# 🏛️ Documentação de Arquitetura de Produto: Hub Híbrido de Curadoria (Vitrine Virtual)

## 1. Visão Geral e Regras de Negócio
Este projeto consiste na criação de um **Hub Híbrido de Curadoria (Concierge Digital)** para uma vendedora parceira de uma grande marca de cosméticos/bem-estar. O objetivo principal é unificar múltiplas frentes de monetização (todas com 100% de lucro para a vendedora) em uma única interface inteligente, eliminando a fricção de compra.

### 🎯 Objetivos Principais
*   **Venda Física (Pronta-Entrega):** Escoamento rápido do estoque local via WhatsApp (Trava geográfica estrita).
*   **Venda Online (Deep Links):** Bypass estratégico do menu hambúrguer do site oficial da matriz, entregando atalhos diretos para checkout.
*   **Catálogo Digital:** Acesso *zero-friction* à revista em PDF.
*   **Captação B2B:** Funil secundário para recrutamento de novas parceiras, isolado da jornada B2C.

---

## 2. Estratégia UX/UI: O Modelo "Bento Box"
A arquitetura da informação escolhida foge do padrão "e-commerce de lista" e adota o conceito **Bento Box** (módulos espaciais de diferentes tamanhos). 

*   **Por que funciona?** Reduz a carga cognitiva mapeando a intenção de compra instantaneamente. O usuário processa o ecossistema visualmente sem precisar navegar por menus complexos.
*   **Aceleração de Conversão:** A divisão modular permite separar ofertas de impacto local (urgência) de catálogos online (exploração) sem gerar confusão logística no cliente.

---

## 3. Wireframe Conceitual e Mapa de Componentes (Mobile-First)

A interface deve ser estruturada verticalmente, respeitando a seguinte hierarquia:

| Módulo / Bloco | Identidade Visual | Copywriting (Gatilhos) | Ação / Roteamento (UX) |
| :--- | :--- | :--- | :--- |
| **0. Header (Quebra-Gelo)** | Minimalista. Avatar circular da vendedora + Nome. | *"Curadoria de bem-estar e beleza selecionada para você."* | **Estático:** Apenas ancoragem de autoridade e confiança. |
| **1. Bloco Alfa (Estoque Físico)** | Largo (100% width). Cor quente de conversão. Micro-selo animado "⚡ Envio Imediato". | **Título:** *"Pronta-Entrega Varginha & Região: Escolha hoje, receba hoje."* <br> **Botão:** *"Ver Estoque no WhatsApp"* | **WhatsApp API:** Direciona para o mensageiro com texto pré-preenchido. Funciona como prevenção de erros (filtro geográfico pelo título). |
| **2. Blocos Beta (Online / Deep Links)** | Grid 2x2. Imagens de *lifestyle* com overlay escuro (40%) para contraste do texto branco. | *"Skincare Noturno"* <br> *"Kits & Presentes"* <br> *"Perfumes & Assinaturas"* <br> *"Favoritos da Semana"* | **Link Externo:** Card inteiro clicável (área de toque alta). Direciona direto para subcategorias do site matriz (Bypass de menu). |
| **3. Bloco Gama (Revista PDF)** | Estreito, fundo claro (Off-White). Ícone em *line-art* de uma revista. | *"Prefere a experiência clássica? Explore o nosso catálogo completo."* | **Visualizador Web:** Abre o PDF em nova aba no navegador (formato *flipbook* ou link de nuvem) para não forçar download. |
| **4. Bloco Ômega (Captação B2B)** | Rodapé. Inversão total de paleta (Dark Mode: Grafite/Azul Marinho) para quebra de padrão visual. | *"Seja dona do seu tempo. Torne-se uma curadora e lucre."* <br> **Botão:** *"Quero ser Parceira" (Ghost Button)* | **Link Externo:** Direciona para funil de recrutamento, sem canibalizar o B2C. |

---

## 4. Diretrizes de Engenharia e Avaliação de Usabilidade

Para garantir que o produto final seja altamente responsivo e sustentável, recomendamos as seguintes diretrizes de desenvolvimento e design estrutural:

### 4.1. Estrutura de Componentes
A lógica de blocos isolados do *Bento Box* é perfeitamente adequada para uma arquitetura baseada em componentes (ideal para frameworks e bibliotecas front-end como React). Cada bloco da vitrine deve ser tratado como um componente modular, permitindo a fácil atualização de links de afiliados ou imagens de fundo sem quebrar o layout global.

### 4.2. Conformidade Heurística
O desenho da interface foi validado empiricamente para gabaritar princípios clássicos de design centrado no usuário, alinhando-se diretamente às **Heurísticas de Nielsen**:
*   **Prevenção de Erros (Heurística #5):** Aplicada rigorosamente no *Bloco Alfa*. Ao cravar explicitamente o escopo geográfico no título e na identidade visual, evitamos que o cliente acione o fluxo do WhatsApp erroneamente.
*   **Flexibilidade e Eficiência de Uso (Heurística #7):** Os *Blocos Beta* atuam como "aceleradores". Eles eliminam a necessidade de o usuário decifrar o menu da loja matriz, fornecendo atalhos diretos baseados na real intenção de compra.
*   **Design Estético e Minimalista (Heurística #8):** A exclusão completa de barras laterais, banners rotativos e jargões corporativos mantém a taxa de ruído visual próxima a zero, focando exclusivamente na conversão.
