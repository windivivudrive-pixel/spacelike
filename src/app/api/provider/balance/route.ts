import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

const SMM_API_URL = process.env.SMM_PROVIDER_API_URL || '';
const SMM_API_KEY = process.env.SMM_PROVIDER_API_KEY || '';

export async function POST(req: Request) {
    try {
        const supabaseAuth = await createServerClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only allow specific admin email to check provider balance
        if (session.user.email !== 'quochungdn151@gmail.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const providerRes = await fetch(SMM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                key: SMM_API_KEY,
                action: 'balance',
            }),
        });

        const providerData = await providerRes.json();

        if (providerData.error) {
            return NextResponse.json({ error: providerData.error }, { status: 400 });
        }

        return NextResponse.json({
            balance: providerData.balance,
            balanceVND: providerData.balanceVND,
            currency: providerData.currency || 'VNĐ'
        });

    } catch (error) {
        console.error('Provider balance check error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
