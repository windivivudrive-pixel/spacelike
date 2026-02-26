"use client";

import { useState, useEffect } from 'react';

export default function OrderPanel({ selectedCategoryName }: { selectedCategoryName?: string }) {
    const [quantity, setQuantity] = useState<number>(1000);
    const [servicePrice, setServicePrice] = useState<number>(0.15);
    const [category, setCategory] = useState<string>('ig_followers');

    const total = (Math.max(0, quantity) / 1000) * servicePrice;

    useEffect(() => {
        if (selectedCategoryName) {
            const lower = selectedCategoryName.toLowerCase();
            if (lower.includes('instagram')) setCategory('ig_followers');
            else if (lower.includes('facebook')) setCategory('fb_likes');
            else if (lower.includes('tiktok')) setCategory('tk_views');
            else if (lower.includes('youtube')) setCategory('yt_subs');
        }
    }, [selectedCategoryName]);

    return (
        <section id="order" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-4xl">

                <div className="relative glass-panel rounded-[2rem] p-1 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-brand-accent/20 hover:border-brand-accent/40 transition-colors duration-500">

                    {/* Top neon border gradient effect */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-80"></div>

                    <div className="bg-[#050505]/60 backdrop-blur-xl rounded-[calc(2rem-4px)] p-8 md:p-12">

                        <div className="flex items-start gap-5 mb-10">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center shadow-inner">
                                <i className="fa-solid fa-satellite-dish text-brand-accent text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="font-display text-3xl font-bold text-white tracking-wide">Tạo Đơn Hàng Mới</h2>
                                <p className="text-gray-400 mt-1">Điền thông tin và số lượng để bắt đầu.</p>
                            </div>
                        </div>

                        {/* Main Form inside console */}
                        <form className="space-y-6">

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 tracking-wider uppercase block">
                                    <i className="fa-solid fa-folder-open mr-2 text-brand-accent/70"></i> Danh Mục Dịch Vụ
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className={`fa-brands text-gray-400 transition-colors ${category === 'ig_followers' ? 'fa-instagram group-hover:text-[#E1306C]' :
                                            category === 'fb_likes' ? 'fa-facebook group-hover:text-[#1877F2]' :
                                                category === 'tk_views' ? 'fa-tiktok group-hover:text-[#00F2FE]' :
                                                    'fa-youtube group-hover:text-[#FF0000]'
                                            }`}></i>
                                    </div>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-10 py-4 text-white appearance-none focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer hover:bg-[#111]"
                                    >
                                        <option value="ig_followers">Instagram - Followers [Bảo Hành 30 Ngày]</option>
                                        <option value="fb_likes">Facebook - Likes Bài Viết [Siêu Tốc]</option>
                                        <option value="tk_views">TikTok - Lượt Xem [Đề Xuất]</option>
                                        <option value="yt_subs">Youtube - Người Đăng Ký [Thực Tế]</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-caret-down text-brand-accent"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 tracking-wider uppercase block">
                                    <i className="fa-solid fa-layer-group mr-2 text-brand-accent/70"></i> Gói Dịch Vụ
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-bolt text-gray-400"></i>
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            const options = e.target.options;
                                            const price = options[options.selectedIndex].getAttribute('data-price');
                                            if (price) setServicePrice(parseFloat(price));
                                        }}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-10 py-4 text-white appearance-none focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all cursor-pointer hover:bg-[#111]"
                                    >
                                        <option value="s1" data-price="0.15">ID 4022 - Instagram Followers Hảo Hạng - $0.15 / 1000</option>
                                        <option value="s2" data-price="0.08">ID 4023 - Instagram Followers Tiêu Chuẩn - $0.08 / 1000</option>
                                        <option value="s3" data-price="0.45">ID 4024 - Instagram Followers Việt Nam - $0.45 / 1000</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-caret-down text-brand-accent"></i>
                                    </div>
                                </div>

                                {/* Service Info Box */}
                                <div className="mt-2 p-3 rounded-lg border border-brand-accent/20 bg-brand-accent/5 flex items-start gap-3">
                                    <i className="fa-solid fa-circle-info text-brand-accent mt-0.5"></i>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        <strong className="text-brand-accent">Thông số:</strong> Tốc độ 5000-10000/Ngày. Bắt đầu ngay sau 0-1 giờ. Bảo hành tự động lọc đơn rớt trong 30 ngày. Vui lòng không thay đổi link trong quá trình chạy.
                                    </p>
                                </div>
                            </div>

                            {/* Target Link */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 tracking-wider uppercase block">
                                    <i className="fa-solid fa-link mr-2 text-brand-accent/70"></i> Đường Dẫn (Link)
                                </label>
                                <input type="text" placeholder="https://instagram.com/tencuaban" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600" />
                            </div>

                            {/* Quantity and Price row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 tracking-wider uppercase block">
                                        <i className="fa-solid fa-gauge-high mr-2 text-brand-accent/70"></i> Số Lượng
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="100"
                                            max="100000"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                            step="10"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-center"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 font-mono mt-1 px-1">
                                        <span>Min: 100</span>
                                        <span>Max: 100,000</span>
                                    </div>
                                </div>

                                {/* Charge Total */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 tracking-wider uppercase block">
                                        <i className="fa-solid fa-coins mr-2 text-brand-accent/70"></i> Thành Tiền
                                    </label>
                                    <div className="w-full bg-[#050505] shadow-inner border border-brand-accent/30 rounded-xl px-6 py-4 flex justify-between items-center h-[62px]">
                                        <i className="fa-solid fa-wallet text-gray-500"></i>
                                        <span className="font-display text-2xl font-bold text-brand-accent tracking-wider">${total.toFixed(4)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Box */}
                            <div className="pt-6">
                                <button type="button" className="w-full relative overflow-hidden bg-brand-accent text-brand-dark font-display font-bold text-lg tracking-wider py-4 rounded-xl hover:bg-brand-accentHover transition-colors shadow-neon group">
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Thanh Toán & Xác Nhận Đơn &nbsp;<i className="fa-solid fa-check group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>
                                    </span>
                                    {/* Button Hover Shine Effect */}
                                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-shimmer"></div>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
}
