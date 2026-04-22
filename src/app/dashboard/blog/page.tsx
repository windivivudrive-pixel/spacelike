"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import RichTextEditor from '@/components/blog/RichTextEditor';
import SEOChecker from '@/components/blog/SEOChecker';
import { compressImage } from '@/lib/utils/imageCompression';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    author_name: string;
    author_avatar: string | null;
    category: string | null;
    is_published: boolean;
    is_featured: boolean;
    view_count: number;
    meta_title: string | null;
    meta_description: string | null;
    focus_keyword: string | null;
    created_at: string;
    updated_at: string;
}

const CATEGORIES = ['Tin tức', 'Mẹo hay', 'Hướng dẫn', 'Cập nhật', 'Marketing'];

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [showSEO, setShowSEO] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [authorName, setAuthorName] = useState('Admin');
    const [category, setCategory] = useState('Tin tức');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [focusKeyword, setFocusKeyword] = useState('');

    const supabase = createClient();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setPosts(data);
        setLoading(false);
    }, [supabase]);

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

        setIsAdmin(profile?.role === 'admin' || profile?.role === 'mod');
    }, [supabase]);

    useEffect(() => {
        checkAdmin();
        fetchPosts();
    }, [checkAdmin, fetchPosts]);

    function resetForm() {
        setTitle(''); setExcerpt(''); setContent(''); setCoverImage('');
        setAuthorName('Admin'); setCategory('Tin tức'); setIsFeatured(false); setIsPublished(false);
        setMetaTitle(''); setMetaDescription(''); setFocusKeyword('');
        setEditingPost(null); setShowSEO(false);
    }

    function openCreate() {
        resetForm();
        setShowEditor(true);
    }

    function openEdit(post: BlogPost) {
        setEditingPost(post);
        setTitle(post.title);
        setExcerpt(post.excerpt || '');
        setContent(post.content || '');
        setCoverImage(post.cover_image || '');
        setAuthorName(post.author_name);
        setCategory(post.category || 'Tin tức');
        setIsFeatured(post.is_featured);
        setIsPublished(post.is_published);
        setMetaTitle(post.meta_title || '');
        setMetaDescription(post.meta_description || '');
        setFocusKeyword(post.focus_keyword || '');
        setShowEditor(true);
    }

    const currentSlug = editingPost?.slug || slugify(title) + '-' + Date.now().toString(36);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if file is image
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn tệp hình ảnh.');
            return;
        }

        // Limit size to 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh tối đa là 5MB.');
            return;
        }

        try {
            setUploading(true);
            const compressedFile = await compressImage(file, 2);

            const fileExt = compressedFile.name.split('.').pop() || 'jpg';
            const fileName = `thumbnail-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `blog/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('spacelike-bucket')
                .upload(filePath, compressedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('spacelike-bucket')
                .getPublicUrl(filePath);

            setCoverImage(publicUrl);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Lỗi upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const uploadImageForEditor = async (file: File) => {
        const compressedFile = await compressImage(file, 2);
        const fileExt = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `editor-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('spacelike-bucket')
            .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('spacelike-bucket')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    async function handleSave() {
        if (!title.trim()) return;
        setSaving(true);

        const slug = editingPost?.slug || slugify(title) + '-' + Date.now().toString(36);
        const payload = {
            title, slug, excerpt: excerpt || null, content: content || null,
            cover_image: coverImage || null, author_name: authorName,
            category, is_featured: isFeatured, is_published: isPublished,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
            focus_keyword: focusKeyword || null,
            updated_at: new Date().toISOString()
        };

        if (editingPost) {
            await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
        } else {
            await supabase.from('blog_posts').insert([payload]);
        }

        setSaving(false);
        setShowEditor(false);
        resetForm();
        fetchPosts();
    }

    async function handleDelete(id: string) {
        if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
        await supabase.from('blog_posts').delete().eq('id', id);
        fetchPosts();
    }

    async function togglePublish(post: BlogPost) {
        await supabase.from('blog_posts').update({ is_published: !post.is_published, updated_at: new Date().toISOString() }).eq('id', post.id);
        fetchPosts();
    }

    if (isAdmin === false) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <i className="fa-solid fa-lock text-5xl text-red-500 mb-4 opacity-50"></i>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Truy cập bị từ chối</h1>
                <p className="text-[var(--text-secondary)] mt-2">Bạn không có quyền quản lý bài viết.</p>
            </div>
        );
    }

    const inputClass = "w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--input-text)] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-[var(--input-placeholder)]";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Quản Lý Blog</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Tạo và quản lý các bài viết blog.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-brand-accent text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(236,57,44,0.3)]"
                >
                    <i className="fa-solid fa-plus"></i> Viết bài mới
                </button>
            </div>

            {/* Editor Modal — Full Screen */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8" style={{ background: 'var(--bg-secondary, #0a0a0f)' }}>
                            <div className="max-w-4xl mx-auto">
                                {/* Top Bar */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
                                        {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setShowEditor(false); resetForm(); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2">
                                            <i className="fa-solid fa-xmark text-xl"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">Tiêu đề *</label>
                                        <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass + ' text-lg font-semibold'} placeholder="Nhập tiêu đề bài viết..." />
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">Mô tả ngắn</label>
                                        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} className={inputClass + ' resize-none'} rows={2} placeholder="Tóm tắt nội dung..." />
                                    </div>

                                    {/* Cover Image */}
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">Ảnh bìa (Tỉ lệ 3:2)</label>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-2">
                                                <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputClass} placeholder="https://example.com/image.jpg" />
                                                <label className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-brand-accent hover:border-brand-accent transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    {uploading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                                                </label>
                                            </div>

                                            {coverImage && (
                                                <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] aspect-[3/2] w-full bg-black/20 group">
                                                    <img src={coverImage} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                                                    <button
                                                        onClick={() => setCoverImage('')}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            )}

                                            {!coverImage && !uploading && (
                                                <div
                                                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                                    className="rounded-xl border-2 border-dashed border-[var(--border-color)] p-8 flex flex-col items-center justify-center gap-2 hover:border-brand-accent hover:bg-white/5 transition-all cursor-pointer group"
                                                >
                                                    <input type="file" id="thumbnail-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-brand-accent transition-colors">
                                                        <i className="fa-solid fa-image text-xl"></i>
                                                    </div>
                                                    <p className="text-sm font-medium text-[var(--text-secondary)]">Nhấp để tải lên hoặc kéo thả ảnh</p>
                                                    <p className="text-xs text-[var(--text-muted)]">Hỗ trợ PNG, JPG, WebP tối đa 5MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category & Author */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">Danh mục</label>
                                            <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">Tác giả</label>
                                            <input value={authorName} onChange={e => setAuthorName(e.target.value)} className={inputClass} />
                                        </div>
                                    </div>

                                    {/* Rich Text Editor */}
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
                                            Nội dung
                                        </label>
                                        <RichTextEditor
                                            content={content}
                                            onChange={setContent}
                                            placeholder="Bắt đầu viết bài viết..."
                                            onImageUpload={uploadImageForEditor}
                                        />
                                    </div>

                                    {/* SEO Fields */}
                                    <div className="rounded-xl border border-[var(--border-color)] p-5 space-y-4" style={{ background: 'var(--bg-glass-card)' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <i className="fa-solid fa-magnifying-glass text-brand-accent text-sm"></i>
                                            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">SEO Settings</h3>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
                                                Focus Keyword
                                            </label>
                                            <input
                                                value={focusKeyword}
                                                onChange={e => setFocusKeyword(e.target.value)}
                                                className={inputClass}
                                                placeholder="Từ khóa chính, vd: mua like facebook"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
                                                Meta Title
                                                <span className="font-normal text-[var(--text-muted)] ml-2">
                                                    {metaTitle.length}/60
                                                </span>
                                            </label>
                                            <input
                                                value={metaTitle}
                                                onChange={e => setMetaTitle(e.target.value)}
                                                className={inputClass}
                                                placeholder="Tiêu đề SEO (để trống sẽ dùng tiêu đề bài viết)"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
                                                Meta Description
                                                <span className="font-normal text-[var(--text-muted)] ml-2">
                                                    {metaDescription.length}/160
                                                </span>
                                            </label>
                                            <textarea
                                                value={metaDescription}
                                                onChange={e => setMetaDescription(e.target.value)}
                                                className={inputClass + ' resize-none'}
                                                rows={3}
                                                placeholder="Mô tả SEO hiển thị trên Google..."
                                            />
                                        </div>

                                        {/* Google Preview */}
                                        <div className="rounded-lg bg-white/5 border border-[var(--border-color)] p-4">
                                            <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider font-medium">Xem trước Google</p>
                                            <div className="space-y-1">
                                                <p className="text-[#8ab4f8] text-base leading-snug truncate">
                                                    {metaTitle || title || 'Tiêu đề bài viết'}
                                                </p>
                                                <p className="text-[#bdc1c6] text-xs truncate">
                                                    spacelike.vn/blog/{editingPost?.slug || slugify(title || 'url-bai-viet')}
                                                </p>
                                                <p className="text-[#9aa0a6] text-sm leading-relaxed line-clamp-2">
                                                    {metaDescription || excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex items-center gap-6 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="accent-brand-accent w-4 h-4" />
                                            <span className="text-sm font-medium text-[var(--text-primary)]">Xuất bản</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-brand-accent w-4 h-4" />
                                            <span className="text-sm font-medium text-[var(--text-primary)]">Nổi bật</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[var(--border-color)]">
                                    <button onClick={() => { setShowEditor(false); resetForm(); }} className="px-5 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !title.trim()}
                                        className="flex items-center gap-2 bg-brand-accent text-white px-6 py-2.5 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...</> : <><i className="fa-solid fa-check"></i> {editingPost ? 'Cập nhật' : 'Tạo bài viết'}</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Checker Side Panel (Always visible on right) */}
                    <div
                        className="w-full max-w-sm border-l border-[var(--border-color)] overflow-y-auto p-5 hidden lg:block"
                        style={{ background: 'var(--bg-secondary, #0a0a0f)' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <i className="fa-solid fa-magnifying-glass-chart text-brand-accent"></i>
                                Phân tích SEO
                            </h3>
                        </div>
                        <SEOChecker
                            title={title}
                            metaTitle={metaTitle}
                            metaDescription={metaDescription}
                            focusKeyword={focusKeyword}
                            content={content}
                            slug={currentSlug}
                        />
                    </div>
                </div>
            )}

            {/* Posts Table */}
            <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: 'var(--bg-glass-card)' }}>
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-accent"></i>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <i className="fa-solid fa-pen-nib text-4xl text-[var(--text-muted)] mb-4"></i>
                        <p className="text-[var(--text-secondary)]">Chưa có bài viết nào. Bấm "Viết bài mới" để bắt đầu!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="text-left text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Bài viết</th>
                                    <th className="text-left text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                                    <th className="text-center text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Trạng thái</th>
                                    <th className="text-center text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider hidden md:table-cell">Lượt xem</th>
                                    <th className="text-right text-[var(--text-muted)] font-medium px-5 py-3.5 text-xs uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-hover)] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {post.cover_image && (
                                                    <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)]">
                                                        <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-[var(--text-primary)] line-clamp-1">{post.title}</p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{new Date(post.created_at).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="px-2.5 py-1 rounded-full bg-[var(--service-item-bg)] text-[var(--text-secondary)] text-xs font-medium">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button onClick={() => togglePublish(post)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${post.is_published
                                                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20'
                                                : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20'
                                                }`}>
                                                <i className={`fa-solid ${post.is_published ? 'fa-eye' : 'fa-eye-slash'} text-[10px]`}></i>
                                                {post.is_published ? 'Công khai' : 'Nháp'}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-center hidden md:table-cell">
                                            <span className="text-[var(--text-secondary)] text-sm">{post.view_count}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {post.is_featured && (
                                                    <span className="text-amber-400 text-xs" title="Nổi bật"><i className="fa-solid fa-star"></i></span>
                                                )}
                                                <button onClick={() => openEdit(post)} className="text-[var(--text-secondary)] hover:text-brand-accent transition-colors p-1.5" title="Chỉnh sửa">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button onClick={() => handleDelete(post.id)} className="text-[var(--text-secondary)] hover:text-red-400 transition-colors p-1.5" title="Xóa">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
