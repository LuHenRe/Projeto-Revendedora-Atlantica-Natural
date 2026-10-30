import * as React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pronta-entrega' | 'matriz' | 'destaque' | 'esgotado' | 'outline' | 'success' | 'destructive';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors';

  const variants = {
    default: 'bg-brand-100 text-brand-900 border border-brand-200',
    'pronta-entrega':
      'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold shadow-xs',
    matriz: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
    destaque: 'bg-gold-100 text-gold-900 border border-gold-300 font-semibold',
    esgotado: 'bg-gray-100 text-gray-500 border border-gray-200',
    outline: 'border border-border text-foreground',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold',
    destructive: 'bg-red-50 text-red-700 border border-red-200/80 font-semibold',
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {variant === 'pronta-entrega' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      {children}
    </div>
  );
}

