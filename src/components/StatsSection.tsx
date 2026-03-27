"use client";

import { useEffect, useRef, useState } from 'react';

function Counter({ target, isDecimal }: { target: number, isDecimal?: boolean }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let current = 0;
                const speed = 100;
                const inc = target / speed;

                const updateCount = () => {
                    if (current < target) {
                        current += inc;
                        setCount(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        setCount(target);
                    }
                };

                updateCount();
                if (ref.current) observer.unobserve(ref.current);
            }
        }, { threshold: 0.7 });

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref} className="counter-number">
            {isDecimal ? count.toFixed(4) : Math.ceil(count).toLocaleString('en-US')}
        </span>
    );
}

export default function StatsSection() {
    return (
        <section id="stats" className="py-24 relative z-10 border-t border-[var(--border-color)] overflow-hidden">
            {/* Light overlay */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[150px] -z-10"></div>

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Thống Kê <span className="text-brand-accent">Hệ Thống</span></h2>
                    <p className="text-[var(--text-secondary)]">Tham gia cùng hàng ngàn khách hàng đang trải nghiệm dịch vụ.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

                    <div className="glass-panel p-4 md:p-8 rounded-2xl text-center border border-[var(--border-color)] hover:border-brand-accent/50 transition-colors group cursor-default">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-[var(--total-bg)] rounded-full border border-[var(--border-color)] flex items-center justify-center mb-4 md:mb-6 group-hover:border-brand-accent group-hover:shadow-neon transition-all">
                            <i className="fa-solid fa-satellite text-xl md:text-2xl text-gray-400 group-hover:text-brand-accent transition-colors"></i>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-primary)] mb-1 md:mb-2"><Counter target={1523490} /></h3>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest mt-1 md:mt-2">Đơn hàng hoàn thành</p>
                    </div>

                    <div className="glass-panel p-4 md:p-8 rounded-2xl text-center border border-[var(--border-color)] hover:border-brand-accent/50 transition-colors group cursor-default">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-[var(--total-bg)] rounded-full border border-[var(--border-color)] flex items-center justify-center mb-4 md:mb-6 group-hover:border-brand-accent group-hover:shadow-neon transition-all">
                            <i className="fa-solid fa-users-viewfinder text-xl md:text-2xl text-gray-400 group-hover:text-brand-accent transition-colors"></i>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-primary)] mb-1 md:mb-2"><Counter target={86420} /></h3>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest mt-1 md:mt-2">Thành viên</p>
                    </div>

                    <div className="glass-panel p-4 md:p-8 rounded-2xl text-center border border-[var(--border-color)] hover:border-brand-accent/50 transition-colors group cursor-default">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-[var(--total-bg)] rounded-full border border-[var(--border-color)] flex items-center justify-center mb-4 md:mb-6 group-hover:border-brand-accent group-hover:shadow-neon transition-all">
                            <i className="fa-solid fa-meteor text-xl md:text-2xl text-gray-400 group-hover:text-brand-accent transition-colors"></i>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-primary)] mb-1 md:mb-2 text-brand-accent">$<span className="text-brand-accent"><Counter target={0.005} isDecimal /></span></h3>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest mt-1 md:mt-2">Chi phí khởi điểm</p>
                    </div>

                    <div className="glass-panel p-4 md:p-8 rounded-2xl text-center border border-[var(--border-color)] hover:border-brand-accent/50 transition-colors group cursor-default">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-[var(--total-bg)] rounded-full border border-[var(--border-color)] flex items-center justify-center mb-4 md:mb-6 group-hover:border-brand-accent group-hover:shadow-neon transition-all">
                            <i className="fa-solid fa-headset text-xl md:text-2xl text-gray-400 group-hover:text-brand-accent transition-colors"></i>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-primary)] mb-1 md:mb-2"><Counter target={24} />/<Counter target={7} /></h3>
                        <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest mt-1 md:mt-2">Hỗ trợ khách hàng</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
