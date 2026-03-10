"use client";

import OrbitIcons from './OrbitIcons';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function HeroSection() {
    const { theme } = usePreferences();
    return (
        <section className="relative container mx-auto px-6 max-w-7xl py-12 md:py-24 flex flex-col md:flex-row items-center min-h-[85vh]">

            {/* Hero Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] -z-10"></div>

            {/* Left Side / Typography */}
            <div className="md:w-1/2 flex flex-col items-start z-10 w-full text-left space-y-8 pr-0 md:pr-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-brand-border text-brand-accent text-sm font-semibold tracking-widest uppercase shadow-neon">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse-glow"></span>
                    Nền tảng dịch vụ mạng xã hội hàng đầu
                </div>

                <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.1] tracking-tight text-[var(--text-primary)] drop-shadow-lg">
                    Tăng Cường <br />
                    <span className="text-gradient">Hiện Diện</span><br />
                    Mạng Xã Hội
                </h1>

                <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-lg leading-relaxed border-l-2 border-brand-accent/50 pl-4">
                    Thúc đẩy tiếp cận, thu hút tương tác và mở rộng tầm ảnh hưởng trên <span className="text-[var(--text-primary)] font-medium">Facebook</span>, <span className="text-[var(--text-primary)] font-medium">TikTok</span>, <span className="text-[var(--text-primary)] font-medium">Instagram</span> và vô số nền tảng khác.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                    <a href="#order" className="px-8 py-4 rounded-full bg-brand-accent text-brand-dark font-bold text-lg hover:bg-brand-accentHover transition-all shadow-neon-intense flex items-center justify-center gap-3">
                        <i className="fa-solid fa-bolt"></i> Bắt Đầu Ngay
                    </a>
                    <a href="#services" className="px-8 py-4 rounded-full glass-panel border border-[var(--border-color-hover)] text-[var(--text-primary)] hover:border-brand-accent transition-all flex items-center justify-center gap-3">
                        <i className="fa-solid fa-list text-brand-accent"></i> Xem Dịch Vụ
                    </a>
                </div>

                <div className="pt-8 w-full">
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">Các nền tảng phổ biến</p>
                    <div className="flex flex-wrap gap-5 text-2xl text-[var(--text-secondary)]">
                        <i className="fa-brands fa-facebook hover:text-[#1877F2] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-instagram hover:text-[#E1306C] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-tiktok hover:text-white transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-youtube hover:text-[#FF0000] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-telegram hover:text-[#0088cc] transition-colors cursor-pointer drop-shadow-md"></i>
                    </div>
                </div>
            </div>

            {/* Right Side / Floating Abstract UI Panels */}
            <div className="md:w-1/2 relative mt-16 md:mt-0 w-full h-[400px] md:h-[600px] perspective-1000">

                {/* ---------- PLANET with 3D Orbit ---------- */}
                {/* Scaled down uniformly to guarantee orbit paths + icons perfectly align */}
                <div className="absolute top-[2%] sm:top-[5%] md:top-1/2 left-[28%] sm:left-[45%] md:-left-36 transform -translate-x-1/4 sm:-translate-x-1/3 md:translate-x-0 -translate-y-0 md:-translate-y-[100%] scale-[0.49] sm:scale-[0.70] md:scale-[0.80] w-[420px] h-[420px] flex items-center justify-center z-30 pointer-events-none origin-top-left md:origin-center">

                    {/* Planet Body - fixed pixel dimensions, scaling handled parent */}
                    <div className="absolute inset-0 m-auto w-[250px] h-[250px] rounded-full z-20 overflow-hidden shadow-[0_0_120px_rgba(236,57,44,0.4),0_0_40px_rgba(236,57,44,0.3)]">
                        {/* Surface Image */}
                        <img src={theme === 'dark' ? '/planet.png' : '/planet-light.png'} alt="Planet Surface" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                        {/* 3D lighting - highlight top-left, shadow bottom-right */}
                        <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(circle at 30% 25%, rgba(236,100,80,0.35) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.7) 0%, transparent 55%)'
                        }}></div>
                        {/* Orange rim glow at edge */}
                        <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(circle, transparent 50%, rgba(236,57,44,0.25) 70%, rgba(236,57,44,0.1) 100%)'
                        }}></div>
                    </div>

                    {/* Orbit path - BACK half (z-[5] goes behind the planet) */}
                    <svg className="absolute inset-0 m-auto w-[420px] h-[420px] z-[5] pointer-events-none" viewBox="-210 -210 420 420" fill="none">
                        {/* 0,1 sweep-flag draws the top-right arc of the 45deg rotated ellipse */}
                        <path d="M -134.35,-134.35 A 190 65 45 0 1 134.35,134.35" stroke="rgba(236,57,44,0.5)" strokeWidth="2" strokeDasharray="4 10" />
                    </svg>

                    {/* Orbit path - FRONT half (z-[25] goes in front of the planet) */}
                    <svg className="absolute inset-0 m-auto w-[420px] h-[420px] z-[25] pointer-events-none" viewBox="-210 -210 420 420" fill="none">
                        {/* 0,0 sweep-flag draws the bottom-left arc of the 45deg rotated ellipse */}
                        <path d="M -134.35,-134.35 A 190 65 45 0 0 134.35,134.35" stroke="rgba(236,57,44,0.5)" strokeWidth="2" strokeDasharray="4 10" />
                    </svg>

                    {/* JS-driven orbit icons - always flat 2D */}
                    <OrbitIcons />

                    {/* Ambient glow behind planet */}
                    <div className="absolute inset-0 m-auto w-80 h-80 rounded-full bg-brand-accent/30 blur-[100px] -z-10"></div>
                </div>
                {/* ------------------------------------------------ */}

                <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-end md:justify-center z-10 pb-8 md:pb-0">

                    {/* Main Stats Panel */}
                    <div className="w-[60%] sm:w-[50%] md:w-[420px] absolute right-0 bottom-4 md:relative md:right-auto md:bottom-auto md:translate-x-12 glass-panel rounded-xl md:rounded-2xl p-2.5 sm:p-4 md:p-6 shadow-2xl floating border border-[var(--border-color)] z-20" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-5deg) rotateX(5deg)' }}>

                        <div className="flex justify-between items-center mb-3 md:mb-6">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center shrink-0">
                                    <i className="fa-brands fa-facebook text-[#1877F2] text-xs sm:text-sm md:text-xl"></i>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-[var(--text-primary)] text-[10px] sm:text-xs md:text-sm truncate">Facebook Likes</h4>
                                    <p className="text-[9px] md:text-xs text-[var(--text-secondary)] truncate">@star_traveler</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-3 mb-3 md:mb-6">
                            <div className="flex justify-between text-[9px] md:text-xs text-brand-accent font-mono font-medium">
                                <span>Tiến Độ</span>
                                <span>82%</span>
                            </div>
                            <div className="h-1 md:h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-accent to-yellow-400 w-[82%] shadow-neon relative">
                                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 skew-x-[-20deg] animate-shimmer"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                            <div className="bg-[var(--total-bg)] rounded-lg md:rounded-xl p-1.5 md:p-3 border border-[var(--border-color)] box-border">
                                <p className="text-[8px] md:text-xs text-[var(--text-muted)] mb-0.5 md:mb-1 truncate">Trạng Thái</p>
                                <p className="text-[9px] md:text-sm font-bold flex items-center gap-1 md:gap-2 text-[var(--text-primary)] truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shrink-0"></span> Đang Chạy
                                </p>
                            </div>
                            <div className="bg-[var(--total-bg)] rounded-lg md:rounded-xl p-1.5 md:p-3 border border-[var(--border-color)] box-border">
                                <p className="text-[8px] md:text-xs text-[var(--text-muted)] mb-0.5 md:mb-1 truncate">Tốc Độ</p>
                                <p className="text-[9px] md:text-sm font-bold text-[var(--text-primary)] font-mono truncate">1.2K/h</p>
                            </div>
                        </div>
                    </div>

                    {/* Mini completion panel floating above */}
                    <div className="flex absolute top-0 right-0 md:top-4 md:-right-4 w-[180px] sm:w-[220px] scale-90 sm:scale-100 origin-top-right glass-panel rounded-xl p-2 sm:p-3 items-center gap-2 sm:gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-[#FF0000]/20 floating-delayed z-30">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FF0000]/10 flex items-center justify-center border border-[#FF0000]/30 shrink-0">
                            <i className="fa-solid fa-check text-[#FF0000] text-xs sm:text-sm"></i>
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-[var(--text-primary)] truncate">Đơn Hàng #8942</p>
                            <p className="text-[8px] sm:text-[10px] text-[var(--text-secondary)] truncate">Youtube Subs đã hoàn thành</p>
                        </div>
                    </div>

                    {/* Mini TikTok Views Panel floating on the left */}
                    <div className="flex absolute top-[55%] left-0 md:top-1/2 md:-left-16 transform -translate-y-1/2 w-[140px] sm:w-[160px] scale-90 sm:scale-100 origin-left glass-panel rounded-xl p-2 sm:p-2.5 items-center gap-1.5 sm:gap-2 shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-white/10 floating z-30">
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                            <i className="fa-brands fa-tiktok text-white text-[10px] sm:text-xs"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] sm:text-[11px] font-bold text-[var(--text-primary)] leading-tight mb-0.5 truncate">TikTok Views</p>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <span className="text-[var(--service-item-text)] text-[8px] sm:text-[9px] font-mono whitespace-nowrap"><i className="fa-solid fa-arrow-trend-up"></i> +125K</span>
                                <div className="h-0.5 sm:h-1 flex-1 bg-black/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[75%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ambient Glow behind dashboard */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#1877F2]/20 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
                </div>
            </div>
        </section>
    );
}
