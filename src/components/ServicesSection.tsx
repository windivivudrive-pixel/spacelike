"use client";

import { useState } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

const platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', color: '#1877F2', hoverBg: '#1877F2' },
    { id: 'youtube', name: 'Youtube', icon: 'fa-youtube', color: '#FF0000', hoverBg: '#FF0000' },
    { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: '#E1306C', hoverBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
    { id: 'tiktok', name: 'TikTok', icon: 'fa-tiktok', color: '#00F2FE', hoverBg: '#050505', customBorder: '#00F2FE' },
    { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', color: '#0088cc', hoverBg: '#0088cc' },
    { id: 'shopee', name: 'Shopee', image: '/shopee-icon.webp', color: '#EE4D2D', hoverBg: '#EE4D2D', isComingSoon: true },
    { id: 'google_map', name: 'Google Map', image: '/google map.png', color: '#34A853', hoverBg: '#34A853', isComingSoon: true },
    { id: 'twitter', name: 'X', icon: 'fa-x-twitter', color: '#ffffff', hoverBg: '#1a1a1a', customBorder: '#ffffff', isComingSoon: true },
    { id: 'linkedin', name: 'LinkedIn', icon: 'fa-linkedin', color: '#0077b5', hoverBg: '#0077b5', isComingSoon: true },
    { id: 'spotify', name: 'Spotify', icon: 'fa-spotify', color: '#1DB954', hoverBg: '#1DB954', isComingSoon: true },
];
export default function ServicesSection({ onSelectCategory }: { onSelectCategory?: (id: string) => void }) {
    const [activePlatform, setActivePlatform] = useState('facebook');
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
    const { theme } = usePreferences();

    const handleSelect = (p: typeof platforms[0]) => {
        setActivePlatform(p.id);
        if (onSelectCategory) {
            onSelectCategory(p.name);
        }
    };

    return (
        <section id="services" className="py-24 relative z-10 border-t border-[var(--border-color)]">
            {/* Decorative light ray */}
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">Danh Sách <span className="text-brand-accent">Nền Tảng</span></h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Chọn nền tảng bạn muốn đẩy tương tác và phát triển dịch vụ.</p>
                </div>

                {/* Platform Buttons Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {platforms.map(p => {
                        const isActive = p.id === activePlatform;
                        const isHovered = p.id === hoveredPlatform && !isActive;

                        let bgStr = theme === 'dark' ? '#1e1e1e' : `${p.color}12`;
                        let borderStr = theme === 'dark' ? 'rgba(255,255,255,0.02)' : `${p.color}25`;
                        let shadowStr = 'none';
                        let textWhite = false;

                        if (isActive || isHovered) {
                            bgStr = p.hoverBg;
                            textWhite = true;
                            if (p.customBorder) {
                                borderStr = p.customBorder;
                                if (isHovered) bgStr = theme === 'dark' ? '#1a1a1a' : `${p.customBorder}20`;
                                if (isHovered) textWhite = theme === 'dark';
                                if (isActive) shadowStr = `0 0 15px ${p.customBorder}40`;
                            } else {
                                borderStr = 'transparent';
                                if (isActive) shadowStr = `0 0 20px ${p.color}60`;
                            }
                        }

                        return (
                            <button
                                key={p.id}
                                onClick={() => handleSelect(p)}
                                onMouseEnter={() => setHoveredPlatform(p.id)}
                                onMouseLeave={() => setHoveredPlatform(null)}
                                className="w-full flex items-center justify-center xl:justify-start gap-3 p-4 rounded-xl transition-all duration-300 transform scale-100 hover:scale-[1.02] cursor-pointer outline-none border group"
                                style={{
                                    background: bgStr,
                                    borderColor: borderStr,
                                    boxShadow: shadowStr
                                }}
                            >
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className={`w-6 h-6 md:w-8 md:h-8 object-contain transition-all duration-300 ${!textWhite ? 'grayscale opacity-60' : (p.id === 'shopee' ? 'brightness-0 invert' : '')}`} />
                                ) : (
                                    <i className={`fa-brands ${p.icon} text-2xl md:text-3xl transition-colors duration-300 ${textWhite ? 'text-white' : 'text-[var(--text-secondary)]'}`} style={!textWhite && theme === 'light' ? { color: p.color } : {}}></i>
                                )}
                                <span className={`font-semibold text-sm xl:text-base hidden sm:block whitespace-nowrap transition-colors duration-300 ${textWhite ? 'text-white drop-shadow-md' : 'text-[var(--text-muted)]'}`}>
                                    {p.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
