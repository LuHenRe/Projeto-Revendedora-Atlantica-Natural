import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'whatsapp' | 'outline' | 'secondary' | 'ghost' | 'gold' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      default: 'bg-brand-900 text-white hover:bg-brand-800 focus-visible:ring-brand-700 shadow-sm',
      whatsapp:
        'bg-[#25D366] text-white hover:bg-[#1ebd5a] focus-visible:ring-[#25D366] shadow-soft shadow-whatsapp/20 font-semibold',
      outline:
        'border border-border bg-white text-foreground hover:bg-muted/60 focus-visible:ring-brand-700',
      secondary:
        'bg-brand-50 text-brand-900 hover:bg-brand-100 focus-visible:ring-brand-500',
      ghost: 'text-foreground hover:bg-muted focus-visible:ring-brand-500',
      gold: 'bg-gold-500 text-white hover:bg-gold-600 focus-visible:ring-gold-400 font-semibold shadow-sm',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5 font-medium',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

