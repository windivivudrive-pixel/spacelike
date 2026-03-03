import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge'; // Use Edge for significantly faster cold boots and streaming

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
        }

        // Fetch services context from DB
        const supabase = await createClient();
        const { data: services } = await supabase.from('services').select('*').eq('is_active', true);

        let servicesContext = 'Hiện tại hệ thống không có dịch vụ nào.';
        if (services && services.length > 0) {
            servicesContext = services.map(s => `- Tên: ${s.name}\n  Nền tảng: ${s.category}\n  Giá tiền: ${s.rate} VNĐ / 1000 lượt (Lưu ý khách mua 1k thì tính đúng ${s.rate} VND)\n  Chất lượng: ${s.type || 'Chất lượng cao'}\n  Min/Max: ${s.min_quantity} - ${s.max_quantity}`).join('\n\n');
        }

        const systemInstruction = {
            parts: [{
                text: `Bạn là trợ lý ảo AI siêu thông minh và dễ thương, đóng vai trò nhân viên tư vấn bán hàng số một cho hệ thống kích cầu và seeding mạng xã hội tên là SpaceLike. 
Dưới đây là BẢNG BÁO GIÁ ĐỘC QUYỀN HIỆN TẠI (Dành riêng cho bạn tư vấn):
<services>
${servicesContext}
</services>

Quy tắc giao tiếp và trả lời:
1. Xưng hô: Xưng mình/em và gọi khách hàng là bạn/anh/chị một cách thân thiện, lễ phép (Có dùng các cụm từ đệm như dạ, vâng, ạ).
2. Tư vấn giá chuẩn xác: Dựa VÀO CHÍNH XÁC bảng giá trên để lấy giá, KHÔNG BAO GIỜ tự bịa ra dịch vụ hay giá cả không tồn tại. Giá trên định mức là VND cho mỗi 1000 lượt thao tác. Nếu khách hỏi "Bao nhiêu 1 nghìn like?", hãy báo giá chính xác của dịch vụ Like.
3. Nếu khách hỏi những dịch vụ nằm ngoài bảng giá: Hãy nói rõ ràng nhưng khéo léo "Dạ hiện tại bên em chưa triển khai gói này, nhưng SpaceLike có các dịch vụ cực hấp dẫn khác về Facebook, TikTok... anh chị có thể tham khảo ạ".
4. Khuyến khích: Hướng dẫn họ Đăng ký/Đăng nhập (góc phải trên cùng website) rồi Nạp tiền vào tài khoản để tạo đơn hàng.
5. Ngắn gọn, có cảm xúc: Dùng thêm các Emoji vui vẻ (🚀, ✨, 💬, ❤️) nhưng không lạm dụng. Giữ câu trả lời súc tích, tránh dài dòng máy móc.`
            }]
        };

        const geminiHistory = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing");
            return NextResponse.json({ error: 'System not configured properly' }, { status: 500 });
        }

        // Use Vertex AI Express API endpoint with streaming SSE
        const url = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: geminiHistory,
                generationConfig: {
                    temperature: 0.5, // keep responses quite focused
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Vertex API Error:", errorText);

            // Fallback to flash-lite streaming
            const liteUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`;
            const liteResponse = await fetch(liteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: systemInstruction,
                    contents: geminiHistory,
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 800
                    }
                })
            });

            if (!liteResponse.ok) {
                const errLite = await liteResponse.text();
                console.error("Vertex API Lite Error:", errLite);
                return NextResponse.json({ error: 'System API failed' }, { status: 500 });
            }

            return new Response(liteResponse.body, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                }
            });
        }

        // Return the stream directly to the client
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });
    } catch (error: any) {
        console.error('Chatbot API Exception:', error);
        return NextResponse.json({ error: 'Đã xảy ra lỗi khi kết nối với AI.' }, { status: 500 });
    }
}
