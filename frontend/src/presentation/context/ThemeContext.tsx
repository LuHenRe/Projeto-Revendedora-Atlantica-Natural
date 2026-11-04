'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Aplica o tema ao elemento raiz (HTML)
  const applyTheme = useCallback((targetTheme: Theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved =
      targetTheme === 'dark' || (targetTheme === 'system' && isSystemDark) ? 'dark' : 'light';

    setResolvedTheme(resolved);

    if (resolved === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }

    // Atualiza a meta tag de color-scheme conforme especificações do navegador
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', targetTheme === 'system' ? 'light dark' : resolved);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme = 'system';
    try {
      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        initialTheme = saved;
      }
    } catch {
      // Ignora erro em ambientes restritos de armazenamento
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      try {
        const currentSaved = localStorage.getItem('theme') as Theme | null;
        if (!currentSaved || currentSaved === 'system') {
          applyTheme('system');
        }
      } catch {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const updated = (e.newValue as Theme) || 'system';
        setThemeState(updated);
        applyTheme(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [applyTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        if (newTheme === 'system') {
          localStorage.removeItem('theme');
        } else {
          localStorage.setItem('theme', newTheme);
        }
      } catch {
        // Ignora erro de gravação se cookies/storage estiverem bloqueados
      }
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}
