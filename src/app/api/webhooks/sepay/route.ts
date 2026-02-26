import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// VITE_SEPAY_API_KEY from environment or directly from .env.local
const SEPAY_API_KEY = process.env.VITE_SEPAY_API_KEY || process.env.SEPAY_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Must use service role to bypass RLS

export async function OPTIONS() {
    return NextResponse.json({ message: 'OK' }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sepay-api-key',
        }
    });
}

export async function POST(req: Request) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sepay-api-key',
    };

    try {
        if (!SEPAY_API_KEY) {
            console.error("Missing SEPAY_API_KEY environment variable.");
            return NextResponse.json({ error: "Server misconfiguration." }, { status: 500, headers: corsHeaders });
        }

        // Lấy API Key từ Header của request (SePay gửi: "Authorization": "Apikey API_KEY_CUA_BAN")
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Apikey ')) {
            console.error("Missing or invalid Authorization header format.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const incomingApiKey = authHeader.split('Apikey ')[1].trim();

        if (incomingApiKey !== SEPAY_API_KEY) {
            console.error("Invalid SePay API Key. Possible spoofing attempt.");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        console.log("SePay API Key verified.");

        const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const body = await req.json();
        console.log("Received SePay Webhook:", body);

        const { transferAmount, content, gateway, transactionDate, referenceCode, id: gateway_id } = body;

        if (!transferAmount || !content) {
            return NextResponse.json({ error: "Missing transferAmount or content" }, { status: 400, headers: corsHeaders });
        }

        // Extract Payment Code from Content (SLXXXXX)
        const match = content.match(/SL\s*([a-zA-Z0-9]{5,11})/i);

        if (!match) {
            console.log("No valid payment code found in content:", content);
            return NextResponse.json({ message: "No payment code found, ignored." }, { status: 200, headers: corsHeaders });
        }

        const paymentCode = match[1].toUpperCase();
        console.log("Extracted Payment Code:", paymentCode);

        // Find User by Payment Code
        const { data: userProfile, error: userError } = await supabaseClient
            .from('profiles')
            .select('id, balance')
            .eq('payment_code', paymentCode)
            .single();

        if (userError || !userProfile) {
            console.error("User not found for code:", paymentCode, userError);
            // Trả về 200 OK để SePay không gửi lại.
            return NextResponse.json({ message: "User not found." }, { status: 200, headers: corsHeaders });
        }

        // Update User Balance directly with transferAmount (VND)
        const amountVND = Number(transferAmount);
        const newBalance = Number(userProfile.balance || 0) + amountVND;

        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userProfile.id);

        if (updateError) {
            console.error("Failed to update balance:", updateError);
            return NextResponse.json({ error: "Database error updating balance." }, { status: 500, headers: corsHeaders });
        }

        // Record Transaction
        // Check for existing PENDING transaction to update
        const { data: pendingTx } = await supabaseClient
            .from('transactions')
            .select('id')
            .eq('user_id', userProfile.id)
            .eq('amount_vnd', amountVND)
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let txError;

        if (pendingTx) {
            console.log("Found pending transaction, updating:", pendingTx.id);
            const { error } = await supabaseClient
                .from('transactions')
                .update({
                    status: 'SUCCESS',
                    content: content,
                    gateway_id: String(gateway_id || referenceCode),
                    credits_added: amountVND
                })
                .eq('id', pendingTx.id);
            txError = error;
        } else {
            console.log("No pending transaction found, creating new one.");
            const { error } = await supabaseClient
                .from('transactions')
                .insert({
                    user_id: userProfile.id,
                    amount_vnd: amountVND,
                    credits_added: amountVND,
                    type: 'DEPOSIT',
                    content: content,
                    status: 'SUCCESS',
                    gateway_id: String(gateway_id || referenceCode),
                    created_at: new Date().toISOString()
                });
            txError = error;
        }

        if (txError) {
            console.error("Failed to record transaction:", txError);
            // We don't fail the webhook if tx insert fails but balance is updated, but it's a critical log
        }

        console.log(`Successfully added ${amountVND} to balance of user ${userProfile.id}`);

        return NextResponse.json({ success: true, message: `Added ${amountVND} VND.` }, { headers: corsHeaders });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
