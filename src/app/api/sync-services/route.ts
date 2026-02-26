import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SMM_API_URL = process.env.SMM_PROVIDER_API_URL || '';
const SMM_API_KEY = process.env.SMM_PROVIDER_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

export async function POST(req: Request) {
    try {
        // Verify cron secret
        const authHeader = req.headers.get('Authorization');
        const body = await req.json().catch(() => ({}));

        const providedSecret = authHeader?.replace('Bearer ', '') || body.secret;

        if (!providedSecret || providedSecret !== CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!SMM_API_URL || !SMM_API_KEY) {
            return NextResponse.json({ error: 'Missing provider config' }, { status: 500 });
        }

        // 1. Fetch services from provider
        const providerRes = await fetch(SMM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ key: SMM_API_KEY, action: 'services' }),
        });

        if (!providerRes.ok) {
            return NextResponse.json({ error: 'Provider API error', status: providerRes.status }, { status: 502 });
        }

        const services = await providerRes.json();

        if (!Array.isArray(services)) {
            return NextResponse.json({ error: 'Invalid provider response', data: services }, { status: 502 });
        }

        // 2. Map to internal schema
        const mapped = services.map((s: any) => ({
            provider_service_id: String(s.service),
            name: (s.title || s.name || '').trim(),
            description: (s.description || '').trim(),
            type: s.type || 'Default',
            category: (s.category || 'OTHER').toUpperCase(),
            rate: Math.round(((Number(s.rate) || 0) * 28000 * 1.3) / 100) * 100,
            min_quantity: Number(s.min) || 1,
            max_quantity: Number(s.max) || 100000,
            example_link: s.exampleLink || '',
            start_time: s.startTime || null,
            speed: s.speed || null,
            guarantee: s.guarantee || null,
            average_time: s.averageTime || null,
            is_maintaining: Boolean(s.isMaintaining),
            is_active: !Boolean(s.isMaintaining),
            refill: Boolean(s.refill),
            cancel: Boolean(s.cancel),
            updated_at: new Date().toISOString(),
        }));

        // 3. Upsert into Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await supabase
            .from('services')
            .upsert(mapped, {
                onConflict: 'provider_service_id',
                ignoreDuplicates: false,
            })
            .select('id, provider_service_id');

        if (error) {
            console.error('Upsert error:', error);
            return NextResponse.json({ error: 'DB upsert failed', details: error.message }, { status: 500 });
        }

        // 4. Deactivate services no longer from provider
        const activeProviderIds = mapped.map((s: any) => s.provider_service_id);
        const { error: deactivateErr } = await supabase
            .from('services')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .not('provider_service_id', 'in', `(${activeProviderIds.map((id: string) => `"${id}"`).join(',')})`);

        if (deactivateErr) {
            console.error('Deactivate error:', deactivateErr);
        }

        return NextResponse.json({
            success: true,
            synced: mapped.length,
            categories: [...new Set(mapped.map((s: any) => s.category))],
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
