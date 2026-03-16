"use client";

import Link from "next/link";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function SeedingBanner() {
    const { theme } = usePreferences();

    return (
        <section className="py-20 relative overflow-hidden bg-brand-accent/95">
            {/* Background decorations matching illustration style */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent to-red-600 opacity-50"></div>

            <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
                <div
                    className="flex flex-col lg:flex-row items-center relative min-h-[600px] gap-8"
                >
                    {/* Left: Device Images */}
                    <div className="relative w-full lg:w-1/2 flex items-center justify-start lg:justify-start p-4 lg:p-4 z-10">
                        <div className="relative w-full max-sm:max-w-md lg:max-w-lg -ml-4 lg:-ml-12">
                            {/* iMac Image */}
                            <img
                                src="/imac1.png"
                                alt="iMac Desktop"
                                className="w-full h-auto object-contain drop-shadow-2xl floating"
                            />
                            {/* Phone Image - Overlapping, refined position */}
                            <img
                                src="/phone.png"
                                alt="iPhone Mobile"
                                className="absolute bottom-[-10%] left-[62%] lg:left-[68%] w-[28%] lg:w-[36%] h-auto object-contain drop-shadow-2xl floating-delayed z-20"
                            />
                        </div>
                    </div>

                    {/* Right: Content (Restored from original) */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold w-fit mb-6">
                            <i className="fa-solid fa-chart-line"></i>
                            Tăng Trưởng Bền Vững
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
                            Tại sao <span className="text-white/80">Seeding</span> lại quan trọng?
                        </h2>

                        <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-2xl">
                            Trong kỷ nguyên số, một sản phẩm tốt chưa đủ nếu không có ai nhắc đến nó.
                            <strong> Seeding mạng xã hội</strong> chính là "mồi lửa" giúp thổi bùng sự chú ý, tạo hiệu ứng đám đông và xây dựng niềm tin mãnh liệt từ những tương tác đầu tiên. Nó giúp bạn phá vỡ sự im lặng và thúc đẩy tỷ lệ chuyển đổi hiệu quả hơn bao giờ hết.
                        </p>

                        <ul className="flex flex-col gap-4 mb-10 text-white/90">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="font-medium">Tạo hiệu ứng chim mồi thu hút khách hàng thật</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="font-medium">Tăng độ uy tín (Trust) ngay lập tức cho bài viết</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <span className="font-medium">Đẩy sản phẩm lên xu hướng thuật toán dễ dàng</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="#order-panel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 rounded-xl bg-white text-brand-accent font-bold text-lg hover:bg-gray-100 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2 shadow-lg"
                            >
                                Đặt Hàng Ngay <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all text-center"
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
