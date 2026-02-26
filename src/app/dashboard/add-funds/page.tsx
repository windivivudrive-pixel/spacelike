"use client";

import { useState, useEffect, useMemo } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { createClient } from '@/lib/supabase/client';

const BANK_CONFIG = {
    BANK_ID: 'TPB',
    ACCOUNT_NO: '55111685555',
    ACCOUNT_NAME: 'BUI QUOC HUNG',
    TEMPLATE: 'compact'
};

export default function AddFundsPage() {
    const { t, formatCurrency } = usePreferences();
    const supabase = createClient();

    const [amount, setAmount] = useState<number>(50000); // Default 50k
    const [paymentCode, setPaymentCode] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch user and profile
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
                const { data } = await supabase
                    .from('profiles')
                    .select('payment_code')
                    .eq('id', session.user.id)
                    .single();

                if (data?.payment_code) {
                    setPaymentCode(data.payment_code);
                }
            }
        };
        fetchUser();
    }, [supabase]);

    // Supabase Realtime subscription for auto-deposit
    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel('realtime_transactions')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transactions',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newTx = payload.new;
                    if (newTx.status === 'SUCCESS' && newTx.type === 'DEPOSIT') {
                        setSuccessMessage(t('addFunds.success' as any));

                        // Clear the message after 10 seconds
                        setTimeout(() => setSuccessMessage(null), 10000);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase, t]);

    const transferContent = paymentCode ? `SL${paymentCode}` : '';

    const qrUrl = useMemo(() => {
        if (!amount || !transferContent) return null;
        return `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-${BANK_CONFIG.TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.ACCOUNT_NAME)}`;
    }, [amount, transferContent]);

    const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

    const handleCopy = () => {
        navigator.clipboard.writeText(transferContent);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">{t('addFunds.title' as any)}</h1>
                <p className="text-gray-400">{t('addFunds.description' as any)}</p>
            </div>

            {successMessage && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                    <i className="fa-solid fa-circle-check mt-1"></i>
                    <div>
                        <h4 className="font-bold">Transaction Confirmed!</h4>
                        <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Form */}
                <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            {t('order.quantity' as any)} (VND)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                <i className="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <input
                                type="number"
                                min={10000}
                                value={amount || ''}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold text-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                                placeholder={t('addFunds.amountPlaceholder' as any)}
                            />
                        </div>
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            {t('addFunds.quickSelect' as any)}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {quickAmounts.map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${amount === val
                                        ? 'bg-brand-accent/20 border-brand-accent text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.15)]'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {formatCurrency(val)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transfer Details */}
                    {userId && transferContent ? (
                        <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <label className="block text-sm font-bold text-brand-accent mb-2 uppercase tracking-wide">
                                {t('addFunds.qrContent' as any)}
                            </label>
                            <div className="flex items-center gap-3">
                                <code className="flex-1 block text-2xl font-bold text-white bg-black/40 px-4 py-3 rounded-lg border border-white/5 select-all">
                                    {transferContent}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition-colors border border-white/10 shrink-0"
                                    title={t('addFunds.qrCopy' as any)}
                                >
                                    <i className="fa-regular fa-copy"></i>
                                </button>
                            </div>
                            <p className="mt-3 text-xs text-brand-accent/80 font-medium">
                                <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                                {t('addFunds.qrWarning' as any)}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-400">
                            <i className="fa-solid fa-lock text-3xl mb-3 opacity-50"></i>
                            <p>{t('order.loginRequired' as any)}</p>
                        </div>
                    )}
                </div>

                {/* Right QR Display */}
                <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center relative shadow-2xl min-h-[400px]">

                    <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                        <h3 className="text-xl font-display font-bold text-white mb-6 text-center">
                            {t('addFunds.qrInstruction' as any)}
                        </h3>

                        {qrUrl ? (
                            <div className="bg-white p-4 rounded-xl shadow-[0_0_40px_rgba(236,57,44,0.2)] w-full max-w-[280px] aspect-square relative animate-in zoom-in-95 duration-500">
                                <img
                                    src={qrUrl}
                                    alt="VietQR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-[280px] aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                <div className="text-gray-500 flex flex-col items-center gap-3">
                                    <i className="fa-solid fa-qrcode text-4xl"></i>
                                    <span className="text-sm font-medium">{t('order.loginRequired' as any)}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
                            <i className="fa-solid fa-shield-halved text-brand-accent"></i>
                            Secure automated payment processing via SePay
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
