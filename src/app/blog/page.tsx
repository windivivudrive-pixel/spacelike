import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ParticlesBackground from '@/components/ParticlesBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog - Space Like',
    description: 'Tin tức, mẹo hay và cập nhật mới nhất về mạng xã hội. Khám phá các chiến lược tiếp thị mạng xã hội hiệu quả tại Space Like.',
    openGraph: {
        title: 'Blog - Space Like',
        description: 'Tin tức, mẹo hay và cập nhật mới nhất về mạng xã hội.',
        type: 'website',
        url: 'https://spacelike.vn/blog',
    }
};

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    author_name: string;
    author_avatar: string | null;
    category: string | null;
    is_featured: boolean;
    view_count: number;
    created_at: string;
}

export default async function BlogPage() {
    const supabase = await createClient();

    const { data: postsData, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, author_name, author_avatar, category, is_featured, view_count, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    const posts: BlogPost[] = postsData || [];

    const featured = posts.find((p) => p.is_featured) || posts[0];
    const secondary = posts.find((p) => p !== featured) || null;
    const sidebarPosts = posts.filter((p) => p !== featured && p !== secondary).slice(0, 7);
    const remainingPosts = posts.filter((p) => p !== featured && p !== secondary && !sidebarPosts.includes(p));

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return (
        <>
            <ParticlesBackground />
            <Header />
            <main className="pt-28 pb-16 min-h-screen relative z-10">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">

                    {/* Page Title */}
                    <div className="mb-10">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                            Blog <span className="text-brand-accent">Space Like</span>
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2 text-lg">Tin tức, mẹo hay và cập nhật mới nhất về mạng xã hội.</p>
                    </div>

                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <i className="fa-solid fa-newspaper text-5xl text-[var(--text-muted)] mb-4"></i>
                            <p className="text-[var(--text-secondary)] text-lg">Chưa có bài viết nào.</p>
                        </div>
                    ) : (
                        <>
                            {/* Hero Grid: Featured + Secondary + Sidebar */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">

                                {/* Featured Post - Large */}
                                {featured && (
                                    <Link href={`/blog/${featured.slug}`} className="lg:col-span-5 group">
                                        <div className="relative rounded-2xl overflow-hidden h-full min-h-[380px] border border-[var(--border-color)] hover:border-brand-accent/40 transition-all duration-300">
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: featured.cover_image ? `url(${featured.cover_image})` : 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                {featured.category && (
                                                    <span className="inline-block px-3 py-1 rounded-full bg-brand-accent text-white text-xs font-bold uppercase tracking-wider mb-3">
                                                        {featured.category}
                                                    </span>
                                                )}
                                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-2 group-hover:text-brand-accent transition-colors">
                                                    {featured.title}
                                                </h2>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <span>{featured.author_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Secondary Post - Medium with excerpt */}
                                {secondary && (
                                    <div className="lg:col-span-4 flex flex-col gap-5">
                                        <Link href={`/blog/${secondary.slug}`} className="group flex-1">
                                            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-brand-accent/40 transition-all duration-300 h-full flex flex-col" style={{ background: 'var(--bg-glass-card)' }}>
                                                {secondary.cover_image && (
                                                    <div className="h-48 overflow-hidden">
                                                        <img src={secondary.cover_image} alt={secondary.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                )}
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-brand-accent transition-colors leading-snug">
                                                        {secondary.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                                                        <span>{secondary.author_name}</span>
                                                    </div>
                                                    {secondary.excerpt && (
                                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-4 leading-relaxed flex-1">
                                                            {secondary.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* Sidebar - Quick View */}
                                {sidebarPosts.length > 0 && (
                                    <div className="lg:col-span-3">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display font-bold text-[var(--text-primary)] text-lg">Xem nhanh</h3>
                                            <span className="text-brand-accent text-sm font-medium cursor-pointer hover:underline">Xem tất cả</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {sidebarPosts.map(post => (
                                                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex items-start gap-3">
                                                    {post.cover_image && (
                                                        <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)]">
                                                            <img src={post.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                    )}
                                                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-brand-accent transition-colors leading-snug">
                                                        {post.title}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Remaining Posts - Horizontal Cards */}
                            {remainingPosts.length > 0 && (
                                <div className="border-t border-[var(--border-color)] pt-10">
                                    <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">Tất cả bài viết</h3>
                                    <div className="flex flex-col gap-5">
                                        {remainingPosts.map(post => (
                                            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                                <div className="flex gap-5 rounded-2xl border border-[var(--border-color)] hover:border-brand-accent/40 transition-all duration-300 overflow-hidden" style={{ background: 'var(--bg-glass-card)' }}>
                                                    {post.cover_image && (
                                                        <div className="w-48 md:w-64 shrink-0 overflow-hidden">
                                                            <img src={post.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        </div>
                                                    )}
                                                    <div className="py-5 pr-5 flex flex-col justify-center flex-1">
                                                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-brand-accent transition-colors leading-snug">
                                                            {post.title}
                                                        </h3>
                                                        {post.excerpt && (
                                                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                                                                {post.excerpt}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                                            {post.author_avatar ? (
                                                                <img src={post.author_avatar} alt="" className="w-6 h-6 rounded-full" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-[10px] font-bold">
                                                                    {post.author_name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <span className="font-medium">{post.author_name}</span>
                                                            <span>•</span>
                                                            <span>{formatDate(post.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
