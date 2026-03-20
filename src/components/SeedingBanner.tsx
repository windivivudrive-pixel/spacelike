"use client";

import Link from "next/link";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function SeedingBanner() {
    const { theme } = usePreferences();

    return (
        <section className="py-10 md:py-20 relative overflow-hidden bg-brand-accent/95">
            {/* Background decorations matching illustration style */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent to-red-600 opacity-50"></div>

            <div className="container mx-auto px-2 md:px-4 max-w-[1400px] relative z-10">
                <div
                    className="flex flex-row items-center relative min-h-0 lg:min-h-[600px] gap-2 md:gap-8"
                >
                    {/* Left: Device Images */}
                    <div className="relative w-[45%] lg:w-1/2 flex items-center justify-center p-0 md:p-4 z-10">
                        <div className="relative w-full max-w-md lg:max-w-lg lg:-ml-12 mx-auto lg:mx-0">
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

                            {/* Decorative Floating Icons - Scaled/Hidden for mobile */}
                            <img src="/icon/heart.png" className="absolute -top-2 md:-top-6 left-2 md:left-6 w-4 md:w-12 h-auto floating opacity-90 z-30" style={{ animationDelay: '0s', animationDuration: '5s' }} alt="" />
                            <img src="/icon/like.png" className="absolute top-2 md:top-6 -left-4 md:-left-10 w-8 md:w-24 h-auto floating-delayed opacity-90 z-30" style={{ animationDelay: '1.5s', animationDuration: '6s' }} alt="" />
                            <img src="/icon/comment.png" className="absolute -bottom-2 md:-bottom-6 left-2 md:left-6 w-5 md:w-14 h-auto floating opacity-90 z-30" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} alt="" />
                            <img src="/icon/share.png" className="absolute top-0 -right-2 w-4 md:w-11 h-auto floating-delayed opacity-85 z-30" style={{ animationDelay: '0.8s', animationDuration: '7s' }} alt="" />
                            <img src="/icon/view.png" className="absolute bottom-4 md:bottom-10 -right-4 md:-right-8 w-6 md:w-16 h-auto floating opacity-90 z-30" style={{ animationDelay: '3.2s', animationDuration: '5.5s' }} alt="" />
                            
                            {/* Tiny accents - Hidden on very small screens */}
                            <img src="/icon/heart.png" className="hidden md:block absolute top-1/2 -left-20 w-6 h-auto floating opacity-60 z-30" style={{ animationDelay: '4s', animationDuration: '8s' }} alt="" />
                            <img src="/icon/like.png" className="hidden md:block absolute -top-20 right-28 w-12 h-auto floating-delayed opacity-60 z-30" style={{ animationDelay: '1.2s', animationDuration: '9s' }} alt="" />
                            <img src="/icon/view.png" className="absolute bottom-1 md:bottom-2 left-[80%] w-4 md:w-10 h-auto floating opacity-50 z-10" style={{ animationDelay: '2s', animationDuration: '7.5s' }} alt="" />
                        </div>
                    </div>

                    {/* Right: Content (Restored from original) */}
                    <div className="w-[55%] lg:w-1/2 flex flex-col justify-center relative z-10 text-white pl-2 md:pl-0">
                        <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[8px] md:text-sm font-semibold w-fit mb-2 md:mb-6">
                            <i className="fa-solid fa-chart-line text-[8px] md:text-sm"></i>
                            Tăng Trưởng Bền Vững
                        </div>

                        <h2 className="text-sm sm:text-lg md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-1 md:mb-6">
                            Tại sao <span className="text-white/80">Seeding</span> lại quan trọng?
                        </h2>

                        <p className="text-white/80 text-[9px] sm:text-xs md:text-lg mb-2 md:mb-8 leading-snug md:leading-relaxed max-w-2xl">
                            Trong kỷ nguyên số, một sản phẩm tốt chưa đủ nếu không có ai nhắc đến nó.
                            <strong className="hidden md:inline"> Seeding mạng xã hội</strong> chính là "mồi lửa" giúp thổi bùng sự chú ý, tạo hiệu ứng đám đông và xây dựng niềm tin mãnh liệt từ những tương tác đầu tiên.
                            <span className="hidden md:inline"> Nó giúp bạn phá vỡ sự im lặng và thúc đẩy tỷ lệ chuyển đổi hiệu quả hơn bao giờ hết.</span>
                        </p>

                        <ul className="flex flex-col gap-1 md:gap-4 mb-3 md:mb-10 text-white/90">
                            <li className="flex items-center gap-1.5 md:gap-3">
                                <div className="w-3 md:w-8 h-3 md:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check text-[6px] md:text-base"></i>
                                </div>
                                <span className="font-medium text-[8px] sm:text-[10px] md:text-base leading-tight">Tạo hiệu ứng chim mồi thu hút khách hàng thật</span>
                            </li>
                            <li className="flex items-center gap-1.5 md:gap-3">
                                <div className="w-3 md:w-8 h-3 md:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check text-[6px] md:text-base"></i>
                                </div>
                                <span className="font-medium text-[8px] sm:text-[10px] md:text-base leading-tight">Tăng độ uy tín ngay lập tức cho bài viết</span>
                            </li>
                            <li className="flex items-center gap-1.5 md:gap-3">
                                <div className="w-3 md:w-8 h-3 md:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-check text-[6px] md:text-base"></i>
                                </div>
                                <span className="font-medium text-[8px] sm:text-[10px] md:text-base leading-tight">Đẩy sản phẩm lên xu hướng dễ dàng</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-1.5 md:gap-4">
                            <Link
                                href="#order-panel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 md:px-8 py-1.5 md:py-4 rounded-md md:rounded-xl bg-white text-brand-accent font-bold text-[8px] md:text-lg hover:bg-gray-100 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-1 shadow-sm md:shadow-lg w-fit"
                            >
                                Đặt Hàng <i className="fa-solid fa-arrow-right text-[8px] md:text-base hidden sm:inline-block"></i>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-3 md:px-8 py-1.5 md:py-4 rounded-md md:rounded-xl bg-white/10 border border-white/20 text-white font-bold text-[8px] md:text-lg hover:bg-white/20 transition-all text-center w-fit hidden sm:block"
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
