"use client";

import { useState, useRef, useEffect } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ userName, initialBalance, userId, userEmail, avatarUrl = '/avartar.png', userRole = 'member' }: { userName: string, initialBalance: number, userId?: string, userEmail?: string, avatarUrl?: string, userRole?: string }) {
    const { currency, setCurrency, language, setLanguage, formatCurrency, theme, toggleTheme } = usePreferences();
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [balance, setBalance] = useState<number>(initialBalance || 0);
    const [providerBalance, setProviderBalance] = useState<number | null>(null);

    const router = useRouter();
    const supabase = createClient();

    // Subscribe to balance updates via Supabase Realtime
    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel('realtime_profile_balance')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                },
                (payload) => {
                    const newProfile = payload.new;
                    if (newProfile && newProfile.balance !== undefined) {
                        setBalance(newProfile.balance);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    // Fetch provider balance if user is admin
    useEffect(() => {
        if (userRole === 'admin') {
            const fetchProviderBalance = async () => {
                try {
                    const res = await fetch('/api/provider/balance', {
                        method: 'POST',
                    });
                    const data = await res.json();
                    if (data.balanceVND !== undefined) {
                        setProviderBalance(parseFloat(data.balanceVND));
                    } else if (data.balance) {
                        setProviderBalance(parseFloat(data.balance));
                    }
                } catch (error) {
                    console.error('Failed to fetch provider balance', error);
                }
            };
            fetchProviderBalance();
        }
    }, [userEmail]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex items-center gap-3 md:gap-6">

            {/* Action Buttons Group */}
            <div className="flex items-center gap-3">
                {/* Currency Selector */}
                <div className="relative hidden md:block">
                    <button
                        onClick={() => { setCurrencyOpen(!currencyOpen); setLanguageOpen(false); setAvatarOpen(false); }}
                        className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-glass-card)] hover:bg-[var(--table-hover)] transition-colors backdrop-blur-md"
                    >
                        {currency === 'VND' ? (
                            <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-5 h-5 rounded-sm object-cover" />
                        ) : (
                            <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-5 rounded-sm object-cover" />
                        )}
                        <span className="font-bold text-[var(--text-primary)] text-sm tracking-wide">{currency}</span>
                    </button>

                    {currencyOpen && (
                        <div className="absolute top-full lg:left-0 right-0 mt-2 w-32 bg-[var(--dropdown-bg)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setCurrency('VND'); setCurrencyOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--table-hover)] transition-colors">
                                <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-[var(--text-primary)] text-sm">VND</span>
                            </button>
                            <button onClick={() => { setCurrency('USD'); setCurrencyOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--table-hover)] transition-colors">
                                <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-[var(--text-primary)] text-sm">USD</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Language Selector */}
                <div className="relative hidden md:block">
                    <button
                        onClick={() => { setLanguageOpen(!languageOpen); setCurrencyOpen(false); setAvatarOpen(false); }}
                        className="w-11 h-7 rounded-sm bg-brand-accent/20 flex items-center justify-center hover:bg-brand-accent/30 transition-colors border border-brand-accent/40 shadow-[0_0_15px_rgba(236,57,44,0.15)] group overflow-hidden"
                    >
                        {language === 'VI' ? (
                            <img src="https://flagcdn.com/w40/vn.png" alt="VI" className="w-full h-full object-cover" />
                        ) : (
                            <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-full h-full object-cover" />
                        )}
                    </button>
                    {languageOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-[var(--dropdown-bg)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setLanguage('VI'); setLanguageOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--table-hover)] transition-colors">
                                <img src="https://flagcdn.com/w40/vn.png" alt="VI" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-[var(--text-primary)] text-sm">Việt Nam</span>
                            </button>
                            <button onClick={() => { setLanguage('EN'); setLanguageOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--table-hover)] transition-colors">
                                <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-[var(--text-primary)] text-sm">English</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => { toggleTheme(); setCurrencyOpen(false); setLanguageOpen(false); setAvatarOpen(false); }}
                    className="relative w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-glass-card)] hover:border-brand-accent/50 transition-all duration-300 flex items-center justify-center group overflow-hidden"
                    title={theme === 'dark' ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
                >
                    {/* Sun Icon */}
                    <i className={`fa-solid fa-sun text-amber-400 absolute transition-all duration-500 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-50'}`}></i>
                    {/* Moon Icon */}
                    <i className={`fa-solid fa-moon text-blue-300 absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'}`}></i>
                </button>
            </div>

            {/* Avatar & User Details */}
            <div className="relative flex items-center gap-3 ml-2 lg:ml-4 sm:border-l border-[var(--border-color)] pl-2 lg:pl-4">
                <button
                    onClick={() => { setAvatarOpen(!avatarOpen); setCurrencyOpen(false); setLanguageOpen(false); }}
                    className="relative focus:outline-none group p-1"
                >
                    {/* Glowing Orange border */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FF4500] opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFA500] to-[#FF4500] m-[1px]"></div>

                    {/* The Avatar Image itself */}
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="relative w-10 h-10 rounded-full object-cover border-2 border-black bg-black transition-transform group-hover:scale-105"
                    />

                    {/* Status Dot (Pink/Red like screenshot) */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#FF4B4B] border-2 border-black z-10 transition-transform group-hover:scale-110"></div>
                </button>

                <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                        <div className="font-display font-bold text-lg text-[var(--text-primary)] leading-tight">
                            {userName}
                        </div>
                        {userRole === 'admin' && (
                            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-wider">
                                Admin
                            </span>
                        )}
                    </div>
                    {providerBalance !== null && (
                        <div className="mt-0.5">
                            <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full border border-brand-accent/40 font-medium">
                                Gốc: {formatCurrency(providerBalance)}
                            </span>
                        </div>
                    )}
                    <div className="text-[var(--text-secondary)] font-medium text-sm mt-0.5">
                        {formatCurrency(balance)}
                    </div>
                </div>

                {/* Avatar Dropdown */}
                {avatarOpen && (
                    <div className="absolute top-full right-0 mt-4 w-52 md:w-48 bg-[var(--dropdown-bg)] border border-[var(--border-color)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-[var(--border-color)] sm:hidden">
                            <p className="text-sm text-[var(--text-primary)] font-medium truncate">{userName}</p>
                            <p className="text-xs text-[var(--text-secondary)] truncate">{formatCurrency(balance)}</p>
                        </div>

                        {/* Mobile Language and Currency Selectors */}
                        <div className="md:hidden border-b border-[var(--border-color)] py-2">
                            {/* Mobile Currency Option */}
                            <div className="px-4 py-2">
                                <p className="text-[10px] text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-semibold">Tiền tệ</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setCurrency('VND'); setAvatarOpen(false); }}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${currency === 'VND' ? 'bg-brand-accent/20 border border-brand-accent/30 text-brand-accent' : 'bg-[var(--bg-glass-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-4 h-4 rounded-sm object-cover" />
                                        <span className="font-bold text-xs">VND</span>
                                    </button>
                                    <button
                                        onClick={() => { setCurrency('USD'); setAvatarOpen(false); }}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${currency === 'USD' ? 'bg-brand-accent/20 border border-brand-accent/30 text-brand-accent' : 'bg-[var(--bg-glass-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-4 h-4 rounded-sm object-cover" />
                                        <span className="font-bold text-xs">USD</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Language Option */}
                            <div className="px-4 py-2">
                                <p className="text-[10px] text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-semibold">Ngôn ngữ</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setLanguage('VI'); setAvatarOpen(false); }}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${language === 'VI' ? 'bg-brand-accent/20 border border-brand-accent/30 text-brand-accent' : 'bg-[var(--bg-glass-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <img src="https://flagcdn.com/w40/vn.png" alt="VI" className="w-4 h-4 rounded-sm object-cover" />
                                        <span className="font-bold text-xs">VI</span>
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('EN'); setAvatarOpen(false); }}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${language === 'EN' ? 'bg-brand-accent/20 border border-brand-accent/30 text-brand-accent' : 'bg-[var(--bg-glass-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-4 h-4 rounded-sm object-cover" />
                                        <span className="font-bold text-xs">EN</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-[var(--table-hover)] hover:text-red-400 transition-colors">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            <span className="font-medium text-sm">Đăng Xuất</span>
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
