import { createClient } from 'jsr:@supabase/supabase-js@2'

// Sử dụng API Key SePay của bạn
const SEPAY_API_KEY = "SePay_Secure_tu_tao_2026@";

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sepay-api-key',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Apikey ')) {
            console.error("Missing or invalid Authorization header format.");
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        }

        const incomingApiKey = authHeader.split('Apikey ')[1].trim();

        if (incomingApiKey !== SEPAY_API_KEY) {
            console.error("Invalid SePay API Key.");
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        }

        // Kết nối Supabase sử dụng SERVICE_ROLE_KEY được tích hợp sẵn
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const body = await req.json();
        console.log("Received SePay Webhook:", body);

        const { transferAmount, content, gateway, transactionDate, referenceCode, id: gateway_id } = body;

        if (!transferAmount || !content) {
            return new Response(JSON.stringify({ error: "Missing transferAmount or content" }), { status: 400, headers: corsHeaders });
        }

        // Tìm mã PAYMENT CODE cấu trúc SLXXXXXX
        const match = content.match(/SL\s*([a-zA-Z0-9]{5,11})/i);

        if (!match) {
            console.log("No valid payment code found in content:", content);
            return new Response(JSON.stringify({ message: "No payment code found, ignored." }), { status: 200, headers: corsHeaders });
        }

        const paymentCode = match[1].toUpperCase();

        // Tìm user theo payment code
        const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('id, balance')
            .eq('payment_code', paymentCode)
            .single();

        if (userError || !userProfile) {
            console.error("User not found for code:", paymentCode, userError);
            return new Response(JSON.stringify({ message: "User not found." }), { status: 200, headers: corsHeaders });
        }

        const amountVND = Number(transferAmount);
        const newBalance = Number(userProfile.balance || 0) + amountVND;

        // Cộng tiền vào balance
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', userProfile.id);

        if (updateError) {
            console.error("Failed to update balance:", updateError);
            return new Response(JSON.stringify({ error: "Database error updating balance." }), { status: 500, headers: corsHeaders });
        }

        // Kiểm tra xem giao dịch này đã pending chưa (chống lặp)
        const { data: pendingTx } = await supabase
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
            const { error } = await supabase
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
            const { error } = await supabase
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
        }

        return new Response(
            JSON.stringify({ success: true, message: `Added ${amountVND} VND.` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
        )
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
