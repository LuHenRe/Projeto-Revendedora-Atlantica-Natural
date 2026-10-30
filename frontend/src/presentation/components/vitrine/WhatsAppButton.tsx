'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface WhatsAppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WhatsAppButton({
  children,
  label = 'Pedir no WhatsApp',
  size = 'md',
  className,
  ...props
}: WhatsAppButtonProps) {
  return (
    <Button
      variant="whatsapp"
      size={size}
      className={cn('w-full group shadow-md hover:shadow-lg', className)}
      {...props}
    >
      <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span>{children || label}</span>
    </Button>
  );
}

