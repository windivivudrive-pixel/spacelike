"use client";

import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { usePreferences } from '@/contexts/PreferencesContext';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ThemeLogo from './ThemeLogo';

export default function Header() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const { theme, toggleTheme } = usePreferences();
    const [session, setSession] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState('/avartar.png');
    const [balance, setBalance] = useState<number>(0);
    const [userName, setUserName] = useState<string>('');
    const [loadingAuth, setLoadingAuth] = useState(true);
    const { formatCurrency } = usePreferences();

    const supabase = createClient();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session?.user) {
                const userMetadata = session.user.user_metadata;
                if (userMetadata?.avatar_url) {
                    setAvatarUrl(userMetadata.avatar_url);
                }

                const displayName = userMetadata?.full_name || userMetadata?.name || session.user.email || 'User';
                setUserName(displayName);

                // Fetch balance
                const { data } = await supabase.from('profiles').select('balance').eq('id', session.user.id).single();
                if (data && data.balance !== undefined) {
                    setBalance(Number(data.balance));
                }
            }

            setLoadingAuth(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                if (session?.user) {
                    const userMetadata = session.user.user_metadata;
                    if (userMetadata?.avatar_url) {
                        setAvatarUrl(userMetadata.avatar_url);
                    }
                    const displayName = userMetadata?.full_name || userMetadata?.name || session.user.email || 'User';
                    setUserName(displayName);

                    const { data } = await supabase.from('profiles').select('balance').eq('id', session.user.id).single();
                    if (data && data.balance !== undefined) {
                        setBalance(Number(data.balance));
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Realtime subscription for balance updates
    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = supabase.channel('header_realtime_profile_balance')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${session.user.id}`
                },
                (payload) => {
                    const newProfile = payload.new;
                    if (newProfile && newProfile.balance !== undefined) {
                        setBalance(Number(newProfile.balance));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setIsAvatarDropdownOpen(false);
    };

    return (
        <header className="fixed w-full top-0 z-50 glass-header py-4 transition-all duration-300">
            <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <ThemeLogo className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)] group-hover:scale-105 transition-transform" />
                </Link>

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

                    {!loadingAuth && (
                        session ? (
                            <div className="hidden md:flex items-center gap-4 pl-4 border-l border-[var(--border-color)] relative">
                                <button
                                    onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                                    className="flex items-center gap-3 relative focus:outline-none group p-1"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FF4500] m-[1px]"></div>
                                        <img
                                            src={avatarUrl}
                                            alt="User Avatar"
                                            className="relative w-10 h-10 rounded-full object-cover border-2 border-black bg-black transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#FF4B4B] border-2 border-black z-10 transition-transform group-hover:scale-110"></div>
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <div className="font-display font-bold text-sm text-[var(--text-primary)] leading-tight truncate max-w-[120px]">
                                            {userName}
                                        </div>
                                        <div className="text-[var(--text-secondary)] font-medium text-xs">
                                            {formatCurrency(balance)}
                                        </div>
                                    </div>
                                </button>

                                {/* Avatar Dropdown */}
                                {isAvatarDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-4 w-48 bg-[var(--dropdown-bg)] border border-[var(--border-color)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsAvatarDropdownOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--table-hover)] transition-colors text-[var(--text-primary)]"
                                        >
                                            <i className="fa-solid fa-chart-line w-4"></i>
                                            <span className="font-medium text-sm">Trang Quản Trị</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-[var(--table-hover)] hover:text-red-400 transition-colors"
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket w-4"></i>
                                            <span className="font-medium text-sm">Đăng Xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className="hidden md:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className="hidden md:inline-flex px-6 py-2.5 rounded-full border border-brand-accent text-brand-accent font-semibold hover:bg-brand-accent hover:text-white transition-all shadow-neon hover:shadow-neon-intense items-center"
                                >
                                    Đăng ký <i className="fa-solid fa-arrow-right ml-1"></i>
                                </button>
                            </>
                        )
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-10 h-10 rounded-xl bg-[var(--bg-glass-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] hover:border-brand-accent/50 transition-colors"
                    >
                        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[var(--border-color)] shadow-xl animate-in fade-in slide-in-from-top-2">
                    <nav className="flex flex-col py-4 px-6 gap-4 font-medium">
                        <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors py-2 border-b border-white/5 pb-2">Dịch Vụ</a>
                        <a href="#order" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors py-2 border-b border-white/5 pb-2">Nạp Tiền</a>
                        <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors py-2 border-b border-white/5 pb-2">Thống Kê</a>
                        <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors py-2 border-b border-white/5 pb-2">Blog</a>
                        {!loadingAuth && (
                            session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-left py-2 px-1 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 pb-2 group"
                                    >
                                        <div className="relative shrink-0">
                                            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-50 blur-xs group-hover:opacity-100 transition-opacity"></div>
                                            <img src={avatarUrl} alt="Avatar" className="relative w-10 h-10 rounded-full border border-black bg-black object-cover" />
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FF4B4B] border border-black z-10 group-hover:scale-110 transition-transform"></div>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-medium text-[var(--text-primary)] text-sm truncate">{userName}</span>
                                            <span className="text-xs text-[var(--text-secondary)] truncate">{formatCurrency(balance)}</span>
                                            <span className="text-[10px] text-brand-accent mt-0.5 uppercase tracking-wider font-semibold">Trang Quản Trị &rarr;</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-left py-2 text-red-500 hover:text-red-400 font-medium transition-colors border-b border-red-500/20 pb-2 flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { setLoginModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="text-left py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors border-b border-white/5 pb-2"
                                    >
                                        Đăng nhập
                                    </button>
                                    <button
                                        onClick={() => { setLoginModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="text-center mt-2 px-6 py-2.5 rounded-full border border-brand-accent text-brand-accent font-semibold hover:bg-brand-accent hover:text-white transition-all shadow-neon"
                                    >
                                        Đăng ký
                                    </button>
                                </>
                            )
                        )}
                    </nav>
                </div>
            )}

            {/* Login Popup */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />
        </header>
    );
}
