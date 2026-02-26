"use client";

import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Header() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    return (
        <header className="fixed w-full top-0 z-50 glass-header py-4 transition-all duration-300">
            <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <img
                        src="/logo spacelike.png"
                        alt="SpaceLike Logo"
                        className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)] group-hover:scale-105 transition-transform"
                    />
                </a>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 font-medium">
                    <a href="#services" className="text-gray-300 hover:text-brand-accent transition-colors">Dịch Vụ</a>
                    <a href="#order" className="text-gray-300 hover:text-brand-accent transition-colors">Nạp Tiền</a>
                    <a href="#stats" className="text-gray-300 hover:text-brand-accent transition-colors">Thống Kê</a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setLoginModalOpen(true)}
                        className="hidden md:block text-gray-400 hover:text-white font-medium transition-colors"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => setLoginModalOpen(true)}
                        className="px-6 py-2.5 rounded-full border border-brand-accent text-brand-accent font-semibold hover:bg-brand-accent hover:text-brand-dark transition-all shadow-neon hover:shadow-neon-intense"
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
