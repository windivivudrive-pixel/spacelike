"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CustomerReport {
    id: string;
    customer_name: string;
    phone_number: string;
    order_code: string | null;
    conversation: any[];
    created_at: string;
}

export default function ChatReportsPage() {
    const [reports, setReports] = useState<CustomerReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const supabase = createClient();

    const checkAdmin = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setIsAdmin(false);
            return;
        }
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
        
        setIsAdmin(profile?.role === 'admin');
    }, [supabase]);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('customer_reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) {
            setReports(data);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    useEffect(() => {
        if (isAdmin) {
            fetchReports();
        }
    }, [isAdmin, fetchReports]);

    if (isAdmin === false) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <i className="fa-solid fa-lock text-5xl text-red-500 mb-4 opacity-50"></i>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Truy cập bị từ chối</h1>
                <p className="text-[var(--text-secondary)] mt-2">Bạn không có quyền xem trang này.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Báo Cáo Khách Hàng</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Quản lý thông tin khách hàng và lịch sử trò chuyện.</p>
                </div>
                <button 
                    onClick={fetchReports}
                    className="p-2 text-[var(--text-secondary)] hover:text-brand-accent transition-colors"
                    title="Làm mới"
                >
                    <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List of Reports */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: 'var(--bg-glass-card)' }}>
                        <div className="p-4 border-b border-[var(--border-color)] bg-black/20">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                                <i className="fa-solid fa-users text-brand-accent"></i>
                                Danh sách liên hệ
                            </h3>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {loading && reports.length === 0 ? (
                                <div className="p-10 text-center">
                                    <i className="fa-solid fa-circle-notch fa-spin text-brand-accent text-2xl"></i>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="p-10 text-center text-[var(--text-secondary)]">
                                    Chưa có báo cáo nào.
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <button
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className={`w-full text-left p-4 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--table-hover)] transition-colors group ${selectedReport?.id === report.id ? 'bg-brand-accent/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-[var(--text-primary)] group-hover:text-brand-accent transition-colors">
                                                {report.customer_name}
                                            </span>
                                            <span className="text-[10px] text-[var(--text-muted)]">
                                                {new Date(report.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-brand-accent font-medium">{report.phone_number}</span>
                                            {report.order_code && (
                                                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                                    <i className="fa-solid fa-hashtag text-[10px]"></i>
                                                    {report.order_code}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Details / Conversation */}
                <div className="lg:col-span-2">
                    {selectedReport ? (
                        <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden h-full flex flex-col" style={{ background: 'var(--bg-glass-card)' }}>
                            <div className="p-4 border-b border-[var(--border-color)] bg-black/20 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{selectedReport.customer_name}</h3>
                                    <p className="text-xs text-[var(--text-secondary)]">{selectedReport.phone_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[var(--text-muted)]">Thời gian tạo</p>
                                    <p className="text-xs text-[var(--text-primary)] font-medium">
                                        {new Date(selectedReport.created_at).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[600px] bg-black/10">
                                {selectedReport.conversation && selectedReport.conversation.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-brand-accent text-white rounded-tr-none shadow-lg' 
                                            : 'bg-[var(--bg-glass-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-none'
                                        }`}>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-[var(--border-color)] border-dashed h-full flex flex-col items-center justify-center p-20 text-center opacity-50" style={{ background: 'var(--bg-glass-card)' }}>
                            <i className="fa-solid fa-comment-dots text-5xl mb-4"></i>
                            <p className="text-[var(--text-secondary)]">Chọn một báo cáo từ danh sách để xem chi tiết cuộc hội thoại.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
