"use client";

import { useState } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';
import Link from 'next/link';

export default function Footer() {
    const { theme } = usePreferences();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    return (
        <>
            <footer className="bg-[var(--bg-glass)] backdrop-blur-md border-t border-[var(--border-color)] pt-16 pb-8 relative z-10 w-full">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-[var(--border-color)] pb-12">

                        {/* Brand details */}
                        <div className="mb-8 md:mb-0 max-w-sm">
                            <a href="#" className="flex items-center gap-3 mb-4">
                                <img
                                    src={theme === 'dark' ? '/logo spacelike.png' : '/logo spacelike light.png'}
                                    alt="SpaceLike Logo"
                                    className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)]"
                                />
                            </a>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Bộ công cụ thiết yếu để xây dựng và phát triển thông điệp trên MXH. Hệ thống SMM panel hoàn thiện, giá rẻ và bảo mật.</p>
                        </div>

                        {/* Social links */}
                        <div className="flex flex-col items-center md:items-end">
                            <p className="text-[var(--text-primary)] font-bold mb-4 font-display">THEO DÕI CHÚNG TÔI</p>
                            <div className="flex gap-4">
                                <a href="#" className="w-12 h-12 rounded-full bg-[var(--service-item-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#1877F2] hover:-translate-y-1 transition-all"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                                <a href="#" className="w-12 h-12 rounded-full bg-[var(--service-item-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#0088cc] hover:-translate-y-1 transition-all"><i className="fa-brands fa-telegram text-lg"></i></a>
                                <a href="#" className="w-12 h-12 rounded-full bg-[var(--service-item-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#1DA1F2] hover:-translate-y-1 transition-all"><i className="fa-brands fa-twitter text-lg"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
                        <p>&copy; 2026 SpaceLike. Developed by HUGs.</p>
                        <div className="flex gap-6">
                            <button onClick={() => setShowPrivacy(true)} className="hover:text-brand-accent transition-colors tracking-widest uppercase">Quy định bảo mật</button>
                            <button onClick={() => setShowTerms(true)} className="hover:text-brand-accent transition-colors tracking-widest uppercase">Điều khoản</button>
                            <Link href="/blog" className="hover:text-brand-accent transition-colors tracking-widest uppercase">Blog</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Privacy Policy Modal */}
            {showPrivacy && (
                <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowPrivacy(false)}>
                    <div className="bg-[#111] border border-brand-accent/30 p-6 md:p-8 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto m-auto relative shadow-[0_0_30px_rgba(236,57,44,0.15)]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">Quy định Bảo Mật</h2>
                            <button onClick={() => setShowPrivacy(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl p-2 rounded-full hover:bg-[var(--input-bg)] transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="text-[var(--text-secondary)] space-y-4 text-sm leading-relaxed">
                            <p><strong>1. Thu thập thông tin:</strong> Chúng tôi thu thập các thông tin cơ bản khi bạn đăng ký tài khoản bao gồm email, tên đăng nhập để phục vụ cho việc quản lý tài khoản và hỗ trợ dịch vụ.</p>
                            <p><strong>2. Sử dụng thông tin:</strong> Thông tin của bạn được sử dụng mục đích duy nhất là cung cấp và cải thiện dịch vụ SMM Panel. Chúng tôi cam kết KHÔNG bán, chia sẻ hay trao đổi thông tin cá nhân của người dùng cho bất kỳ bên thứ ba nào.</p>
                            <p><strong>3. Bảo mật dữ liệu:</strong> Mọi giao dịch và thông tin tài khoản được lưu trữ trên máy chủ bảo mật an toàn với mã hóa đường truyền SSL/TLS.</p>
                            <p><strong>4. Quyền của người dùng:</strong> Bạn có quyền yêu cầu trích xuất, chỉnh sửa hoặc xóa toàn bộ thông tin tài khoản của mình khỏi hệ thống của Space Like bất cứ lúc nào bằng cách liên hệ với bộ phận hỗ trợ.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms of Service Modal */}
            {showTerms && (
                <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowTerms(false)}>
                    <div className="bg-[#111] border border-brand-accent/30 p-6 md:p-8 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto m-auto relative shadow-[0_0_30px_rgba(236,57,44,0.15)]" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">Điều Khoản Dịch Vụ</h2>
                            <button onClick={() => setShowTerms(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl p-2 rounded-full hover:bg-[var(--input-bg)] transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="text-[var(--text-secondary)] space-y-4 text-sm leading-relaxed">
                            <p><strong>1. Chấp nhận điều khoản:</strong> Bằng cách sử dụng dịch vụ của Space Like, bạn đồng ý tuân thủ toàn bộ các điều khoản được liệt kê tại đây.</p>
                            <p><strong>2. Dịch vụ cung cấp:</strong> Chúng tôi cung cấp các gói dịch vụ tiếp thị mạng xã hội (SMM). Tùy từng gói bảo hành cụ thể được ghi chú rõ trong chi tiết dịch vụ.</p>
                            <p><strong>3. Thanh toán và Hoàn tiền:</strong> Các đơn hàng lỗi hoặc hệ thống không thể xử lý sẽ được tự động báo lỗi và hoàn lại tiền vào số dư tài khoản Space Like của bạn.</p>
                            <p><strong>4. Cấm vi phạm:</strong> Tuyệt đối không sử dụng dịch vụ mảng xã hội cho các bài đăng có chứa nội dung phản động, vi phạm pháp luật, đồi trụy, cờ bạc hoặc trái với thuần phong mỹ tục. Nếu phát hiện tài khoản sẽ bị khóa vĩnh viễn.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
