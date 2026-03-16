import { createClient } from '@/lib/supabase/server';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

export default async function DashboardOverview() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Try to use full name from providers if available, else email
    const userMetadata = session?.user?.user_metadata;
    const displayName = userMetadata?.username || userMetadata?.name || session?.user?.email || 'User';

    let initialBalance = 0;
    if (session?.user?.id) {
        const { data } = await supabase.from('profiles').select('balance').eq('id', session.user.id).single();
        if (data && data.balance) {
            initialBalance = Number(data.balance);
        }
    }

    return <DashboardOverviewClient displayName={displayName} initialBalance={initialBalance} userId={session?.user?.id} />;
}
