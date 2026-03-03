"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from '@/lib/translations';

type Language = 'VI' | 'EN';
type Currency = 'VND' | 'USD';
type Theme = 'dark' | 'light';

interface PreferencesContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    currency: Currency;
    setCurrency: (curr: Currency) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    // Helper formats
    formatCurrency: (amount: number) => string;
    // Translator
    t: (key: TranslationKey) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('VI');
    const [currency, setCurrency] = useState<Currency>('VND');
    const [theme, setTheme] = useState<Theme>('dark');

    // Exchange rate placeholder (VND per USD)
    const exchangeRate = 26000;

    // Load from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('smm_language') as Language;
        const savedCurr = localStorage.getItem('smm_currency') as Currency;
        const savedTheme = localStorage.getItem('smm_theme') as Theme;
        if (savedLang) setLanguage(savedLang);
        if (savedCurr) setCurrency(savedCurr);
        if (savedTheme) setTheme(savedTheme);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('smm_language', language);
        localStorage.setItem('smm_currency', currency);
        localStorage.setItem('smm_theme', theme);
    }, [language, currency, theme]);

    // Apply theme class to document
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Format helper based on current selection (base amounts are stored in VND)
    const formatCurrency = (amountInVND: number) => {
        if (currency === 'VND') {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amountInVND);
        } else {
            const amountInUSD = amountInVND / exchangeRate;
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountInUSD);
        }
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return (
        <PreferencesContext.Provider value={{ language, setLanguage, currency, setCurrency, theme, setTheme, toggleTheme, formatCurrency, t }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
}
