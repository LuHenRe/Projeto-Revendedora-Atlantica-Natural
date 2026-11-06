'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useVitrine } from '../../context/VitrineContext';

export function CardConsultora() {
  const { tirarDuvidaGeral, cidadeConfirmada, regiaoPadrao } = useVitrine();
  const cidade = cidadeConfirmada || regiaoPadrao;

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-background via-brand-50/30 to-background dark:via-brand-950/20 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-brand-200/80 dark:border-brand-800/80 bg-card p-6 sm:p-8 shadow-sm overflow-hidden">
          {/* Efeito sutil de brilho no fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/40 dark:bg-brand-900/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Bloco de Apresentação com Avatar / Selo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
              {/* Avatar da Consultora com Indicador Online */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl bg-brand-900 flex flex-col items-center justify-center text-white overflow-hidden p-2">
                    <span className="font-outfit font-black text-2xl tracking-tight text-gold-300">VB</span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-semibold">Consultora</span>
                  </div>
                </div>
                {/* Status Online */}
                <div
                  className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-700 shadow-xs"
                  title="Valesca está online para atendimento"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Online</span>
                </div>
              </div>

              {/* Textos de Apresentação Pessoal */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  <span>Atendimento Pessoal & Consultoria</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-foreground font-outfit">
                  Olá! Sou a <span className="text-brand-900 dark:text-brand-300">Valesca Braga dos Reis</span>
                </h3>

                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Sua revendedora autorizada Atlântica Natural em <strong className="text-foreground">{cidade} e região</strong>.
                  Ajudo você a escolher os melhores óleos essenciais, cosméticos naturais e suplementos para o seu bem-estar, com entrega rápida e atendimento direto pelo WhatsApp.
                </p>

                {/* Micro-benefícios de Confiança */}
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                    <span>Pronta-Entrega Local</span>
                  </span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                    <span>Produtos 100% Originais</span>
                  </span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Resposta Rápida</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Contato Direto */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={tirarDuvidaGeral}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Tirar Dúvidas com a Valesca</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
