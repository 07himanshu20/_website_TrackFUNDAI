'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  toggleTheme: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} });

export const useTheme = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('tfai-theme') : null) as Theme | null;
    const next = saved ?? 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('tfai-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  if (!mounted) return null;

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}
