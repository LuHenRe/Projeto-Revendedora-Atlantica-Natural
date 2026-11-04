'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        title={
          resolvedTheme === 'dark'
            ? 'Ativar modo claro'
            : 'Ativar modo escuro'
        }
        aria-label={
          resolvedTheme === 'dark'
            ? 'Ativar modo claro'
            : 'Ativar modo escuro'
        }
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-brand-900 transition-transform duration-300 hover:-rotate-12" />
        )}
      </button>
    </div>
  );
}
