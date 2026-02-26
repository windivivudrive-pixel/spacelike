export default function Footer() {
    return (
        <footer className="bg-[#030303]/60 backdrop-blur-md border-t border-white/5 pt-16 pb-8 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-white/5 pb-12">

                    {/* Brand details */}
                    <div className="mb-8 md:mb-0 max-w-sm">
                        <a href="#" className="flex items-center gap-3 mb-4">
                            <img
                                src="/logo spacelike.png"
                                alt="SpaceLike Logo"
                                className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)]"
                            />
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed">Bộ công cụ thiết yếu để xây dựng và phát triển thông điệp trên MXH. Hệ thống SMM panel hoàn thiện, giá rẻ và bảo mật.</p>
                    </div>

                    {/* Social links */}
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-white font-bold mb-4 font-display">THEO DÕI CHÚNG TÔI</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:-translate-y-1 transition-all"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0088cc] hover:-translate-y-1 transition-all"><i className="fa-brands fa-telegram text-lg"></i></a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] hover:-translate-y-1 transition-all"><i className="fa-brands fa-twitter text-lg"></i></a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-600">
                    <p>&copy; 2026 SpaceLike. Developed by SMM Team.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-brand-accent transition-colors">QUY ĐỊNH BẢO MẬT</a>
                        <a href="#" className="hover:text-brand-accent transition-colors">ĐIỀU KHOẢN</a>
                        <a href="#" className="hover:text-brand-accent transition-colors">TÍCH HỢP API</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
