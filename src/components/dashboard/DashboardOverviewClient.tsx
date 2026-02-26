"use client";

import { usePreferences } from '@/contexts/PreferencesContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardOverviewClient({ displayName, initialBalance, userId }: { displayName: string, initialBalance: number, userId?: string }) {
    const { t, formatCurrency } = usePreferences();
    const [balance, setBalance] = useState<number>(initialBalance || 0);
    const supabase = createClient();

    // Subscribe to balance updates via Supabase Realtime
    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel('realtime_overview_balance')
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

    const stats = [
        { title: t('dashboard.currentBalance' as any), value: formatCurrency(balance), icon: 'fa-wallet' },
        { title: t('dashboard.totalDeposited' as any), value: formatCurrency(balance), icon: 'fa-piggy-bank' },
    ];

    return (
        <>
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-orange-500 p-6 lg:p-8 mb-6 shadow-[0_0_30px_rgba(236,57,44,0.3)]">
                {/* Decorator elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-orange-400/20 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-white/80 font-medium mb-1">
                            {t('dashboard.welcomeBack' as any)}, <i className="fa-solid fa-sparkles text-yellow-300"></i>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide">
                            {displayName}
                        </h1>
                    </div>
                    <Link href="/dashboard/add-funds" className="flex items-center gap-2 bg-white text-brand-accent px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg shadow-black/20 self-start md:self-auto">
                        <i className="fa-solid fa-wallet"></i> {t('sidebar.addFunds' as any)} <i className="fa-solid fa-arrow-up-right ml-1 text-sm"></i>
                    </Link>
                </div>
            </div>

            {/* Notifications Section - Moved to top, full width */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(236,57,44,0.6)]"></div>
                        <h2 className="text-xl font-display font-bold text-white">{t('dashboard.notifications' as any)}</h2>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-brand-accent/70 hover:text-brand-accent border border-brand-accent/20 px-4 py-1.5 rounded-lg hover:bg-brand-accent/10 transition-all">
                        <i className="fa-solid fa-expand"></i> {t('dashboard.viewAll' as any)}
                    </button>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 shadow-2xl transition-colors rounded-2xl p-4 md:p-6 relative overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center hover:border-white/20">
                    {/* Admin Tag */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-orange-500 flex items-center justify-center text-white font-bold tracking-widest shadow-[0_0_15px_rgba(236,57,44,0.3)]">AD</div>
                        <div>
                            <div className="text-sm font-bold text-white flex items-center gap-1 group-hover:text-brand-accent transition-colors">
                                Admin <i className="fa-solid fa-circle-check text-brand-accent text-xs"></i>
                            </div>
                            <div className="text-xs text-gray-500">ngày 16 tháng 2, 2026</div>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:border-l md:border-white/10 md:pl-6">
                        <h3 className="text-base font-bold text-white mb-1">Mừng Lễ Bính Ngọ 2026</h3>
                        {/* Modified to fit exactly 3 lines with ellipsis overflow */}
                        <div className="text-sm text-gray-400 leading-relaxed line-clamp-2 md:line-clamp-3">
                            <span className="text-brand-accent font-medium glow-text">socialmedia.vn</span> tri ân khách hàng: Từ 29 Tết đến hết mùng 3 Tết. <span className="text-brand-accent animate-pulse">Nạp từ XXk tặng ngay +XX% xu</span>. Nạp càng cao phần thưởng càng "khủng". Hệ thống giao dịch tự động nhanh chóng để bạn tiếp tục chiến social media!
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row - 2 items full width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-brand-accent/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">{stat.title}</h3>
                            <div className={`w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.15)] group-hover:-translate-y-1 group-hover:bg-brand-accent group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,57,44,0.4)] transition-all duration-300`}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                        </div>
                        <div className="text-2xl font-display font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Orders Section - Full Width */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.2)]">
                        <i className="fa-solid fa-box"></i>
                    </div>
                    <h2 className="text-lg font-display font-bold text-white">{t('dashboard.orders' as any)}</h2>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 hover:border-white/20 shadow-2xl transition-colors rounded-2xl p-6 flex-1 flex flex-col items-center justify-center min-h-[300px] text-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/5 border border-brand-accent/10 flex items-center justify-center text-brand-accent/50 text-xl mb-4">
                        <i className="fa-solid fa-box-open"></i>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{t('dashboard.noOrdersYet' as any)}</p>
                </div>
            </div>

        </>
    );
}
