import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/dashboard/DashboardNav';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ParticlesBackground from '@/components/ParticlesBackground';
import { PreferencesProvider } from '@/contexts/PreferencesContext';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (false) { // bypass for testing
        redirect('/');
    }

    const userMetadata = session?.user?.user_metadata;
    const displayName = userMetadata?.full_name || userMetadata?.name || session?.user?.email || 'User';

    let initialBalance = 0;
    if (session?.user?.id) {
        const { data } = await supabase.from('profiles').select('balance').eq('id', session?.user?.id).single();
        if (data && data.balance) {
            initialBalance = Number(data.balance);
        }
    }

    return (
        <PreferencesProvider>
            <div className="min-h-screen text-white relative">

                <ParticlesBackground />

                {/* Top Bar: Logo + User Info */}
                <header style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} className="sticky top-0 z-50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <a href="/dashboard" className="flex items-center gap-2 shrink-0">
                                <img
                                    src="/logo spacelike.png"
                                    alt="SpaceLike Logo"
                                    className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)]"
                                />
                            </a>

                            {/* Right: User Info & Preferences */}
                            <DashboardHeader
                                userName={displayName}
                                initialBalance={initialBalance}
                                userId={session?.user?.id}
                                userEmail={session?.user?.email}
                            />
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} className="border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
                        <DashboardNav />
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="space-y-6">{children}</div>
                </main>
            </div>
        </PreferencesProvider>
    );
}
