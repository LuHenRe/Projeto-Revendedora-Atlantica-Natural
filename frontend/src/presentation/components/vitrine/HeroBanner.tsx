'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, ArrowRight, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';
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
    <section className="relative overflow-hidden py-4 sm:py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card em Destaque (Inspirado no estilo Relva Verde com produtos à esquerda e chamada à direita) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-800/40 bg-gradient-to-br from-brand-950 via-[#0d2a18] to-brand-900 text-white">
          {/* Efeitos de Luz e Bokeh no Fundo */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/3 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px] lg:min-h-[480px]">
            {/* Coluna da Imagem em Destaque (Primeira Imagem: Azeite, Manjericão, Tomates na Mesa Rústica) */}
            <div className="relative lg:col-span-6 min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden">
              <Image
                src="/images/hero-destaque.jpg"
                alt="Produtos Naturais e Bem-Estar Atlântica Natural"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />

              {/* Degradê Suave de Transição para o Conteúdo de Texto */}
              <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent via-[#0d2a18]/60 to-[#0d2a18] pointer-events-none" />
              <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d2a18] via-[#0d2a18]/80 to-transparent pointer-events-none" />

              {/* Tag Flutuante sobre a imagem */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-emerald-300 border border-white/10 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Puro & Terapêutico</span>
              </div>
            </div>

            {/* Coluna de Texto e Chamada de Destaque (Estilo Relva Verde com alta legibilidade e botão branco de impacto) */}
            <div className="relative z-10 lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* Título Principal de Alto Impacto */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit leading-[1.15]">
                Sua Vitrine de <span className="text-emerald-300">Bem-Estar</span> e Cosméticos Naturais
              </h1>

              {/* Subtítulo Descritivo */}
              <p className="mt-4 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                Peça óleos essenciais, perfumaria fina e suplementos para <strong>pronta-entrega</strong> com atendimento personalizado no WhatsApp.
              </p>

              {/* Botões de Ação com Estilo de Alto Destaque (Inspirado no botão "SAIBA COMO" do print) */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={handleScrollProdutos}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-brand-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-outfit"
                >
                  <span>Ver Pronta-Entrega</span>
                  <ArrowRight className="w-4 h-4 text-brand-950" />
                </button>

                <button
                  onClick={tirarDuvidaGeral}
                  className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar com a Consultora</span>
                </button>
              </div>

              {/* Destaques de Confiança / Proposta de Valor Integrados ao Banner */}
              <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pronta-Entrega</h4>
                    <p className="text-[10px] text-emerald-200/70 hidden sm:block">Envio ágil na região</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-gold-300 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% Originais</h4>
                    <p className="text-[10px] text-emerald-200/70 hidden sm:block">Direto da fábrica</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Atendimento</h4>
                    <p className="text-[10px] text-emerald-200/70 hidden sm:block">Via WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
