import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge'; // Use Edge for significantly faster cold boots and streaming

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
        }

        // Check if the latest user message contains a phone number
        const lastUserMsg = messages[messages.length - 1];
        const hasPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/.test(lastUserMsg.content);

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
5. Xử lý sự cố/Lỗi đơn/Không lên:
   - Nếu khách báo lỗi/không chạy: Kiểm tra xem khách đã cung cấp đủ [Mã đơn/Link], [SĐT], [Tên] chưa.
   - Nếu THIẾU: Xin những thông tin còn thiếu một cách lịch sự, ngắn gọn: "Dạ em xin lỗi về sự cố này. Anh/Chị cho em xin thêm [thông tin còn thiếu] để em báo kỹ thuật hỗ trợ ngay ạ."
   - Nếu ĐỦ: Xác nhận đã nhận thông tin và báo: "Dạ em đã nhận đủ thông tin của Anh/Chị. Em đã gửi kỹ thuật kiểm tra và nhân viên sẽ gọi phản hồi cho Anh/Chị sớm nhất nhé ạ."
6. Cảm xúc: Dùng thêm Emoji (🚀, ✨, 💬, ❤️) nhưng chỉ 1-2 cái mỗi tin nhắn.`
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

        // Use Google AI Studio API endpoint with streaming
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`;

        const response = await fetch(url, {
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

        // --- Background extraction process ---
        if (hasPhoneNumber) {
            // Run asynchronously without blocking the main stream response
            (async () => {
                try {
                    const extractPrompt = `Trích xuất thông tin khách hàng từ đoạn hội thoại sau. Trả về đúng định dạng JSON: {"customer_name": "...", "phone_number": "...", "order_code": "..."}. Nếu không có mã đơn hàng, để chuỗi rỗng "".\n\nĐoạn hội thoại:\n${JSON.stringify(messages)}`;
                    const extractUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
                    
                    const extractRes = await fetch(extractUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: extractPrompt }] }],
                            generationConfig: {
                                responseMimeType: "application/json",
                            }
                        })
                    });

                    if (extractRes.ok) {
                        const extractData = await extractRes.json();
                        const textData = extractData.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (textData) {
                            const parsed = JSON.parse(textData);
                            if (parsed.customer_name && parsed.phone_number) {
                                // Save to Supabase
                                const sb = await createClient();
                                await sb.from('customer_reports').insert({
                                    customer_name: parsed.customer_name,
                                    phone_number: parsed.phone_number,
                                    order_code: parsed.order_code || null,
                                    conversation: messages
                                });
                                console.log('Successfully saved customer report:', parsed);
                            }
                        }
                    }
                } catch (e) {
                    console.error("Background extraction failed:", e);
                }
            })();
        }
        // ------------------------------------

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);

            // Fallback to flash-lite-preview-09-2025 if needed, though gemini-2.5-flash-lite is preferred
            const liteUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
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
                console.error("Gemini API Fallback Error:", errLite);
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
