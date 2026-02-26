import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const SMM_API_URL = process.env.SMM_PROVIDER_API_URL || '';
const SMM_API_KEY = process.env.SMM_PROVIDER_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const supabaseAuth = await createServerClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { service_id, target_link, quantity, reactType, comment, note } = body;

        if (!service_id || !target_link || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Get service details
        const { data: service, error: svcErr } = await supabaseAuth
            .from('services')
            .select('*')
            .eq('id', service_id)
            .eq('is_active', true)
            .single();

        if (svcErr || !service) {
            return NextResponse.json({ error: 'Service not found or inactive' }, { status: 404 });
        }

        if (quantity < service.min_quantity || quantity > service.max_quantity) {
            return NextResponse.json({
                error: `Quantity must be between ${service.min_quantity} and ${service.max_quantity}`
            }, { status: 400 });
        }

        // 3. Calculate charge
        const totalCharge = (quantity / 1000) * service.rate;

        // 4. Check & deduct balance
        const { data: profile, error: profileErr } = await supabaseAuth
            .from('profiles')
            .select('balance')
            .eq('id', userId)
            .single();

        if (profileErr || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        if (profile.balance < totalCharge) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        const newBalance = profile.balance - totalCharge;
        const { error: updateErr } = await supabaseAuth
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userId);

        if (updateErr) {
            return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
        }

        // 5. Forward order to provider
        let providerOrderId = null;
        let providerStatus = 'Pending';

        try {
            const payload: Record<string, string> = {
                key: SMM_API_KEY,
                action: 'add',
                service: String(service.provider_service_id),
                link: target_link,
                quantity: String(quantity),
            };

            if (reactType) payload.reactType = reactType;
            if (comment) payload.comment = comment; // Note: Some SMM panels use 'comments'
            if (note) payload.note = note;

            const providerRes = await fetch(SMM_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(payload),
            });

            const providerData = await providerRes.json();
            console.log('Provider order response:', providerData);

            if (providerData.order) {
                providerOrderId = String(providerData.order);
                providerStatus = 'Processing';
            } else if (providerData.error) {
                console.error('Provider order error:', providerData.error);
                providerStatus = 'Provider Error';
                // Refund balance if provider rejects
                await supabaseAuth.from('profiles').update({ balance: profile.balance }).eq('id', userId);
                return NextResponse.json({ error: `Provider error: ${providerData.error}` }, { status: 502 });
            }
        } catch (providerErr) {
            console.error('Provider API call failed:', providerErr);
            // Refund balance
            await supabaseAuth.from('profiles').update({ balance: profile.balance }).eq('id', userId);
            return NextResponse.json({ error: 'Provider API unreachable' }, { status: 502 });
        }

        // 6. Create order record
        const { data: order, error: orderErr } = await supabaseAuth
            .from('orders')
            .insert({
                user_id: userId,
                service_id: service.id,
                target_link,
                quantity,
                total_charge: totalCharge,
                status: providerStatus,
                provider_order_id: providerOrderId,
                provider_status: providerStatus,
            })
            .select('id')
            .single();

        if (orderErr) {
            console.error('Order insert error:', orderErr);
            return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            provider_order_id: providerOrderId,
            total_charge: totalCharge,
            status: providerStatus,
        });

    } catch (error) {
        console.error('Order error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
