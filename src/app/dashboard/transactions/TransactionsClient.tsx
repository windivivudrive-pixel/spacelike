"use client";

import { useState } from 'react';

export default function TransactionsClient({ initialTransactions, initialOrders }: { initialTransactions: any[], initialOrders: any[] }) {
    const [activeTab, setActiveTab] = useState<'deposits' | 'orders'>('deposits');
    const [orders, setOrders] = useState<any[]>(initialOrders);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRefreshStatus = async () => {
        if (orders.length === 0) return;
        setIsRefreshing(true);
        try {
            const orderIds = orders.map(o => o.id);
            const res = await fetch('/api/orders/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_ids: orderIds }),
            });
            const data = await res.json();

            if (data.success && data.results) {
                // Update local orders state with new statuses
                const resultsMap = new Map<string, any>(data.results.map((r: any) => [String(r.order_id), r]));

                setOrders(prevOrders => prevOrders.map(order => {
                    const update = resultsMap.get(String(order.id));
                    if (update && update.status) {
                        return { ...order, status: update.status, provider_status: update.provider_status };
                    }
                    return order;
                }));
            }
        } catch (error) {
            console.error('Failed to refresh statuses:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(236,57,44,0.6)]"></div>
                    <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Lịch sử giao dịch</h2>
                </div>
                {activeTab === 'orders' && (
                    <button
                        onClick={handleRefreshStatus}
                        disabled={isRefreshing || orders.length === 0}
                        className="flex items-center gap-2 text-xs font-medium text-white bg-brand-accent/20 hover:bg-brand-accent/30 px-4 py-2 rounded-full border border-brand-accent/40 transition-colors disabled:opacity-50"
                    >
                        <i className={`fa-solid fa-rotate-right ${isRefreshing ? 'animate-spin' : ''}`}></i>
                        Làm mới trạng thái
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4">
                <button
                    onClick={() => setActiveTab('deposits')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'deposits' ? 'bg-[var(--service-item-bg)] text-[var(--text-primary)] border border-[var(--border-color-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--table-hover)] border border-transparent'}`}
                >
                    <i className="fa-solid fa-money-bill-transfer mr-2"></i> Giao dịch nạp tiền ({initialTransactions.length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-[var(--service-item-bg)] text-[var(--text-primary)] border border-[var(--border-color-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--table-hover)] border border-transparent'}`}
                >
                    <i className="fa-solid fa-box-open mr-2"></i> Lịch sử Order ({orders.length})
                </button>
            </div>

            {activeTab === 'deposits' ? (
                // Deposits Tab Content
                (!initialTransactions || initialTransactions.length === 0) ? (
                    <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-[var(--border-color)] shadow-[var(--card-shadow)] rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center group hover:border-brand-accent/30 transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent text-3xl mb-4 group-hover:-rotate-12 transition-transform">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Chưa có giao dịch nạp tiền</h3>
                        <p className="text-[var(--text-muted)] font-medium max-w-sm">Dữ liệu nạp tiền của bạn sẽ xuất hiện tại đây một cách an toàn.</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} className="border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-[var(--card-shadow)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)] bg-[var(--table-hover)]">
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Thời gian</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Loại</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Số tiền</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Mã tham chiếu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {initialTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-[var(--table-hover)] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-[var(--text-primary)]">{formatDate(tx.created_at)}</div>
                                                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">ID: {String(tx.id).slice(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${tx.type === 'REFUND' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
                                                    <span className="text-sm font-semibold text-[var(--service-item-text)]">
                                                        {tx.type === 'REFUND' ? 'Hoàn tiền' : 'Nạp tiền'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-green-400">
                                                    +{formatCurrency(tx.amount_vnd || tx.total_amount || 0)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-[var(--text-secondary)] font-medium truncate max-w-[200px]" title={tx.content || tx.gateway_id}>
                                                    {tx.content || tx.gateway_id || '---'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            ) : (
                // Orders Tab Content
                (!orders || orders.length === 0) ? (
                    <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-[var(--border-color)] shadow-[var(--card-shadow)] rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center group hover:border-brand-accent/30 transition-colors">
                        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent text-3xl mb-4 group-hover:-rotate-12 transition-transform">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-[var(--text-muted)] font-medium max-w-sm">Dữ liệu đơn hàng dịch vụ của bạn sẽ xuất hiện tại đây.</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} className="border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-[var(--card-shadow)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)] bg-[var(--table-hover)]">
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Thời gian</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Link / Dịch vụ</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Số lượng</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Chi phí</th>
                                        <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-[var(--table-hover)] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-[var(--text-primary)]">{formatDate(order.created_at)}</div>
                                                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">ID: {String(order.id).slice(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium truncate max-w-[250px]" title={order.services?.name ? `[${order.service_id}] ${order.services.name}` : `Dịch vụ ID: ${order.service_id}`}>
                                                    {order.services?.name ? <span className="text-brand-accent">[{order.service_id}] {order.services.name}</span> : <span className="text-[var(--service-item-text)]">Dịch vụ ID: {order.service_id}</span>}
                                                </div>
                                                <div className="text-[11px] text-[var(--text-secondary)] font-medium mt-1 truncate max-w-[250px]" title={order.target_link}>
                                                    Link: {order.target_link}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-[var(--text-primary)]">
                                                    {order.quantity?.toLocaleString() || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-brand-accent">
                                                    -{formatCurrency(order.total_charge || 0)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${['Completed', 'Success'].includes(order.status) ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    ['Pending', 'Processing', 'In progress'].includes(order.status) ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        ['Partial', 'Refunded', 'Canceled'].includes(order.status) ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
