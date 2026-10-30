import { env } from '../config/env';

export type EventoConversao =
  | 'lead_whatsapp_direto'
  | 'lead_whatsapp_sacola'
  | 'click_afiliado_matriz'
  | 'download_catalogo_pdf'
  | 'clique_b2b_recrutamento';

export interface ParametrosEvento {
  produtoId?: string;
  produtoNome?: string;
  valor?: number;
  cidade?: string;
  urlAfiliada?: string;
  quantidadeItens?: number;
}

export class AnalyticsTracker {
  static track(evento: EventoConversao, params?: ParametrosEvento): void {
    if (typeof window === 'undefined') return;

    // Log em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] ${evento}`, params);
    }

    // Google Analytics (gtag)
    if (env.gaId && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', evento, {
        event_category: 'Conversão Vitrine',
        event_label: params?.produtoNome || evento,
        value: params?.valor,
        ...params,
      });
    }

    // Meta Pixel (fbq)
    if (env.metaPixelId && typeof (window as any).fbq === 'function') {
      if (evento === 'lead_whatsapp_direto' || evento === 'lead_whatsapp_sacola') {
        (window as any).fbq('track', 'Contact', {
          content_name: params?.produtoNome || 'Pedido Vitrine',
          value: params?.valor,
          currency: 'BRL',
        });
      } else if (evento === 'click_afiliado_matriz') {
        (window as any).fbq('trackCustom', 'OutboundAffiliateClick', params);
      }
    }
  }
}

