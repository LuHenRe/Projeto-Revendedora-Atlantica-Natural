'use client';

import React from 'react';
import { Users, TrendingUp, BookOpen, Award, ArrowRight } from 'lucide-react';
import { env } from '../../../infrastructure/config/env';
import { Button } from '../ui/Button';
import { AnalyticsTracker } from '../../../infrastructure/analytics/tracker';

export function BlocoB2B() {
  const handleRecrutamentoClick = () => {
    AnalyticsTracker.track('clique_b2b_recrutamento');
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50/50 via-white to-gold-50/30 p-8 sm:p-12 lg:p-16 shadow-soft flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Textos Informativos */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold mb-4 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Oportunidade de Negócio B2B</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground font-outfit tracking-tight">
              Seja uma Revendedora Parceira Atlântica Natural
            </h2>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Conquiste sua independência financeira revendendo produtos de altíssima demanda, com suporte especializado, materiais de apoio e plano de carreira estruturado.
            </p>

            {/* Pilares */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white border border-border shadow-xs">
                <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-semibold text-sm text-foreground">Alta Lucratividade</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Até 100% de margem na revenda</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-border shadow-xs">
                <BookOpen className="w-5 h-5 text-brand-700 mb-2" />
                <h4 className="font-semibold text-sm text-foreground">Capacitação</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Treinamentos sobre aromaterapia</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-border shadow-xs">
                <Award className="w-5 h-5 text-gold-600 mb-2" />
                <h4 className="font-semibold text-sm text-foreground">Suporte Regional</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Mentoria direta para decolar</p>
              </div>
            </div>
          </div>

          {/* CTA de Inscrição/Conversa */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
            <a
              href={env.linkRecrutamentoB2b}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRecrutamentoClick}
              className="w-full sm:w-80"
            >
              <Button
                variant="default"
                size="lg"
                className="w-full shadow-md hover:shadow-lg font-bold gap-3"
              >
                <span>Quero Ser uma Revendedora</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <span className="text-xs text-muted-foreground mt-3 text-center">
              Fale diretamente com nossa liderança de expansão no WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

