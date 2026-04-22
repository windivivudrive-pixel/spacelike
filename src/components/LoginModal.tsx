"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function LoginModal({ isOpen, onClose, initialMode = 'login' }: LoginModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');

    // UI States
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Availability States
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const supabase = createClient();

    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
        try {
            setLoadingProvider(provider);
            setErrorMsg('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Error logging in:', error);
            setErrorMsg(error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            setLoadingProvider(null);
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (isForgotPasswordMode) {
            if (!email) {
                setErrorMsg('Vui lòng nhập Email để khôi phục mật khẩu.');
                return;
            }
            setLoadingAuth(true);
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) {
                  if (error.status === 429) {
                    setErrorMsg('Hệ thống đang quá tải, vui lòng thử lại sau.');
                  } else {
                    setErrorMsg(error.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại email.');
                  }
                  return;
                }
                setSuccessMsg('Link khôi phục đã được gửi! Vui lòng kiểm tra email của bạn.');
            } catch (error: any) {
                console.error('Reset password error:', error);
                setErrorMsg('Có lỗi xảy ra. Vui lòng kiểm tra lại email.');
            } finally {
                setLoadingAuth(false);
            }
            return;
        }

        if (isRegisterMode) {
            // Validate Registration
            if (!email || !password || !confirmPassword || !username || !phone) {
                setErrorMsg('Vui lòng điền đầy đủ các trường.');
                return;
            }

            // Regex for Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrorMsg('Định dạng Email không hợp lệ.');
                return;
            }

            // Regex for Vietnamese Phone Number
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(phone)) {
                setErrorMsg('Số điện thoại không hợp lệ (Bắt đầu bằng 03,05,07,08,09 và có 10 số).');
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

            if (usernameStatus === 'taken') {
                setErrorMsg('Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.');
                return;
            }

            if (emailStatus === 'taken') {
                setErrorMsg('Email này đã được đăng ký.');
                return;
            }

            setLoadingAuth(true);
            try {
                // Ensure any existing session is cleared before registering
                await supabase.auth.signOut();

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                            phone_number: phone
                        }
                    }
                });

                if (error) throw error;

                if (data.user?.identities?.length === 0) {
                    setErrorMsg('Email này đã được đăng ký.');
                    setLoadingAuth(false);
                    return;
                }

                // Redirect directly to dashboard without waiting for email verification
                window.location.href = '/dashboard';
            } catch (error: any) {
                console.error('Registration error:', error);
                if (error.status === 429) {
                    setErrorMsg('Hệ thống đang quá tải, vui lòng thử lại sau.');
                } else {
                    setErrorMsg(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
                }
            } finally {
                setLoadingAuth(false);
            }
        } else {
            // Handle Login
            if (!email || !password) {
                setErrorMsg('Vui lòng nhập Email/Username và Mật khẩu.');
                return;
            }

            setLoadingAuth(true);
            try {
                let loginEmail = email;

                // Check if the input is a username (doesn't contain @)
                if (!email.includes('@')) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('email')
                        .eq('username', email)
                        .single();

                    if (profileError || !profile?.email) {
                        throw new Error('Tên đăng nhập không tồn tại.');
                    }
                    loginEmail = profile.email;
                }

                const { error } = await supabase.auth.signInWithPassword({
                    email: loginEmail,
                    password,
                });
                if (error) throw error;

                // Successful login will naturally re-render layout based on session state and probably close modal/reload page
                window.location.href = '/dashboard';
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.status === 429) {
                    setErrorMsg('Hệ thống đang quá tải, vui lòng thử lại sau.');
                } else if (error.message === 'Tên đăng nhập không tồn tại.') {
                    setErrorMsg(error.message);
                } else {
                    setErrorMsg('Thông tin đăng nhập không chính xác.');
                }
            } finally {
                setLoadingAuth(false);
            }
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setPhone('');
        setErrorMsg('');
        setSuccessMsg('');
        setUsernameStatus('idle');
        setEmailStatus('idle');
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setIsForgotPasswordMode(false);
        resetForm();
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check Username Availability
    useEffect(() => {
        if (!isRegisterMode || !username || username.trim().length < 3) {
            setUsernameStatus('idle');
            return;
        }

        const timer = setTimeout(async () => {
            setUsernameStatus('checking');
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username.trim())
                    .maybeSingle();

                if (error) throw error;
                setUsernameStatus(data ? 'taken' : 'available');
            } catch (err) {
                console.error('Error checking username:', err);
                setUsernameStatus('idle');
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [username, isRegisterMode, supabase]);

    // Check Email Availability
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!isRegisterMode || !email || !emailRegex.test(email)) {
            setEmailStatus('idle');
            return;
        }

        const timer = setTimeout(async () => {
            setEmailStatus('checking');
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('email', email.trim())
                    .maybeSingle();

                if (error) throw error;
                setEmailStatus(data ? 'taken' : 'available');
            } catch (err) {
                console.error('Error checking email:', err);
                setEmailStatus('idle');
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [email, isRegisterMode, supabase]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            resetForm(); // reset form when opening
            setIsRegisterMode(initialMode === 'register'); // Sync mode on open
            setIsForgotPasswordMode(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialMode]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur and slight dark tint */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative w-full ${isRegisterMode ? 'max-w-lg' : 'max-w-md'} bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(236,57,44,0.15)] transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-accent/20 hover:text-brand-accent transition-all duration-200"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/30 mb-4 shadow-neon">
                        <i className={`fa-solid ${isForgotPasswordMode ? 'fa-key' : isRegisterMode ? 'fa-user-plus' : 'fa-user'} text-brand-accent text-xl`}></i>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                        {isForgotPasswordMode ? 'Khôi Phục Mật Khẩu' : isRegisterMode ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">
                        {isForgotPasswordMode ? 'Nhập email của bạn để nhận link khôi phục' : isRegisterMode ? 'Tham gia hệ sinh thái SpaceLike ngay hôm nay' : 'Truy cập vào hệ thống SMM Panel của bạn'}
                    </p>
                </div>

                {!isRegisterMode && !isForgotPasswordMode && (
                    <>
                        {/* Social Logins */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loadingProvider !== null || loadingAuth}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors duration-200"
                            >
                                {loadingProvider === 'google' ? (
                                    <i className="fa-solid fa-circle-notch fa-spin text-gray-500"></i>
                                ) : (
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                )}
                                {loadingProvider === 'google' ? 'Đang kết nối...' : 'Đăng nhập bằng Google'}
                            </button>
                            {/* <button
                                onClick={() => handleOAuthLogin('facebook')}
                                disabled={loadingProvider !== null || loadingAuth}
                                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] disabled:bg-[#1877F2]/70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md shadow-[#1877F2]/20"
                            >
                                {loadingProvider === 'facebook' ? (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                ) : (
                                    <i className="fa-brands fa-facebook-f text-lg"></i>
                                )}
                                {loadingProvider === 'facebook' ? 'Đang kết nối...' : 'Đăng nhập bằng Facebook'}
                            </button> */}
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-wider font-medium">hoặc email</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>
                    </>
                )}

                {/* Messages */}
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

                {/* Traditional Auth Form */}
                <form className="space-y-4" onSubmit={handleAuthSubmit}>


                    {isRegisterMode && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Username</label>
                                <div className="relative text-white">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-user-tag text-gray-500"></i>
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full bg-black/50 border ${usernameStatus === 'taken' ? 'border-red-500/50' : usernameStatus === 'available' ? 'border-emerald-500/50' : 'border-white/10'} rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600`}
                                        placeholder="Username"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {usernameStatus === 'checking' && <i className="fa-solid fa-circle-notch fa-spin text-gray-500 text-xs"></i>}
                                        {usernameStatus === 'available' && <i className="fa-solid fa-circle-check text-emerald-500 text-xs"></i>}
                                        {usernameStatus === 'taken' && <i className="fa-solid fa-circle-xmark text-red-500 text-xs"></i>}
                                    </div>
                                </div>
                                {usernameStatus === 'taken' && <p className="text-[10px] text-red-500 ml-1">Tên tài khoản đã tồn tại</p>}
                                {usernameStatus === 'available' && <p className="text-[10px] text-emerald-500 ml-1">Tên tài khoản khả dụng</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Số điện thoại</label>
                                <div className="relative text-white">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-phone text-gray-500"></i>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
                                        placeholder="0912..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">
                            {isForgotPasswordMode ? 'Email' : !isRegisterMode ? 'Email hoặc Tên đăng nhập' : 'Email'}
                        </label>
                        <div className="relative text-white">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <i className={`fa-solid ${(!isRegisterMode && !isForgotPasswordMode) ? 'fa-user-tag' : 'fa-envelope'} text-gray-500`}></i>
                            </div>
                            <input
                                type={(!isRegisterMode && !isForgotPasswordMode) ? "text" : "email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full bg-black/50 border ${isRegisterMode && emailStatus === 'taken' ? 'border-red-500/50' : isRegisterMode && emailStatus === 'available' ? 'border-emerald-500/50' : 'border-white/10'} rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600`}
                                placeholder={(!isRegisterMode && !isForgotPasswordMode) ? "Email hoặc Username" : "name@example.com"}
                            />
                            {isRegisterMode && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    {emailStatus === 'checking' && <i className="fa-solid fa-circle-notch fa-spin text-gray-500 text-xs"></i>}
                                    {emailStatus === 'available' && <i className="fa-solid fa-circle-check text-emerald-500 text-xs"></i>}
                                    {emailStatus === 'taken' && <i className="fa-solid fa-circle-xmark text-red-500 text-xs"></i>}
                                </div>
                            )}
                        </div>
                        {isRegisterMode && emailStatus === 'taken' && <p className="text-[10px] text-red-500 ml-1 mt-1">Email này đã được đăng ký</p>}
                    </div>

                    {!isForgotPasswordMode && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                                {!isRegisterMode && (
                                    <button type="button" onClick={(e) => { e.preventDefault(); setIsForgotPasswordMode(true); setIsRegisterMode(false); setErrorMsg(''); setSuccessMsg(''); setEmail(''); }} className="text-xs text-brand-accent hover:text-brand-accentHover transition-colors">Quên mật khẩu?</button>
                                )}
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
                    )}

                    {isRegisterMode && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Xác nhận Mật khẩu</label>
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
                    )}

                    <button
                        disabled={loadingAuth}
                        className="w-full bg-brand-accent hover:bg-brand-accentHover disabled:bg-brand-accent/50 disabled:cursor-not-allowed text-brand-dark font-bold font-display tracking-wider py-3.5 rounded-xl transition-all duration-200 mt-2 shadow-neon group"
                    >
                        {loadingAuth ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {isForgotPasswordMode ? 'Gửi Link Khôi Phục' : isRegisterMode ? 'Đăng Ký' : 'Đăng Nhập'}
                                <i className={`fa-solid ${isForgotPasswordMode ? 'fa-paper-plane' : isRegisterMode ? 'fa-user-plus' : 'fa-arrow-right-to-bracket'} group-hover:translate-x-1 transition-transform`}></i>
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    {isForgotPasswordMode ? (
                        <button type="button" onClick={() => { setIsForgotPasswordMode(false); setIsRegisterMode(false); resetForm(); }} className="text-white font-semibold hover:text-brand-accent transition-colors">
                            <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại đăng nhập
                        </button>
                    ) : isRegisterMode ? (
                        <>Đã có tài khoản? <button onClick={toggleMode} className="text-white font-semibold hover:text-brand-accent transition-colors">Đăng nhập ngay</button></>
                    ) : (
                        <>Chưa có tài khoản? <button onClick={toggleMode} className="text-white font-semibold hover:text-brand-accent transition-colors">Đăng ký ngay</button></>
                    )}
                </div>

            </div>
        </div>,
        document.body
    );
}
