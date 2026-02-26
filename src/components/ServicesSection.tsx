"use client";

import { useState } from 'react';

const platforms = [
    { id: 'youtube', name: 'Youtube', icon: 'fa-youtube', color: '#FF0000', hoverBg: '#FF0000' },
    { id: 'instagram', name: 'Instagram', icon: 'fa-instagram', color: '#E1306C', hoverBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
    { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', color: '#1877F2', hoverBg: '#1877F2' },
    { id: 'tiktok', name: 'TikTok', icon: 'fa-tiktok', color: '#00F2FE', hoverBg: '#050505', customBorder: '#00F2FE' },
    { id: 'twitch', name: 'Twitch', icon: 'fa-twitch', color: '#9146FF', hoverBg: '#9146FF' },
    { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', color: '#0088cc', hoverBg: '#0088cc' },
    { id: 'spotify', name: 'Spotify', icon: 'fa-spotify', color: '#1DB954', hoverBg: '#1DB954' },
    { id: 'soundcloud', name: 'SoundCloud', icon: 'fa-soundcloud', color: '#ff5500', hoverBg: '#ff5500' },
    { id: 'twitter', name: 'Twitter (X)', icon: 'fa-x-twitter', color: '#ffffff', hoverBg: '#1a1a1a', customBorder: '#ffffff' },
    { id: 'discord', name: 'Discord', icon: 'fa-discord', color: '#5865F2', hoverBg: '#5865F2' }
];

export default function ServicesSection({ onSelectCategory }: { onSelectCategory?: (id: string) => void }) {
    const [activePlatform, setActivePlatform] = useState('instagram');
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

    const handleSelect = (p: typeof platforms[0]) => {
        setActivePlatform(p.id);
        if (onSelectCategory) {
            onSelectCategory(p.name);
        }
    };

    return (
        <section id="services" className="py-24 relative z-10 border-t border-white/5">
            {/* Decorative light ray */}
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-white mb-4">Danh Sách <span className="text-brand-accent">Nền Tảng</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Chọn nền tảng bạn muốn đẩy tương tác và phát triển dịch vụ.</p>
                </div>

                {/* Platform Buttons Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {platforms.map(p => {
                        const isActive = p.id === activePlatform;
                        const isHovered = p.id === hoveredPlatform && !isActive;

                        let bgStr = '#1e1e1e';
                        let borderStr = 'rgba(255,255,255,0.02)';
                        let shadowStr = 'none';

                        if (isActive || isHovered) {
                            bgStr = p.hoverBg;
                            if (p.customBorder) {
                                borderStr = p.customBorder;
                                if (isHovered) bgStr = '#1a1a1a';
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
                                <i className={`fa-brands ${p.icon} text-2xl md:text-3xl transition-colors duration-300 ${isActive || isHovered ? 'text-white' : 'text-gray-400'}`}></i>
                                <span className={`font-semibold text-sm xl:text-base hidden sm:block whitespace-nowrap transition-colors duration-300 ${isActive || isHovered ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
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
