'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useVitrine } from '../../context/VitrineContext';

export function ModalTravaGeografica() {
  const { isModalAberta, fecharModalTrava, confirmarRegiao, regiaoPadrao } = useVitrine();
  const [cidadeInput, setCidadeInput] = useState('');
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const sugestoesRapidas = ['Valparaíso de Goiás', 'Brasília / DF', 'Luziânia', 'Novo Gama'];

  const handleValidar = (cidade: string) => {
    if (!cidade.trim()) {
      setMensagemErro('Por favor, informe sua cidade.');
      return;
    }

    const res = confirmarRegiao(cidade);
    if (!res.autorizado) {
      setMensagemErro(res.mensagemOrientacao || 'Região fora do raio de pronta-entrega.');
    } else {
      setMensagemErro(null);
      setCidadeInput('');
    }
  };

  return (
    <Dialog open={isModalAberta} onOpenChange={fecharModalTrava}>
      <DialogHeader>
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-900 mb-2">
          <MapPin className="w-6 h-6" />
        </div>
        <DialogTitle>Qual é a sua cidade?</DialogTitle>
        <DialogDescription>
          Nosso estoque de pronta-entrega com envio imediato atende exclusivamente{' '}
          <strong className="text-foreground">{regiaoPadrao}</strong>.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
            Digite sua cidade ou região
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Valparaíso, Brasília, Gama..."
              value={cidadeInput}
              onChange={(e) => {
                setCidadeInput(e.target.value);
                setMensagemErro(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleValidar(cidadeInput);
              }}
            />
            <Button
              variant="default"
              onClick={() => handleValidar(cidadeInput)}
              className="shrink-0"
            >
              Confirmar
            </Button>
          </div>
        </div>

        <div>
          <span className="text-xs text-muted-foreground block mb-2">Sugestões rápidas:</span>
          <div className="flex flex-wrap gap-2">
            {sugestoesRapidas.map((sugestao) => (
              <button
                key={sugestao}
                onClick={() => {
                  setCidadeInput(sugestao);
                  handleValidar(sugestao);
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-900 transition-colors font-medium cursor-pointer"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>

        {mensagemErro && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{mensagemErro}</p>
            </div>
            <div className="pt-2 border-t border-amber-200/60 flex justify-end">
              <a
                href="https://atlanticanaturalbr.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
              >
                Comprar com frete no Site Oficial da Marca
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

