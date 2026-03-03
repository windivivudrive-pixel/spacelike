"use client";

import React from 'react';

const benefits = [
    {
        num: '01',
        title: 'BẢO ĐẢM',
        icon: 'fa-shield-halved',
        desc: 'Tất cả các dịch vụ được cung cấp đều có bảo hành, đảm bảo an tâm tuyệt đối.',
    },
    {
        num: '02',
        title: 'ỦNG HỘ',
        icon: 'fa-headset',
        desc: 'Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giải đáp mọi thắc mắc của bạn nhanh chóng.',
    },
    {
        num: '03',
        title: 'CHẤT LƯỢNG',
        icon: 'fa-gem',
        desc: 'Dịch vụ chất lượng cao nhất thị trường, mang lại hiệu quả thực tế và bền vững.',
    },
    {
        num: '04',
        title: 'BẮT ĐẦU NGAY LẬP TỨC',
        icon: 'fa-rocket',
        desc: 'Hệ thống tự động xử lý đơn hàng chỉ trong vài giây sau khi bạn thanh toán.',
    },
    {
        num: '05',
        title: 'TỐC ĐỘ',
        icon: 'fa-angles-right',
        desc: 'Tốc độ hoàn thành cực nhanh, đáp ứng mọi deadline khắt khe nhất của chiến dịch.',
    },
    {
        num: '06',
        title: 'BẢO MẬT',
        icon: 'fa-lock',
        desc: 'Thông tin cá nhân và tài khoản của bạn được mã hóa và bảo mật ở mức cao nhất.',
    }
];

export default function BenefitsSection() {
    return (
        <section className="py-24 relative z-10 border-t border-[var(--border-color)] bg-transparent">
            {/* Top divider */}
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-12">
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] tracking-wide">
                        Lợi ích của <span className="text-[var(--text-primary)]">chúng ta</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-[var(--border-color)] border-t border-b">
                    {benefits.map((item, index) => (
                        <div
                            key={index}
                            className="group border-r border-b border-[var(--border-color)] p-6 flex flex-col min-h-[320px] hover:bg-brand-accent transition-all duration-300 cursor-pointer overflow-hidden relative"
                        >
                            {/* Default State: icon + title at top */}
                            <div className="group-hover:opacity-0 transition-opacity duration-300">
                                <i className={`fa-solid ${item.icon} text-brand-accent text-3xl opacity-80 font-light`}></i>
                                <h3 className="text-[var(--text-primary)] font-bold uppercase tracking-wider text-sm mt-4">{item.title}</h3>
                            </div>

                            {/* Hover State: overlay */}
                            <div className="absolute inset-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">{item.title}</h3>
                                <p className="text-white text-sm leading-relaxed">{item.desc}</p>
                            </div>

                            {/* Number (Always at bottom) */}
                            <div className="mt-auto text-[var(--text-muted)] group-hover:text-white/80 font-mono text-sm transition-colors duration-300 relative z-10">
                                {item.num}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
