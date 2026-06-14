'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'fr', toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const toggle = () => setLang(l => (l === 'fr' ? 'en' : 'fr'));
  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
