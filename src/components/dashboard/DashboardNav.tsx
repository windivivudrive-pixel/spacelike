"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function DashboardNav() {
    const pathname = usePathname();
    const { t } = usePreferences();

    const tabs = [
        { name: t('sidebar.overview'), href: '/dashboard', icon: 'fa-table-columns', exact: true },
        { name: t('sidebar.servicePricing'), href: '/dashboard/service/facebook', icon: 'fa-layer-group', isServiceNav: true },
        { name: t('sidebar.transactions'), href: '/dashboard/transactions', icon: 'fa-clock-rotate-left' },
        { name: 'Blog', href: '/dashboard/blog', icon: 'fa-pen-nib' },
        { name: t('sidebar.addFunds'), href: '/dashboard/add-funds', icon: 'fa-credit-card', isHighlight: true },
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

    const isServicePage = pathname.startsWith('/dashboard/service');

    return (
        <nav className="w-full">
            {/* Primary Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => {
                    let isActive = false;
                    if (tab.exact) {
                        isActive = pathname === tab.href;
                    } else if (tab.isServiceNav) {
                        isActive = isServicePage || pathname === '/dashboard/pricing';
                    } else {
                        isActive = pathname.startsWith(tab.href);
                    }

                    let baseClasses = "flex items-center gap-2.5 px-5 py-3 rounded-lg text-base font-medium whitespace-nowrap transition-all duration-200";

                    if (tab.isHighlight) {
                        baseClasses += " ml-auto bg-brand-accent text-white shadow-[0_0_20px_rgba(236,57,44,0.4)] hover:brightness-110";
                        if (isActive) baseClasses += " ring-2 ring-white/30";
                    } else if (isActive) {
                        baseClasses += " bg-brand-accent text-white shadow-[0_0_20px_rgba(236,57,44,0.3)]";
                    } else {
                        baseClasses += " text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--table-hover)]";
                    }

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={baseClasses}
                        >
                            <i className={`fa-solid ${tab.icon} text-sm`}></i>
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Social Platform Tabs - shown when on overview or service pages */}
            {(pathname === '/dashboard/pricing' || isServicePage) && (
                <div className="mt-4">

                    <div className="flex flex-wrap gap-2">
                        {socialLinks.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${isActive
                                        ? 'border-[var(--border-color-hover)] text-[var(--text-primary)] shadow-lg'
                                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--table-hover)] hover:border-[var(--border-color)]'
                                        }`}
                                    style={isActive ? {
                                        background: `linear-gradient(135deg, ${item.color}22 0%, transparent 70%)`,
                                        borderColor: `${item.color}44`,
                                        boxShadow: `0 0 20px ${item.color}15`
                                    } : {}}
                                >
                                    <i className={`fa-brands ${item.icon}`} style={{ color: isActive ? item.color : undefined }}></i>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
