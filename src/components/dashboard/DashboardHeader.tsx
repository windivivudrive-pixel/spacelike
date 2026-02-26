"use client";

import { useState, useRef, useEffect } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ userName, initialBalance, userId, userEmail }: { userName: string, initialBalance: number, userId?: string, userEmail?: string }) {
    const { currency, setCurrency, language, setLanguage, formatCurrency } = usePreferences();
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
        if (userEmail === 'quochungdn151@gmail.com') {
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
                <div className="relative">
                    <button
                        onClick={() => { setCurrencyOpen(!currencyOpen); setLanguageOpen(false); setAvatarOpen(false); }}
                        className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full border border-white/20 bg-black/40 hover:bg-white/5 transition-colors backdrop-blur-md"
                    >
                        {currency === 'VND' ? (
                            <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-5 h-5 rounded-sm object-cover" />
                        ) : (
                            <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-5 rounded-sm object-cover" />
                        )}
                        <span className="font-bold text-white text-sm tracking-wide">{currency}</span>
                    </button>

                    {currencyOpen && (
                        <div className="absolute top-full lg:left-0 right-0 mt-2 w-32 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setCurrency('VND'); setCurrencyOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-white text-sm">VND</span>
                            </button>
                            <button onClick={() => { setCurrency('USD'); setCurrencyOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-white text-sm">USD</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Language Selector */}
                <div className="relative">
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
                        <div className="absolute top-full right-0 mt-2 w-32 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setLanguage('VI'); setLanguageOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                <img src="https://flagcdn.com/w40/vn.png" alt="VI" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-white text-sm">Việt Nam</span>
                            </button>
                            <button onClick={() => { setLanguage('EN'); setLanguageOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                                <img src="https://flagcdn.com/w40/us.png" alt="EN" className="w-5 h-5 rounded-sm object-cover" />
                                <span className="font-medium text-white text-sm">English</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Avatar & User Details */}
            <div className="relative flex items-center gap-3 ml-2 lg:ml-6 pl-2 lg:pl-6 sm:border-l border-white/10">
                <button
                    onClick={() => { setAvatarOpen(!avatarOpen); setCurrencyOpen(false); setLanguageOpen(false); }}
                    className="relative focus:outline-none group"
                >
                    {/* Glowing Cyan/Blue border like in the screenshot */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#2962FF] opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#2962FF] m-[1px]"></div>

                    {/* The Avatar Image itself */}
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                        alt="User Avatar"
                        className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-black bg-black transition-transform group-hover:scale-105"
                    />

                    {/* Status Dot (Pink/Red like screenshot) */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#FF4B4B] border-2 border-black z-10 transition-transform group-hover:scale-110"></div>
                </button>

                <div className="hidden sm:block">
                    <div className="font-display font-bold text-lg text-white leading-tight">
                        {userName}
                        {providerBalance !== null && (
                            <span className="ml-2 text-xs bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full border border-brand-accent/40 normal-case align-middle" title="Provider Balance">
                                Gốc: {formatCurrency(providerBalance)}
                            </span>
                        )}
                    </div>
                    <div className="text-gray-400 font-medium text-sm">
                        {formatCurrency(balance)}
                    </div>
                </div>

                {/* Avatar Dropdown */}
                {avatarOpen && (
                    <div className="absolute top-full right-0 mt-4 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-white/5 sm:hidden">
                            <p className="text-sm text-white font-medium truncate">{userName}</p>
                            <p className="text-xs text-gray-400 truncate">{formatCurrency(balance)}</p>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-white/5 hover:text-red-400 transition-colors">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            <span className="font-medium text-sm">Đăng Xuất</span>
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
