"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = usePreferences();

    const mainNav = [
        { name: t('sidebar.overview'), href: '/dashboard', icon: 'fa-table-columns' },
        { name: t('sidebar.servicePricing'), href: '/dashboard/pricing', icon: 'fa-layer-group' },
        { name: t('sidebar.profile'), href: '/dashboard/profile', icon: 'fa-user' },
        { name: t('sidebar.addFunds'), href: '/dashboard/add-funds', icon: 'fa-credit-card' },
        { name: t('sidebar.transactions'), href: '/dashboard/transactions', icon: 'fa-clock-rotate-left' },
    ];

    const socialLinks = [
        { id: 'facebook', name: 'Facebook', href: '/dashboard/service/facebook', icon: 'fa-facebook', color: '#1877F2' },
        { id: 'tiktok', name: 'TikTok', href: '/dashboard/service/tiktok', icon: 'fa-tiktok', color: '#00F2FE' },
        { id: 'instagram', name: 'Instagram', href: '/dashboard/service/instagram', icon: 'fa-instagram', color: '#E1306C' },
        { id: 'youtube', name: 'YouTube', href: '/dashboard/service/youtube', icon: 'fa-youtube', color: '#FF0000' },
        { id: 'twitter', name: 'Twitter/X', href: '/dashboard/service/twitter', icon: 'fa-x-twitter', color: '#FFFFFF' },
        { id: 'google', name: 'Google', href: '/dashboard/service/google', icon: 'fa-google', color: '#DB4437' },
        { id: 'telegram', name: 'Telegram', href: '/dashboard/service/telegram', icon: 'fa-telegram', color: '#2AABEE' },
    ];

    return (
        <aside style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r border-white/10 py-6 px-4 hidden lg:flex flex-col z-40">
            {/* Brand Logo */}
            <div className="mb-10 px-2 flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img
                        src="/logo spacelike.png"
                        alt="SpaceLike Logo"
                        className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)]"
                    />
                </Link>
            </div>

            {/* Main Navigation */}
            <div className="flex flex-col gap-1 mb-10">
                {mainNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-brand-accent/10 border border-brand-accent/20 text-brand-accent shadow-[0_0_15px_rgba(236,57,44,0.1)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'bg-brand-accent/20 text-brand-accent' : 'bg-white/5 text-gray-400'}`}>
                                <i className={`fa-solid ${item.icon}`}></i>
                            </div>
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_5px_#EC392C]"></div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Products & Services */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-4 px-4 tracking-wider uppercase">
                    {t('sidebar.productsServices')}
                </h3>
                <div className="flex flex-col gap-1">
                    {socialLinks.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-[#1a1a1a] border border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isActive ? 'bg-black/80 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black/50 border border-white/5 group-hover:bg-[#1a1a1a]'
                                    }`}>
                                    <i className={`fa-brands ${item.icon} text-lg ${isActive && item.color !== '#FFFFFF' ? 'drop-shadow-md' : ''}`} style={{ color: item.color, filter: isActive ? `drop-shadow(0 0 5px ${item.color}80)` : 'none' }}></i>
                                </div>
                                <span className={`font-medium text-sm transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{item.name}</span>
                                <i className={`fa-solid fa-chevron-right ml-auto text-xs transition-colors ${isActive ? 'text-brand-accent drop-shadow-[0_0_5px_rgba(236,57,44,0.8)]' : 'text-gray-600 group-hover:text-white'}`}></i>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
