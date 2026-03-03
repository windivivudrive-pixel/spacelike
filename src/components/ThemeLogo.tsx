"use client";

import { usePreferences } from '@/contexts/PreferencesContext';

export default function ThemeLogo({ className = "h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)]" }: { className?: string }) {
    const { theme } = usePreferences();
    return (
        <img
            src={theme === 'dark' ? '/logo spacelike.png' : '/logo spacelike light.png'}
            alt="SpaceLike Logo"
            className={className}
        />
    );
}
