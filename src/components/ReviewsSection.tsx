"use client";

import React, { useRef } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

const reviews = [
    {
        id: 1,
        author: 'Tran Thanh Trung, 32 tuổi',
        location: 'CRM - TP. HCM',
        summary: 'Tương tác rất tự nhiên',
        text: 'Like với tương tác bên Spacelike làm rất ổn, nhìn rất tự nhiên. Support nhanh, cần chỉnh gì là xử lý liền nên mình khá yên tâm dùng cho dự án của khách hàng khi cần.',
        avatar: '/reviewer1.png'
    },
    {
        id: 2,
        author: 'Duc Pham, 35 tuổi',
        location: 'Leader Marketing - Hà Nội',
        summary: 'Support rất nhanh',
        text: 'Team Spacelike support rất nhanh, dễ trao đổi. Triển khai lẹ mà chất lượng ổn, comment với like đều tăng rất chất lượng.',
        avatar: '/reviewer2.png'
    },
    {
        id: 3,
        author: 'Le Ngoc Quy, 42 tuổi',
        location: 'Area Manager F&B - Đà Nẵng',
        summary: 'Dịch vụ ổn áp nhất',
        text: 'Trước mình cũng thử vài bên rồi nhưng bên này thấy ổn áp nhất. Seeding nhìn thật, không bị giả trân.',
        avatar: '/reviewer3.png'
    },
    {
        id: 4,
        author: 'Misa Nguyen, 30 tuổi',
        location: 'Manager Account - Tp. HCM',
        summary: 'Giao diện rất đẹp',
        text: 'Bên này giao diện rất đẹp, dễ dùng, làm việc có trách nhiệm. Nội dung seeding viết ổn, không bị gượng ép nên hiệu quả tốt hơn.',
        avatar: '/reviewer4.png'
    },
    {
        id: 5,
        author: 'Nguyen Phuong Vy, 26 tuổi',
        location: 'KOLs - Hà Nội',
        summary: 'Build hình ảnh cá nhân',
        text: 'Dùng để hỗ trợ build hình ảnh cá nhân khá ok. Tương tác nhìn rất tự nhiên nên mình cũng tự tin hơn khi đăng bài.',
        avatar: '/reviewer5.png'
    }
];

export default function ReviewsSection() {
    const { theme } = usePreferences();

    return (
        <section className="py-24 relative z-10 bg-transparent overflow-hidden">


            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="mb-16 text-center">
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] tracking-wide">
                        Đánh giá <span className="text-brand-accent">từ dải ngân hà</span>
                    </h2>
                </div>

                <div className="relative group overflow-hidden w-full py-4 relative z-10 before:absolute before:inset-y-0 before:left-0 before:w-16 md:before:w-32 before:bg-gradient-to-r before:from-[var(--bg-default)] before:to-transparent before:z-20 after:absolute after:inset-y-0 after:right-0 after:w-16 md:after:w-32 after:bg-gradient-to-l after:from-[var(--bg-default)] after:to-transparent after:z-20">
                    {/* Scrollable Container */}
                    <div
                        className="flex gap-10 pb-12 pt-8 items-center justify-start animate-scroll-infinite w-max hover:[animation-play-state:paused]"
                    >
                        {[...reviews, ...reviews].map((review, index) => (
                            <div
                                key={`${review.id}-${index}`}
                                className="shrink-0 flex flex-col items-center w-[280px] md:w-[320px] lg:w-[350px]"
                            >
                                {/* Planet Container */}
                                <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] group/planet cursor-pointer">

                                    {/* Planet Body */}
                                    <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_20px_rgba(236,57,44,0.08)] transition-all duration-500">
                                        {/* Surface Image */}
                                        <img src={theme === 'dark' ? '/planet.png' : '/planet-light.png'} alt="Planet Surface" className="absolute inset-0 w-full h-full object-cover rounded-full transition-transform duration-700 group-hover/planet:scale-[1.08]" />
                                        {/* 3D lighting - highlight top-left, shadow bottom-right */}
                                        <div className="absolute inset-0 rounded-full" style={{
                                            background: 'radial-gradient(circle at 30% 25%, rgba(236,100,80,0.25) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.6) 0%, transparent 55%)'
                                        }}></div>
                                        {/* Subtle orange rim at edge */}
                                        <div className="absolute inset-0 rounded-full" style={{
                                            background: 'radial-gradient(circle, transparent 55%, rgba(236,57,44,0.08) 80%, rgba(236,57,44,0.03) 100%)'
                                        }}></div>
                                    </div>

                                    {/* Content overlay on top of planet */}
                                    <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-center p-10 md:p-12 z-10 transition-transform duration-700 group-hover/planet:scale-[1.08]">
                                        {/* Stars */}
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className="fa-solid fa-star text-brand-accent text-[10px]"></i>
                                            ))}
                                        </div>

                                        {/* Review text */}
                                        <h4 className="text-white font-bold mb-2 text-base md:text-sm lg:text-base leading-tight line-clamp-2 drop-shadow-lg">{review.summary}</h4>
                                        <p className="text-white/90 text-sm md:text-xs lg:text-sm leading-relaxed line-clamp-3 drop-shadow-md">{review.text}</p>
                                    </div>


                                </div>

                                {/* Author info BELOW the planet */}
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <div className="relative">
                                        <img
                                            src={review.avatar}
                                            alt={review.author}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-brand-accent/30 shadow-[0_0_10px_rgba(236,57,44,0.3)]"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[var(--text-primary)] font-semibold text-sm">{review.author}</p>
                                        <p className="text-brand-accent text-xs">{review.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Embedded CSS to hide scrollbar and endless scroll */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes scroll-infinite {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-50% - 20px)); /* 50% width + half of the gap space */
                    }
                }
                .animate-scroll-infinite {
                    animation: scroll-infinite 30s linear infinite;
                }
                /* Optional pause on hover */
                .animate-scroll-infinite:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
}
