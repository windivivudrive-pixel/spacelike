"use client";

import { usePreferences } from '@/contexts/PreferencesContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Order {
    id: string;
    service_id: number;
    target_link: string;
    quantity: number;
    total_charge: number;
    status: string;
    provider_order_id: string | null;
    provider_status: string | null;
    created_at: string;
    services?: { name: string; category: string } | null;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    'Pending': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', icon: 'fa-clock' },
    'Processing': { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', icon: 'fa-spinner fa-spin' },
    'In progress': { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', icon: 'fa-spinner fa-spin' },
    'Completed': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: 'fa-circle-check' },
    'Partial': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', icon: 'fa-circle-half-stroke' },
    'Canceled': { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', icon: 'fa-circle-xmark' },
    'Refunded': { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', icon: 'fa-rotate-left' },
    'Provider Error': { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', icon: 'fa-triangle-exclamation' },
};

function getStatusConfig(status: string) {
    return STATUS_CONFIG[status] || { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30', icon: 'fa-question' };
}

function truncateLink(link: string, max = 30) {
    try {
        const url = new URL(link);
        const display = url.hostname + url.pathname;
        return display.length > max ? display.substring(0, max) + '...' : display;
    } catch {
        return link.length > max ? link.substring(0, max) + '...' : link;
    }
}

export default function DashboardOverviewClient({ displayName, initialBalance, userId }: { displayName: string, initialBalance: number, userId?: string }) {
    const { t, formatCurrency } = usePreferences();
    const [balance, setBalance] = useState<number>(initialBalance || 0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
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

    // Fetch orders
    useEffect(() => {
        if (!userId) {
            setOrdersLoading(false);
            return;
        }

        async function fetchOrders() {
            setOrdersLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*, services(name, category)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setOrders(data as Order[]);
            }
            setOrdersLoading(false);
        }

        fetchOrders();

        // Subscribe to new orders in realtime
        const channel = supabase.channel('realtime_overview_orders')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${userId}`
                },
                () => {
                    // Re-fetch to get joined service data
                    fetchOrders();
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
                        <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">{t('dashboard.notifications' as any)}</h2>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-brand-accent/70 hover:text-brand-accent border border-brand-accent/20 px-4 py-1.5 rounded-lg hover:bg-brand-accent/10 transition-all">
                        <i className="fa-solid fa-expand"></i> {t('dashboard.viewAll' as any)}
                    </button>
                </div>

                <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-[var(--border-color)] shadow-[var(--card-shadow)] transition-colors rounded-2xl p-4 md:p-6 relative overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center hover:border-[var(--border-color-hover)]">
                    {/* Admin Tag */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-orange-500 flex items-center justify-center text-white font-bold tracking-widest shadow-[0_0_15px_rgba(236,57,44,0.3)]">AD</div>
                        <div>
                            <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1 group-hover:text-brand-accent transition-colors">
                                Admin <i className="fa-solid fa-circle-check text-brand-accent text-xs"></i>
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">ngày 16 tháng 2, 2026</div>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:border-l md:border-[var(--border-color)] md:pl-6">
                        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Mừng Lễ Bính Ngọ 2026</h3>
                        {/* Modified to fit exactly 3 lines with ellipsis overflow */}
                        <div className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 md:line-clamp-3">
                            <span className="text-brand-accent font-medium glow-text">socialmedia.vn</span> tri ân khách hàng: Từ 29 Tết đến hết mùng 3 Tết. <span className="text-brand-accent animate-pulse">Nạp từ XXk tặng ngay +XX% xu</span>. Nạp càng cao phần thưởng càng "khủng". Hệ thống giao dịch tự động nhanh chóng để bạn tiếp tục chiến social media!
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row - 2 items full width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-[var(--border-color)] shadow-[var(--card-shadow)] rounded-2xl p-5 hover:border-brand-accent/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">{stat.title}</h3>
                            <div className={`w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.15)] group-hover:-translate-y-1 group-hover:bg-brand-accent group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,57,44,0.4)] transition-all duration-300`}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                        </div>
                        <div className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1 group-hover:text-brand-accent transition-colors">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Orders Section - Full Width */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.2)]">
                            <i className="fa-solid fa-box"></i>
                        </div>
                        <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">{t('dashboard.orders' as any)}</h2>
                    </div>
                    {orders.length > 0 && (
                        <span className="text-xs text-[var(--text-muted)] font-mono">{orders.length} đơn gần nhất</span>
                    )}
                </div>

                <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-[var(--border-color)] hover:border-[var(--border-color-hover)] shadow-[var(--card-shadow)] transition-colors rounded-2xl overflow-hidden w-full">
                    {ordersLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-accent"></i>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
                            <div className="w-12 h-12 rounded-xl bg-brand-accent/5 border border-brand-accent/10 flex items-center justify-center text-brand-accent/50 text-xl mb-4">
                                <i className="fa-solid fa-box-open"></i>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] font-medium">{t('dashboard.noOrdersYet' as any)}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">ID</th>
                                        <th className="text-left text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Dịch vụ</th>
                                        <th className="text-left text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider hidden md:table-cell">Link</th>
                                        <th className="text-right text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">SL</th>
                                        <th className="text-right text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Tổng</th>
                                        <th className="text-center text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Trạng thái</th>
                                        <th className="text-right text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider hidden lg:table-cell">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const sc = getStatusConfig(order.status);
                                        return (
                                            <tr key={order.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-hover)] transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <span className="font-mono text-xs text-[var(--text-secondary)]">#{order.id.slice(0, 8)}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[var(--text-primary)] font-medium text-xs leading-tight line-clamp-1">
                                                            {order.services?.name || `Service #${order.service_id}`}
                                                        </span>
                                                        {order.services?.category && (
                                                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{order.services.category}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 hidden md:table-cell">
                                                    <a href={order.target_link} target="_blank" rel="noopener noreferrer"
                                                        className="text-xs text-[var(--text-secondary)] hover:text-brand-accent transition-colors flex items-center gap-1.5 group">
                                                        <span className="truncate max-w-[200px]">{truncateLink(order.target_link)}</span>
                                                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                                    </a>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className="text-[var(--text-primary)] font-medium text-xs">{order.quantity.toLocaleString()}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className="text-brand-accent font-bold text-xs">{formatCurrency(order.total_charge)}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${sc.color} ${sc.bg} ${sc.border}`}>
                                                        <i className={`fa-solid ${sc.icon} text-[8px]`}></i>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                                                    <span className="text-xs text-[var(--text-muted)]">
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </span>
                                                    <div className="text-[10px] text-[var(--text-muted)]">
                                                        {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}
