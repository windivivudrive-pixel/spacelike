export default function PricingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(236,57,44,0.6)]"></div>
                <h2 className="text-xl font-display font-bold text-white">Service Pricing</h2>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} className="border border-white/10 shadow-2xl rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center group hover:border-brand-accent/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent text-3xl mb-4 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-layer-group"></i>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pricing Modules</h3>
                <p className="text-gray-500 font-medium max-w-sm">Detailed pricing for all services will be displayed here soon.</p>
            </div>
        </div>
    );
}
