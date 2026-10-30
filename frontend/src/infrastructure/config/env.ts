export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5561999999999',
  cidadeAtendimento: process.env.NEXT_PUBLIC_CIDADE_ATENDIMENTO || 'Valparaíso de Goiás e DF/Entorno',
  linkCatalogoPdf: process.env.NEXT_PUBLIC_LINK_CATALOGO_PDF || 'https://atlanticanaturalbr.com.br/catalogo-digital.pdf',
  linkRecrutamentoB2b: process.env.NEXT_PUBLIC_LINK_RECRUTAMENTO_B2B || 'https://wa.me/5561999999999?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20como%20me%20tornar%20uma%20revendedora%20Atl%C3%A2ntica%20Natural.',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
};
