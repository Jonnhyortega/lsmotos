"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONTENT_ES } from '@/constants/locales/es';
import { CONTENT_EN } from '@/constants/locales/en';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  content: typeof CONTENT_ES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  // Simple content selection
  const content = language === 'es' ? CONTENT_ES : CONTENT_EN;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
