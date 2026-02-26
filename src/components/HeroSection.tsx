import OrbitIcons from './OrbitIcons';

export default function HeroSection() {
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

                <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.1] tracking-tight text-white drop-shadow-lg">
                    Tăng Cường <br />
                    <span className="text-gradient">Hiện Diện</span><br />
                    Mạng Xã Hội
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed border-l-2 border-brand-accent/50 pl-4">
                    Thúc đẩy tiếp cận, thu hút tương tác và mở rộng tầm ảnh hưởng trên <span className="text-white font-medium">Facebook</span>, <span className="text-white font-medium">TikTok</span>, <span className="text-white font-medium">Instagram</span> và vô số nền tảng khác.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                    <a href="#order" className="px-8 py-4 rounded-full bg-brand-accent text-brand-dark font-bold text-lg hover:bg-brand-accentHover transition-all shadow-neon-intense flex items-center justify-center gap-3">
                        <i className="fa-solid fa-bolt"></i> Bắt Đầu Ngay
                    </a>
                    <a href="#services" className="px-8 py-4 rounded-full glass-panel border border-white/20 text-white hover:border-brand-accent transition-all flex items-center justify-center gap-3">
                        <i className="fa-solid fa-list text-brand-accent"></i> Xem Dịch Vụ
                    </a>
                </div>

                <div className="pt-8 w-full">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">Các nền tảng phổ biến</p>
                    <div className="flex flex-wrap gap-5 text-2xl text-gray-600">
                        <i className="fa-brands fa-facebook hover:text-[#1877F2] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-instagram hover:text-[#E1306C] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-tiktok hover:text-[#00F2FE] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-youtube hover:text-[#FF0000] transition-colors cursor-pointer drop-shadow-md"></i>
                        <i className="fa-brands fa-telegram hover:text-[#0088cc] transition-colors cursor-pointer drop-shadow-md"></i>
                    </div>
                </div>
            </div>

            {/* Right Side / Floating Abstract UI Panels */}
            <div className="md:w-1/2 relative mt-16 md:mt-0 w-full h-[400px] md:h-[600px] perspective-1000">

                {/* ---------- PLANET with 3D Orbit ---------- */}
                {/* Scaled down (scale-90 or scale-85) and shifted up (-mt-8 or -translate-y-[60%]) */}
                <div className="absolute top-1/2 -left-24 md:-left-36 transform -translate-y-[100%] scale-[0.80] w-[280px] h-[280px] md:w-[420px] md:h-[420px] flex items-center justify-center z-30 pointer-events-none origin-center">

                    {/* Planet Body */}
                    <div className="absolute inset-0 m-auto w-36 h-36 md:w-52 md:h-52 rounded-full z-20 overflow-hidden shadow-[0_0_120px_rgba(236,57,44,0.4),0_0_40px_rgba(236,57,44,0.3)]">
                        {/* Surface - dark with subtle warm bands */}
                        <div className="w-full h-full rounded-full planet-surface" style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, #1a1010 0%, #2a1414 8%, #1e1010 16%, #2e1818 24%, #1a1010 32%, #241414 40%, #201212 48%, #2a1818 56%, #1a1010 64%)'
                        }}>
                        </div>
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
                    <svg className="absolute inset-0 m-auto w-[380px] h-[380px] md:w-[420px] md:h-[420px] z-[5] pointer-events-none" viewBox="-210 -210 420 420" fill="none">
                        {/* 0,1 sweep-flag draws the top-right arc of the 45deg rotated ellipse */}
                        <path d="M -134.35,-134.35 A 190 65 45 0 1 134.35,134.35" stroke="rgba(236,57,44,0.5)" strokeWidth="2" strokeDasharray="4 10" />
                    </svg>

                    {/* Orbit path - FRONT half (z-[25] goes in front of the planet) */}
                    <svg className="absolute inset-0 m-auto w-[380px] h-[380px] md:w-[420px] md:h-[420px] z-[25] pointer-events-none" viewBox="-210 -210 420 420" fill="none">
                        {/* 0,0 sweep-flag draws the bottom-left arc of the 45deg rotated ellipse */}
                        <path d="M -134.35,-134.35 A 190 65 45 0 0 134.35,134.35" stroke="rgba(236,57,44,0.5)" strokeWidth="2" strokeDasharray="4 10" />
                    </svg>

                    {/* JS-driven orbit icons - always flat 2D */}
                    <OrbitIcons />

                    {/* Ambient glow behind planet */}
                    <div className="absolute inset-0 m-auto w-56 h-56 md:w-80 md:h-80 rounded-full bg-brand-accent/30 blur-[100px] -z-10"></div>
                </div>
                {/* ------------------------------------------------ */}

                <div className="absolute inset-0 flex items-center justify-center z-10">

                    {/* Main Stats Panel */}
                    <div className="w-[90%] md:w-[420px] md:translate-x-12 glass-panel rounded-2xl p-6 shadow-2xl floating border-t border-l border-white/10 border-r border-b border-black/50" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-5deg) rotateX(5deg)' }}>

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center">
                                    <i className="fa-brands fa-facebook text-[#1877F2] text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Facebook Likes</h4>
                                    <p className="text-xs text-gray-400">@star_traveler</p>
                                </div>
                            </div>
                            <div className="text-green-400 text-xs font-mono bg-green-400/10 px-2 py-1 rounded">
                                <i className="fa-solid fa-arrow-trend-up"></i> +45,200
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs text-brand-accent font-mono font-medium">
                                <span>Tiến Độ Hoàn Thành</span>
                                <span>82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-accent to-yellow-400 w-[82%] shadow-neon relative">
                                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 skew-x-[-20deg] animate-shimmer"></div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 box-border">
                                <p className="text-xs text-gray-500 mb-1">Trạng Thái</p>
                                <p className="text-sm font-bold flex items-center gap-2 text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span> Đang Chạy
                                </p>
                            </div>
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 box-border">
                                <p className="text-xs text-gray-500 mb-1">Tốc Độ Chạy</p>
                                <p className="text-sm font-bold text-white font-mono">1.2K / Phút</p>
                            </div>
                        </div>
                    </div>

                    {/* Mini completion panel floating above */}
                    <div className="absolute top-4 -right-4 w-[220px] glass-panel rounded-xl p-3 flex items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-green-500/20 floating-delayed z-30">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                            <i className="fa-solid fa-check text-green-400 text-sm"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Đơn Hàng #8942</p>
                            <p className="text-[10px] text-gray-400">Youtube Subs đã hoàn thành</p>
                        </div>
                    </div>

                    {/* Mini TikTok Views Panel floating on the left */}
                    <div className="absolute top-1/2 -left-8 md:-left-16 transform -translate-y-1/2 w-[160px] glass-panel rounded-xl p-2.5 flex items-center gap-2 shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-[#00F2FE]/20 floating z-30">
                        <div className="w-7 h-7 rounded-full bg-[#00F2FE]/20 flex items-center justify-center border border-[#00F2FE]/50 shrink-0">
                            <i className="fa-brands fa-tiktok text-[#00F2FE] text-xs"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] font-bold text-white leading-tight mb-0.5">TikTok Views</p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-green-400 text-[9px] font-mono whitespace-nowrap"><i className="fa-solid fa-arrow-trend-up"></i> +125K</span>
                                <div className="h-1 flex-1 bg-black/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#00F2FE] to-[#0098FF] w-[75%]"></div>
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
