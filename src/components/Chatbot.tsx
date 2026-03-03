"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Dạ xin chào! Mình là trợ lý ảo của SpaceLike 🚀. Chào mừng bạn đến với hệ thống SMM Panel xịn xò nhất vũ trụ. Bạn có cần mình hỗ trợ tìm dịch vụ nào không ạ?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }]
                })
            });

            if (!resp.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi bạn, đường truyền trạm vũ trụ bị nhiễu. Bạn thử nhắn lại xíu nha 😢' }]);
                return;
            }

            const reader = resp.body?.getReader();
            if (!reader) throw new Error("No stream");

            const decoder = new TextDecoder();
            let buffer = '';

            setIsLoading(false); // Stop loading animation since we are receiving words
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Keep the last incomplete line in buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (textChunk) {
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    const lastMsg = newMsgs[newMsgs.length - 1];
                                    if (lastMsg.role === 'assistant') {
                                        lastMsg.content += textChunk;
                                    }
                                    return newMsgs;
                                });
                            }
                        } catch (e) {
                            // ignore incomplete chunks or parse errors
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lỗi hệ thống mất rồi, vui lòng thử lại sau bạn nhé.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">

            {/* Chat Box */}
            <div className={`transition-all duration-300 transform origin-bottom-right mb-4 pointer-events-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}>
                <div className="w-[350px] sm:w-[400px] h-[500px] max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(236,57,44,0.2)] border border-brand-accent/30 bg-[var(--bg-glass-card)] backdrop-blur-xl">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-accent to-orange-500 p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center overflow-hidden border border-white/50">
                                <img src="/mascot-chatbot.png" alt="Mascot" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-brand-dark font-bold font-display tracking-wide">Space Bot 🚀</h3>
                                <p className="text-brand-dark/80 text-xs font-semibold">Tư vấn viên AI vũ trụ</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-tr-sm' : 'bg-white/10 text-[var(--text-primary)] border border-white/5 rounded-tl-sm'}`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-a:text-brand-accent hover:prose-a:text-brand-accentHover">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div>{msg.content}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-2 items-center">
                                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-black/60 border-t border-white/10">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Hỏi dịch vụ..."
                                className="w-full bg-[#1e1e1e] border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-accentHover transition-colors"
                            >
                                <i className="fa-solid fa-paper-plane mr-0.5 mt-0.5"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mascot Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group pointer-events-auto p-4"
            >
                {/* Glow behind */}
                <div className="absolute inset-0 bg-brand-accent rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>

                {/* Mascot image standard size */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center z-10 animate-[float_3s_ease-in-out_infinite] transform transition-all duration-300 group-hover:scale-110">
                    <img
                        src="/mascot-chatbot.png"
                        alt="Chat Mascot"
                        className="w-[140%] h-[140%] object-contain object-center drop-shadow-[0_0_20px_rgba(236,57,44,0.6)]"
                    />
                </div>

                {/* Notification dot */}
                {!isOpen && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full z-20 animate-bounce flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">1</span>
                    </div>
                )}
            </button>

        </div>
    );
}
