'use client';

import React from 'react';
import { Sparkles, MessageCircle, ArrowDown, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/Button';
import { useVitrine } from '../../context/VitrineContext';

export function HeroBanner() {
  const { tirarDuvidaGeral } = useVitrine();

  const handleScrollProdutos = () => {
    const el = document.getElementById('secao-pronta-entrega');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-background pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-border/40">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge de Destaque */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-semibold mb-6 shadow-xs animate-in fade-in duration-500">
          <Sparkles className="w-4 h-4 text-brand-700" />
          <span>Curadoria Oficial Atlântica Natural</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight font-outfit max-w-4xl mx-auto leading-[1.15]">
          Sua Vitrine de <span className="text-brand-900 underline decoration-brand-300 decoration-wavy decoration-2">Bem-Estar</span> e Cosméticos Naturais
        </h1>

        {/* Subtítulo */}
        <p className="mt-5 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Peça óleos essenciais, perfumaria fina e suplementos para <strong>pronta-entrega</strong> com atendimento personalizado no WhatsApp.
        </p>

        {/* CTAs Principais */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <Button
            size="lg"
            variant="default"
            onClick={handleScrollProdutos}
            className="w-full sm:w-auto shadow-md hover:shadow-lg"
          >
            <span>Ver Pronta-Entrega</span>
            <ArrowDown className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="whatsapp"
            onClick={tirarDuvidaGeral}
            className="w-full sm:w-auto"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Falar com a Consultora</span>
          </Button>
        </div>

        {/* Destaques de Confiança / Proposta de Valor */}
        <div className="mt-12 pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-900 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Pronta-Entrega</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Envio ágil em Valparaíso e DF</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-100 flex items-center justify-center text-gold-900 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">100% Originais</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Direto da fábrica Atlântica</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-900 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Atendimento Humano</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Tire dúvidas no WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

