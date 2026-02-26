"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mounted, setMounted] = useState(false);
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const supabase = createClient();

    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
        try {
            setLoadingProvider(provider);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            setLoadingProvider(null);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur and slight dark tint */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(236,57,44,0.15)] transform transition-transform duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-accent/20 hover:text-brand-accent transition-all duration-200"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/30 mb-4 shadow-neon">
                        <i className="fa-solid fa-user text-brand-accent text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">Đăng Nhập</h2>
                    <p className="text-sm text-gray-400 mt-2">Truy cập vào hệ thống SMM Panel của bạn</p>
                </div>

                {/* Social Logins */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => handleOAuthLogin('google')}
                        disabled={loadingProvider !== null}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors duration-200"
                    >
                        {loadingProvider === 'google' ? (
                            <i className="fa-solid fa-circle-notch fa-spin text-gray-500"></i>
                        ) : (
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        )}
                        {loadingProvider === 'google' ? 'Đang kết nối...' : 'Đăng nhập bằng Google'}
                    </button>
                    <button
                        onClick={() => handleOAuthLogin('facebook')}
                        disabled={loadingProvider !== null}
                        className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] disabled:bg-[#1877F2]/70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md shadow-[#1877F2]/20"
                    >
                        {loadingProvider === 'facebook' ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            <i className="fa-brands fa-facebook-f text-lg"></i>
                        )}
                        {loadingProvider === 'facebook' ? 'Đang kết nối...' : 'Đăng nhập bằng Facebook'}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2 mb-6">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-wider font-medium">hoặc email</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Traditional Login Form */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <div className="relative text-white">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <i className="fa-solid fa-envelope text-gray-500"></i>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                            <a href="#" className="text-xs text-brand-accent hover:text-brand-accentHover transition-colors">Quên mật khẩu?</a>
                        </div>
                        <div className="relative text-white">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <i className="fa-solid fa-lock text-gray-500"></i>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-bold font-display tracking-wider py-3.5 rounded-xl transition-all duration-200 mt-2 shadow-neon group">
                        <span className="flex items-center justify-center gap-2">
                            Đăng Nhập <i className="fa-solid fa-arrow-right-to-bracket group-hover:translate-x-1 transition-transform"></i>
                        </span>
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    Chưa có tài khoản? <a href="#" className="text-white font-semibold hover:text-brand-accent transition-colors">Đăng ký ngay</a>
                </div>

            </div>
        </div>,
        document.body
    );
}
