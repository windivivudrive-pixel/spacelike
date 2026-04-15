"use client";

import { useMemo } from 'react';

interface SEOCheckerProps {
    title: string;
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    content: string; // HTML content
    slug: string;
}

interface SEOCheck {
    id: string;
    label: string;
    status: 'good' | 'warning' | 'error';
    message: string;
    score: number; // 0-100 weight for this check
}

function stripHtml(html: string): string {
    const tmp = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (tmp) {
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
}

function countOccurrences(text: string, keyword: string): number {
    if (!keyword) return 0;
    const regex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (text.match(regex) || []).length;
}

function analyzesSEO(props: SEOCheckerProps): SEOCheck[] {
    const { title, metaTitle, metaDescription, content } = props;
    const checks: SEOCheck[] = [];
    const plainText = stripHtml(content);
    const wordCount = countWords(plainText);
    const effectiveTitle = metaTitle || title;

    // 1. Độ dài Tiêu đề (40-60 ký tự)
    const titleLen = effectiveTitle.length;
    if (titleLen === 0) {
        checks.push({ id: 'title', label: 'Độ dài Tiêu đề (40-60 ký tự)', status: 'error', message: `(${titleLen} ký tự)`, score: 0 });
    } else if (titleLen < 40 || titleLen > 60) {
        checks.push({ id: 'title', label: 'Độ dài Tiêu đề (40-60 ký tự)', status: 'warning', message: `(${titleLen} ký tự)`, score: 50 });
    } else {
        checks.push({ id: 'title', label: 'Độ dài Tiêu đề (40-60 ký tự)', status: 'good', message: `(${titleLen} ký tự)`, score: 100 });
    }

    // 2. Mô tả ngắn (120-160 ký tự)
    const mdLen = metaDescription.length;
    if (mdLen === 0) {
        checks.push({ id: 'meta', label: 'Mô tả ngắn (120-160 ký tự)', status: 'error', message: `(${mdLen} ký tự)`, score: 0 });
    } else if (mdLen < 120 || mdLen > 160) {
        checks.push({ id: 'meta', label: 'Mô tả ngắn (120-160 ký tự)', status: 'warning', message: `(${mdLen} ký tự)`, score: 50 });
    } else {
        checks.push({ id: 'meta', label: 'Mô tả ngắn (120-160 ký tự)', status: 'good', message: `(${mdLen} ký tự)`, score: 100 });
    }

    // 3. Độ sâu nội dung (> 300 từ)
    if (wordCount < 100) {
        checks.push({ id: 'content', label: 'Độ sâu nội dung (> 300 từ)', status: 'error', message: `(${wordCount} từ)`, score: 0 });
    } else if (wordCount < 300) {
        checks.push({ id: 'content', label: 'Độ sâu nội dung (> 300 từ)', status: 'warning', message: `(${wordCount} từ)`, score: 50 });
    } else {
        checks.push({ id: 'content', label: 'Độ sâu nội dung (> 300 từ)', status: 'good', message: `(${wordCount} từ)`, score: 100 });
    }

    // 4. Sử dụng tiêu đề phân cấp (H2/H3)
    const headingMatch = content.match(/<h[2-4][^>]*>/gi);
    if (!headingMatch || headingMatch.length === 0) {
        checks.push({ id: 'headings', label: 'Sử dụng tiêu đề phân cấp (H2/H3)', status: 'warning', message: '', score: 0 });
    } else {
        checks.push({ id: 'headings', label: 'Sử dụng tiêu đề phân cấp (H2/H3)', status: 'good', message: '', score: 100 });
    }

    // 5. Chứa hình ảnh/đa phương tiện
    const imgMatch = content.match(/<img[^>]*>/gi);
    if (!imgMatch || imgMatch.length === 0) {
        checks.push({ id: 'images', label: 'Chứa hình ảnh/đa phương tiện', status: 'warning', message: '', score: 0 });
    } else {
        checks.push({ id: 'images', label: 'Chứa hình ảnh/đa phương tiện', status: 'good', message: '', score: 100 });
    }

    // 6. Chứa liên kết nội bộ/bên ngoài
    const linkMatch = content.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi);
    if (!linkMatch || linkMatch.length === 0) {
        checks.push({ id: 'links', label: 'Chứa liên kết nội bộ/bên ngoài', status: 'warning', message: '', score: 0 });
    } else {
        checks.push({ id: 'links', label: 'Chứa liên kết nội bộ/bên ngoài', status: 'good', message: '', score: 100 });
    }

    return checks;
}

const statusIcon: Record<string, string> = {
    good: 'fa-solid fa-circle-check text-emerald-500',
    warning: 'fa-solid fa-circle-exclamation text-amber-400',
    error: 'fa-solid fa-circle-xmark text-red-500',
};

export default function SEOChecker(props: SEOCheckerProps) {
    const checks = useMemo(() => analyzesSEO(props), [props]);

    const totalScore = useMemo(() => {
        if (checks.length === 0) return 0;
        const sum = checks.reduce((acc, c) => acc + c.score, 0);
        return Math.round(sum / checks.length);
    }, [checks]);

    const scoreColor = totalScore >= 80 ? 'text-emerald-500' : totalScore >= 50 ? 'text-amber-400' : 'text-red-500';

    return (
        <div className="bg-[#111111] rounded-2xl border border-white/5 p-6 w-full max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-medium text-lg">Trợ lý SEO</h3>
                <div className={`text-3xl font-bold ${scoreColor}`}>
                    {totalScore}<span className="text-sm font-normal text-white/50">/100</span>
                </div>
            </div>

            {/* Check List */}
            <div className="space-y-5 mb-8">
                {checks.map(check => (
                    <div key={check.id} className="flex gap-4">
                        <i className={`${statusIcon[check.status]} mt-1 text-base shrink-0 bg-black/50 rounded-full`}></i>
                        <div className="flex-1">
                            <p className="text-white/80 text-sm">{check.label}</p>
                            {check.message && (
                                <p className="text-white/40 text-sm mt-0.5">{check.message}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notice Box */}
            {totalScore < 80 && (
                <div className="bg-[#facc15]/10 border border-[#facc15]/20 rounded-xl p-4 flex gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0"></i>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Điểm SEO quá thấp. Bạn nên tối ưu thêm độ dài câu từ và hình ảnh trước khi xuất bản.
                    </p>
                </div>
            )}
        </div>
    );
}
