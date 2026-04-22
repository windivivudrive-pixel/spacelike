"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ThemeLogo from '@/components/ThemeLogo';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Confirm there is an active session (user clicked email link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setErrorMsg('Không tìm thấy phiên đăng nhập. Link khôi phục có thể đã hết hạn.');
            }
        };
        checkSession();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!password || !confirmPassword) {
            setErrorMsg('Vui lòng nhập đầy đủ mật khẩu mới.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Mật khẩu nhập lại không khớp.');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccessMsg('Đổi mật khẩu thành công! Nhấn vào đây để về trang chủ.');
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setErrorMsg(error.message || 'Đã có lỗi xảy ra. Hãy thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(236,57,44,0.1)] relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <ThemeLogo className="h-10 w-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Tạo Mật Khẩu Mới</h2>
                    <p className="text-gray-400 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                        <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                        <span>{errorMsg}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start gap-2">
                        <i className="fa-solid fa-circle-check mt-0.5"></i>
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Mật khẩu mới</label>
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

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Xác nhận mật khẩu mới</label>
                        <div className="relative text-white">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <i className="fa-solid fa-lock text-gray-500"></i>
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-brand-accent hover:bg-brand-accentHover disabled:bg-brand-accent/50 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-neon"
                    >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Xác nhận Đổi Mật Khẩu'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="w-full mt-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Quay về trang chủ
                    </button>
                </form>
            </div>
        </div>
    );
}
