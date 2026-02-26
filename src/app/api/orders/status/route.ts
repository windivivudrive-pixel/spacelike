import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const SMM_API_URL = process.env.SMM_PROVIDER_API_URL || '';
const SMM_API_KEY = process.env.SMM_PROVIDER_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
    try {
        const supabaseAuth = await createServerClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { order_ids, order_id } = body;

        // Support both single order_id or array of order_ids
        const targetIds = order_ids || (order_id ? [order_id] : []);

        if (!targetIds || targetIds.length === 0) {
            return NextResponse.json({ error: 'Missing order_ids' }, { status: 400 });
        }

        // Get order records
        const { data: orders, error: ordersErr } = await supabaseAuth
            .from('orders')
            .select('*')
            .in('id', targetIds)
            .eq('user_id', session.user.id);

        if (ordersErr || !orders || orders.length === 0) {
            return NextResponse.json({ error: 'Orders not found' }, { status: 404 });
        }

        // Filter out orders that don't have a provider_order_id linked yet
        const validOrders = orders.filter(o => o.provider_order_id);

        if (validOrders.length === 0) {
            return NextResponse.json({ error: 'No provider orders linked', status: 'Pending' });
        }

        const providerOrderIds = validOrders.map(o => o.provider_order_id).join(',');

        // Check status from provider
        const providerRes = await fetch(SMM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                key: SMM_API_KEY,
                action: 'status',
                orders: providerOrderIds, // Use 'orders' parameter for multiple IDs
            }),
        });

        const providerData = await providerRes.json();
        const results = [];

        // providerData returns an object with order IDs as keys if multiple are requested
        for (const order of validOrders) {
            const pOrderId = order.provider_order_id as string;
            // The provider response can be a single object (if 1 order) or a map of objects
            const pDataForOrder = validOrders.length === 1 ? providerData : (providerData[pOrderId] || {});

            if (pDataForOrder && !pDataForOrder.error) {
                const newStatus = pDataForOrder.status || order.provider_status;
                const mappedStatus = mapProviderStatus(newStatus);

                // Only update if status changed to save DB calls
                if (newStatus !== order.provider_status || mappedStatus !== order.status) {
                    const isNowCanceled = mappedStatus === 'Canceled' || mappedStatus === 'Refunded';
                    const isNowPartial = mappedStatus === 'Partial';

                    // Only process refund if transitioning INTO a canceled/partial state
                    if ((isNowCanceled || isNowPartial) && order.status !== mappedStatus) {
                        let refundAmount = 0;

                        if (isNowCanceled) {
                            refundAmount = order.total_charge;
                        } else if (isNowPartial && pDataForOrder.remains) {
                            const remains = parseFloat(pDataForOrder.remains);
                            if (!isNaN(remains) && order.quantity > 0) {
                                refundAmount = (remains / order.quantity) * order.total_charge;
                            }
                        }

                        if (refundAmount > 0) {
                            const { data: profile } = await supabaseAuth
                                .from('profiles')
                                .select('balance')
                                .eq('id', session.user.id)
                                .single();

                            if (profile) {
                                await supabaseAuth
                                    .from('profiles')
                                    .update({ balance: profile.balance + refundAmount })
                                    .eq('id', session.user.id);

                                await supabaseAuth
                                    .from('transactions')
                                    .insert({
                                        user_id: session.user.id,
                                        type: 'REFUND',
                                        amount_vnd: refundAmount,
                                        total_amount: refundAmount,
                                        status: 'SUCCESS',
                                        gateway_id: `REFUND_ORDER_${order.id}`,
                                        content: `Hoàn tiền tự động - Đơn #${order.id} (${mappedStatus})`
                                    });
                            }
                        }
                    }

                    await supabaseAuth
                        .from('orders')
                        .update({
                            provider_status: newStatus,
                            status: mappedStatus,
                        })
                        .eq('id', order.id);
                }

                results.push({
                    order_id: order.id,
                    provider_order_id: pOrderId,
                    status: mappedStatus,
                    provider_status: newStatus,
                    charge: pDataForOrder.charge,
                    start_count: pDataForOrder.start_count,
                    remains: pDataForOrder.remains,
                });
            } else {
                results.push({
                    order_id: order.id,
                    provider_order_id: pOrderId,
                    status: order.status,
                    provider_status: order.provider_status,
                    error: pDataForOrder?.error || 'Status fetch failed'
                });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function mapProviderStatus(providerStatus: string): string {
    const statusMap: Record<string, string> = {
        'Pending': 'Pending',
        'In progress': 'Processing',
        'Processing': 'Processing',
        'Completed': 'Completed',
        'Partial': 'Partial',
        'Canceled': 'Canceled',
        'Refunded': 'Refunded',
    };
    return statusMap[providerStatus] || providerStatus;
}
