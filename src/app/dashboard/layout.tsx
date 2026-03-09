import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/dashboard/DashboardNav';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ParticlesBackground from '@/components/ParticlesBackground';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import ThemeLogo from '@/components/ThemeLogo';
import Footer from '@/components/Footer';

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
    let avatarUrl = '/avartar.png'; // default avatar
    if (session?.user?.id) {
        const { data } = await supabase.from('profiles').select('balance, avatar_url').eq('id', session?.user?.id).single();
        if (data && data.balance) {
            initialBalance = Number(data.balance);
        }
        if (data && data.avatar_url) {
            avatarUrl = data.avatar_url;
        } else if (userMetadata?.avatar_url) {
            avatarUrl = userMetadata.avatar_url;
        }
    }

    return (
        <PreferencesProvider>
            <div className="min-h-screen flex flex-col text-[var(--text-primary)] relative transition-colors duration-300">

                <ParticlesBackground />

                {/* Top Bar: Logo + User Info */}
                <header style={{ background: 'var(--bg-glass-header)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} className="sticky top-0 z-50 border-b border-[var(--border-color)] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <a href="/" className="flex items-center gap-3 shrink-0 group">
                                <ThemeLogo className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(236,57,44,0.3)] group-hover:scale-105 transition-transform" />
                            </a>

                            {/* Right: User Info & Preferences */}
                            <DashboardHeader
                                userName={displayName}
                                initialBalance={initialBalance}
                                userId={session?.user?.id}
                                userEmail={session?.user?.email}
                                avatarUrl={avatarUrl}
                            />
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div style={{ background: 'var(--bg-glass-nav)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} className="border-b border-[var(--border-color)] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
                        <DashboardNav />
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-1 w-full">
                    <div className="space-y-6">{children}</div>
                </main>
                <Footer />
            </div>
        </PreferencesProvider>
    );
}
