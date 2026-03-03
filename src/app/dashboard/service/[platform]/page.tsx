"use client";

import { use, useState, useEffect, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { usePreferences } from '@/contexts/PreferencesContext';
import { createClient } from '@/lib/supabase/client';

const platforms = [
    { id: 'youtube', name: 'Youtube', icon: 'fa-youtube', color: '#FF0000' },
    { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: '#E1306C' },
    { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', color: '#1877F2' },
    { id: 'tiktok', name: 'TikTok', icon: 'fa-tiktok', color: '#00F2FE' },
    { id: 'twitch', name: 'Twitch', icon: 'fa-twitch', color: '#9146FF' },
    { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', color: '#2AABEE' },
    { id: 'spotify', name: 'Spotify', icon: 'fa-spotify', color: '#1DB954' },
    { id: 'soundcloud', name: 'SoundCloud', icon: 'fa-soundcloud', color: '#ff5500' },
    { id: 'twitter', name: 'Twitter (X)', icon: 'fa-x-twitter', color: '#ffffff' },
    { id: 'discord', name: 'Discord', icon: 'fa-discord', color: '#5865F2' },
    { id: 'google', name: 'Google', icon: 'fa-google', color: '#DB4437' }
];

export default function ServicePage({ params }: { params: Promise<{ platform: string }> }) {
    const resolvedParams = use(params);
    const profile = platforms.find(p => p.id === resolvedParams.platform);

    const { formatCurrency, t } = usePreferences();
    const supabase = createClient();

    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState<number>(0);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [targetLink, setTargetLink] = useState('');
    const [reactType, setReactType] = useState<string>('LIKE');
    const [comment, setComment] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Make sure we only render when we know the profile exists
    useEffect(() => {
        if (!profile) {
            notFound();
        }
    }, [profile]);

    useEffect(() => {
        async function fetchServices() {
            if (!profile) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('category', profile.id.toUpperCase())
                .order('rate', { ascending: true });

            if (data) {
                setServices(data);
                if (data.length > 0) {
                    setSelectedServiceId(data[0].id.toString());
                    setQuantity(data[0].min_quantity);
                }
            }
            setLoading(false);
        }
        fetchServices();
    }, [profile]);

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

    const groupedServices = useMemo(() => {
        const groups: Record<string, any[]> = {};

        services.forEach(svc => {
            let category = 'Khác (Other)';
            const lowerName = svc.name.toLowerCase();

            if (lowerName.includes('like') && lowerName.includes('page')) {
                category = 'Page Like';
            } else if (lowerName.includes('like') || lowerName.includes('reaction') || lowerName.includes('cảm xúc') || lowerName.includes('thả tim') || lowerName.includes('thương thương')) {
                category = 'Post Like / Reaction';
            } else if (lowerName.includes('comment') || lowerName.includes('bình luận')) {
                category = 'Post Comment';
            } else if (lowerName.includes('share') || lowerName.includes('chia sẻ')) {
                category = 'Post Share';
            } else if (lowerName.includes('follow') || lowerName.includes('theo dõi') || lowerName.includes('sub')) {
                category = 'Profile / Page Follower';
            } else if (lowerName.includes('view') || lowerName.includes('lượt xem') || lowerName.includes('mắt') || lowerName.includes('xem')) {
                category = 'Video / Livestream Views';
            } else if (lowerName.includes('member') || lowerName.includes('thành viên') || lowerName.includes('nhóm') || lowerName.includes('group')) {
                category = 'Group Member';
            }

            if (!groups[category]) groups[category] = [];
            groups[category].push(svc);
        });

        return groups;
    }, [services]);

    const categories = useMemo(() => Object.keys(groupedServices).sort(), [groupedServices]);

    useEffect(() => {
        if (categories.length > 0 && (!selectedCategory || !categories.includes(selectedCategory))) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        const svcs = groupedServices[val] || [];
        if (svcs.length > 0) {
            const firstActive = svcs.find(s => s.is_active) || svcs[0];
            setSelectedServiceId(firstActive.id.toString());
            setQuantity(firstActive.min_quantity);
            setExpandedServiceId(null);
        }
    };

    const activeService = useMemo(() => {
        return services.find(s => s.id.toString() === selectedServiceId);
    }, [services, selectedServiceId]);

    const total = useMemo(() => {
        if (!activeService) return 0;
        return (Math.max(0, quantity) / 1000) * activeService.rate;
    }, [quantity, activeService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!activeService || quantity < activeService.min_quantity || quantity > activeService.max_quantity || !targetLink) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: activeService.id,
                    target_link: targetLink,
                    quantity: quantity,
                    reactType: selectedCategory === 'Post Like / Reaction' ? reactType : undefined,
                    comment: selectedCategory === 'Post Comment' ? comment : undefined,
                    note: note ? note : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('order.orderError' as any));
            }

            setMessage({ type: 'success', text: `${t('order.orderSuccess' as any)} (Order #${data.order_id})` });
            setTargetLink('');
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || t('order.orderError' as any) });
        } finally {
            setSubmitting(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="relative rounded-[2rem] p-1 overflow-hidden shadow-2xl border border-brand-accent/20 hover:border-brand-accent/40 transition-colors duration-500">
                {/* Top neon border gradient effect - Space Theme */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-80"></div>

                <div style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="rounded-[calc(2rem-4px)] p-8 md:p-12">

                    <div className="flex items-start gap-5 mb-10">
                        {/* Dynamic Platform Icon Color */}
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-[var(--service-item-bg)] border border-[var(--border-color)] flex items-center justify-center shadow-inner" style={{ boxShadow: `inset 0 0 20px ${profile.color}20` }}>
                            <i className={`fa-brands ${profile.icon} text-3xl`} style={{ color: profile.color, filter: `drop-shadow(0 0 10px ${profile.color})` }}></i>
                        </div>
                        <div>
                            <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-wide">
                                {t('order.newOrder')}: {profile.name}
                            </h2>
                            <p className="text-[var(--text-secondary)] mt-1">{t('order.fillDetails')}</p>
                        </div>
                    </div>

                    {/* Main Form inside console */}
                    <form className="space-y-6">

                        {message && (
                            <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-brand-accent'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'} text-lg`}></i>
                                    <span className="font-medium text-sm">{message.text}</span>
                                </div>
                                <button type="button" onClick={() => setMessage(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        )}

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                <i className="fa-solid fa-folder-open mr-2 text-brand-accent/70"></i> Dịch vụ (Category)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-layer-group text-[var(--text-muted)]"></i>
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    disabled={loading || categories.length === 0}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-12 pr-10 py-4 text-[var(--input-text)] appearance-none focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer hover:bg-[var(--input-hover)] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <option>{t('order.loadingServices' as any)}</option>
                                    ) : categories.length === 0 ? (
                                        <option>{t('order.noServices' as any)}</option>
                                    ) : (
                                        categories.map(cat => (
                                            <option key={cat} value={cat}>{cat} ({(groupedServices[cat] || []).length})</option>
                                        ))
                                    )}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-caret-down text-brand-accent"></i>
                                </div>
                            </div>
                        </div>

                        {/* Service List Selection (New Layout) */}
                        <div className="space-y-3 mt-4">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                <i className="fa-solid fa-server mr-2 text-brand-accent/70"></i> Gói dịch vụ chi tiết
                            </label>

                            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-accent/20 scrollbar-track-transparent">
                                {(groupedServices[selectedCategory] || []).map((svc) => {
                                    const isSelected = selectedServiceId === svc.id.toString();
                                    const isExpanded = expandedServiceId === svc.id.toString();

                                    return (
                                        <div
                                            key={svc.id}
                                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${isSelected ? 'border-brand-accent bg-brand-accent/10' : 'border-transparent hover:bg-white/5'}`}
                                        >
                                            <div
                                                className={`p-4 flex items-center gap-4 cursor-pointer ${!svc.is_active ? 'opacity-50 grayscale' : ''}`}
                                                onClick={() => {
                                                    if (svc.is_active) {
                                                        setSelectedServiceId(svc.id.toString());
                                                        setQuantity(svc.min_quantity);
                                                    }
                                                }}
                                            >
                                                {/* Radio Circle */}
                                                <div className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${isSelected ? 'border-brand-accent' : 'border-[var(--radio-border)]'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(236,57,44,0.6)]"></div>}
                                                </div>

                                                {/* ID Badge */}
                                                <div className={`shrink-0 px-3 py-1.5 rounded-lg ${isSelected ? 'bg-brand-accent text-white' : 'bg-[var(--service-item-bg)] text-[var(--service-item-muted)]'} text-xs font-bold font-mono tracking-wider`}>
                                                    {svc.provider_service_id}
                                                </div>

                                                {/* Name & Price */}
                                                <div className={`flex-1 text-sm font-medium pr-4 ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--service-item-text)]'}`}>
                                                    {svc.name}
                                                    <span className={`ml-2 font-mono whitespace-nowrap ${isSelected ? 'text-brand-accent' : 'text-gray-500'}`}>- {formatCurrency(svc.rate)}/1000</span>
                                                </div>

                                                {/* Right Actions: Status & Expand */}
                                                <div className="shrink-0 flex items-center gap-4 ml-auto">
                                                    {/* Active Toggle Switch (Visual Only) */}
                                                    <div className={`w-9 h-5 rounded-full flex items-center p-0.5 border transition-colors ${svc.is_active ? 'bg-brand-accent/20 border-brand-accent/30' : 'bg-gray-500/20 border-gray-500/30'}`}>
                                                        <div className={`w-4 h-4 rounded-full transform transition-transform ${svc.is_active ? 'translate-x-4 bg-brand-accent shadow-[0_0_5px_rgba(236,57,44,0.5)]' : 'translate-x-0 bg-gray-400'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Target Link */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                <i className="fa-solid fa-link mr-2 text-brand-accent/70"></i> {t('order.targetLink')}
                            </label>
                            <input
                                type="text"
                                value={targetLink}
                                onChange={(e) => setTargetLink(e.target.value)}
                                placeholder={activeService?.example_link || `https://${profile.id}.com/tencuaban`}
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-4 text-[var(--input-text)] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-[var(--input-placeholder)]"
                            />
                        </div>

                        {/* Reaction Type (for Facebook Post Like/Reaction) */}
                        {profile.id === 'facebook' && selectedCategory === 'Post Like / Reaction' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                    <i className="fa-solid fa-thumbs-up mr-2 text-brand-accent/70"></i> Loại cảm xúc (Reaction Type)
                                </label>
                                <div className="relative">
                                    <select
                                        value={reactType}
                                        onChange={(e) => setReactType(e.target.value)}
                                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-4 text-[var(--input-text)] appearance-none focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer hover:bg-[var(--input-hover)]"
                                    >
                                        <option value="LIKE">LIKE (Thích)</option>
                                        <option value="LOVE">LOVE (Yêu thích)</option>
                                        <option value="CARE">CARE (Thương thương)</option>
                                        <option value="HAHA">HAHA (Cười)</option>
                                        <option value="WOW">WOW (Ngạc nhiên)</option>
                                        <option value="SAD">SAD (Buồn)</option>
                                        <option value="ANGRY">ANGRY (Phẫn nộ)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-caret-down text-brand-accent"></i>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comment Content (for Post Comment) */}
                        {selectedCategory === 'Post Comment' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                    <i className="fa-solid fa-comments mr-2 text-brand-accent/70"></i> Nội dung bình luận (Comments)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Gõ bình luận ở đây... Mỗi dòng là 1 bình luận"
                                    rows={4}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-4 text-[var(--input-text)] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-[var(--input-placeholder)] resize-y"
                                ></textarea>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Lưu ý: Mỗi dòng là 1 bình luận độc lập.</p>
                            </div>
                        )}

                        {/* Optional Note */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                <i className="fa-solid fa-note-sticky mr-2 text-brand-accent/70"></i> Ghi chú (Optional)
                            </label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú cho đơn hàng này (không bắt buộc)"
                                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-4 text-[var(--input-text)] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-[var(--input-placeholder)]"
                            />
                        </div>

                        {/* Quantity and Price row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase flex justify-between items-center">
                                    <span><i className="fa-solid fa-gauge-high mr-2 text-brand-accent/70"></i> {t('order.quantity')}</span>
                                    {activeService && (
                                        <span className="text-[10px] text-[var(--text-muted)] normal-case bg-[var(--service-item-bg)] px-2 py-1 rounded-md">
                                            Min: {activeService.min_quantity.toLocaleString()} - Max: {activeService.max_quantity.toLocaleString()}
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={activeService?.min_quantity || 10}
                                        max={activeService?.max_quantity || 100000}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                        step="10"
                                        placeholder={`Gõ số lượng (${activeService?.min_quantity || ''} - ${activeService?.max_quantity || ''})`}
                                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-4 text-[var(--input-text)] font-mono text-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-center placeholder-[var(--input-placeholder)]"
                                    />
                                </div>
                            </div>

                            {/* Charge Total */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider uppercase block">
                                    <i className="fa-solid fa-coins mr-2 text-brand-accent/70"></i> {t('order.totalCharge')}
                                </label>
                                <div className="w-full bg-[var(--total-bg)] shadow-inner border border-brand-accent/30 rounded-xl px-6 py-4 flex justify-between items-center h-[62px]">
                                    <i className="fa-solid fa-wallet text-[var(--text-muted)]"></i>
                                    <span className="font-display text-2xl font-bold text-brand-accent tracking-wider">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Box */}
                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || submitting || !activeService || quantity < activeService.min_quantity || quantity > activeService.max_quantity || !targetLink}
                                className="w-full relative overflow-hidden bg-brand-accent text-brand-dark font-display font-bold text-lg tracking-wider py-4 rounded-xl transition-colors shadow-neon group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-accent disabled:shadow-none"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {submitting ? t('order.processing' as any) : t('order.submit')} &nbsp;{!submitting && <i className="fa-solid fa-check group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>}
                                </span>
                                {/* Button Hover Shine Effect */}
                                {!submitting && <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-shimmer"></div>}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
