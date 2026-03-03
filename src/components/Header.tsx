"use client";

import { useState } from 'react';
import LoginModal from './LoginModal';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function Header() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const { theme, toggleTheme } = usePreferences();

    return (
        <header className="fixed w-full top-0 z-50 glass-header py-4 transition-all duration-300">
            <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <img
                        src={theme === 'dark' ? '/logo spacelike.png' : '/logo spacelike light.png'}
                        alt="SpaceLike Logo"
                        className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)] group-hover:scale-105 transition-transform"
                    />
                </a>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 font-medium">
                    <a href="#services" className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors">Dịch Vụ</a>
                    <a href="#order" className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors">Nạp Tiền</a>
                    <a href="#stats" className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors">Thống Kê</a>
                    <a href="/blog" className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors">Blog</a>
                </nav>

                {/* Auth Buttons + Theme Toggle */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="relative w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-glass-card)] hover:border-brand-accent/50 transition-all duration-300 flex items-center justify-center overflow-hidden backdrop-blur-md"
                        title={theme === 'dark' ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
                    >
                        <i className={`fa-solid fa-sun text-amber-400 absolute transition-all duration-500 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'}`}></i>
                        <i className={`fa-solid fa-moon text-blue-300 absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'}`}></i>
                    </button>

                    <button
                        onClick={() => setLoginModalOpen(true)}
                        className="hidden md:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => setLoginModalOpen(true)}
                        className="px-6 py-2.5 rounded-full border border-brand-accent text-brand-accent font-semibold hover:bg-brand-accent hover:text-white transition-all shadow-neon hover:shadow-neon-intense"
                    >
                        Đăng ký <i className="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>

            {/* Login Popup */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </header>
    );
}
