"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePreferences } from '@/contexts/PreferencesContext';
import Link from 'next/link';

export default function OrderPanel({ selectedCategoryName }: { selectedCategoryName?: string }) {
    const { formatCurrency } = usePreferences();
    const [category, setCategory] = useState<string>('FACEBOOK');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (selectedCategoryName) {
            const lower = selectedCategoryName.toLowerCase();
            if (lower.includes('instagram')) setCategory('INSTAGRAM');
            else if (lower.includes('facebook')) setCategory('FACEBOOK');
            else if (lower.includes('tiktok')) setCategory('TIKTOK');
            else if (lower.includes('youtube')) setCategory('YOUTUBE');
            else if (lower.includes('telegram')) setCategory('TELEGRAM');
            else setCategory(selectedCategoryName.toUpperCase());
        }
    }, [selectedCategoryName]);

    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('category', category)
                .eq('is_active', true)
                .order('rate', { ascending: true })
                .limit(6);

            if (data) {
                setServices(data);
            }
            setLoading(false);
        }
        fetchServices();
    }, [category]);

    return (
        <section id="order" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-6xl">

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase">
                            Dịch Vụ {selectedCategoryName || 'Facebook'}
                        </h2>
                        <p className="text-brand-accent mt-2 font-medium tracking-wider">
                            <i className="fa-solid fa-fire mr-1"></i> GÓI DỊCH VỤ NỔI BẬT NHẤT
                        </p>
                    </div>
                    <div>
                        <Link href={`/dashboard/service/${category.toLowerCase()}`} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                            Xem tất cả <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>

                {/* Service Cards Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand-accent"></i>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] py-10">
                        Chưa có dịch vụ nào cho nền tảng này.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((item) => {
                            // Extract a short title (e.g. from "Facebook Like Page" -> "LIKE PAGE")
                            // This is a simple heuristic to make the cards look punchy
                            let shortTitle = item.name.toUpperCase();
                            if (shortTitle.includes('LIKE')) shortTitle = 'LƯỢT THÍCH';
                            else if (shortTitle.includes('FOLLOW')) shortTitle = 'NGƯỜI THEO DÕI';
                            else if (shortTitle.includes('VIEW')) shortTitle = 'LƯỢT XEM';
                            else if (shortTitle.includes('COMMENT')) shortTitle = 'BÌNH LUẬN';
                            else if (shortTitle.includes('SHARE')) shortTitle = 'LƯỢT CHIA SẺ';
                            else if (shortTitle.includes('MẮT')) shortTitle = 'MẮT LIVESTREAM';
                            else {
                                // Just limit the length if no keyword matched
                                shortTitle = shortTitle.substring(0, 20) + (shortTitle.length > 20 ? '...' : '');
                            }

                            return (
                                <div key={item.id} className="bg-[var(--input-bg)] rounded-xl p-6 flex flex-col justify-between min-h-[140px] border-2 border-brand-accent shadow-sm hover:bg-brand-accent hover:shadow-[0_0_20px_rgba(236,57,44,0.4)] transition-all duration-300 group">
                                    {/* Top area: Title */}
                                    <div>
                                        <div className="text-brand-accent group-hover:text-white font-bold tracking-widest text-sm mb-6 uppercase transition-colors">
                                            {category} {shortTitle}
                                        </div>
                                    </div>

                                    {/* Bottom area: Price and Button */}
                                    <div className="flex items-center justify-between border-t border-[var(--border-color)] group-hover:border-white/20 pt-4 transition-colors">
                                        <div className="text-[var(--text-primary)] group-hover:text-white font-bold text-lg transition-colors">
                                            {formatCurrency(item.rate)} <span className="text-[10px] text-[var(--text-muted)] group-hover:text-white/80 font-normal transition-colors">/ 1k</span>
                                        </div>
                                        <Link href={`/dashboard/service/${category.toLowerCase()}?service=${item.id}`} className="px-5 py-2 rounded-lg border border-brand-accent group-hover:border-white text-brand-accent group-hover:text-brand-accent group-hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all text-sm font-medium">
                                            Đặt hàng
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
}
