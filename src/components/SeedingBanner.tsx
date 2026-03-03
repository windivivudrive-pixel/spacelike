"use client";

import Link from "next/link";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function SeedingBanner() {
    const { theme } = usePreferences();

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(236,57,44,0.15)] border-2 border-brand-accent/50 relative"
                    style={{ background: 'var(--bg-glass-card)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                >
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-pink/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                    {/* Left: Image */}
                    <div className="relative h-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center p-8 bg-gradient-to-br from-black/20 to-transparent">
                        <img
                            src="/banner webspace.png"
                            alt="Seeding Mạng Xã Hội"
                            className="w-full max-w-lg object-contain drop-shadow-[0_0_30px_rgba(236,57,44,0.3)] hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="p-8 lg:pr-16 lg:py-16 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-semibold w-fit mb-6">
                            <i className="fa-solid fa-chart-line"></i>
                            Tăng Trưởng Bền Vững
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--text-primary)] leading-tight mb-6">
                            Tại sao <span className="text-brand-accent">Seeding</span> lại quan trọng?
                        </h2>

                        <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
                            Trong kỷ nguyên số, một sản phẩm tốt chưa đủ nếu không có ai nhắc đến nó.
                            <strong> Seeding mạng xã hội</strong> chính là "mồi lửa" giúp thổi bùng sự chú ý, tạo hiệu ứng đám đông và xây dựng niềm tin mãnh liệt từ những tương tác đầu tiên. Nó giúp bạn phá vỡ sự im lặng và thúc đẩy tỷ lệ chuyển đổi hiệu quả hơn bao giờ hết.
                        </p>

                        <ul className="flex flex-col gap-4 mb-10 text-[var(--text-secondary)]">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-brand-accent shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="text-[var(--text-primary)] font-medium">Tạo hiệu ứng chim mồi thu hút khách hàng thật</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-brand-accent shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="text-[var(--text-primary)] font-medium">Tăng độ uy tín (Trust) ngay lập tức cho bài viết</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-brand-accent shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="text-[var(--text-primary)] font-medium">Đẩy sản phẩm lên xu hướng thuật toán dễ dàng</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="#order-panel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-accent to-orange-500 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(236,57,44,0.4)] hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2"
                            >
                                Đặt Hàng Ngay <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-lg hover:border-brand-accent hover:text-brand-accent transition-all text-center"
                            >
                                Bảng Điều Khiển
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
