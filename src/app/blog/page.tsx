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
    
    // Logic chọn bài: Ưu tiên bài is_featured mới nhất làm bài chính đầu tiên
    const featuredIndex = posts.findIndex(p => p.is_featured);
    const featuredPost = featuredIndex !== -1 ? posts[featuredIndex] : null;
    
    // Tạo danh sách bài viết đã được sắp xếp với bài featured lên đầu (nếu có)
    const sortedPosts = featuredPost 
        ? [featuredPost, ...posts.filter(p => p.id !== featuredPost.id)]
        : posts;

    const heroMain = sortedPosts[0] || null;
    const heroSide = sortedPosts[1] || null;
    const heroGrid = sortedPosts.slice(2, 5);
    const sidebarPosts = sortedPosts.slice(5, 13);
    const remainingPosts = sortedPosts.slice(13);

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
                            {/* Hero + Sidebar Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
                                {/* Left Content: 5 Hero Posts (9/12) */}
                                <div className="lg:col-span-9 flex flex-col gap-12">
                                    {/* Row 1: 2 Posts (8:4) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {heroMain && (
                                            <div className="lg:col-span-8">
                                                <Link href={`/blog/${heroMain.slug}`} className="group block">
                                                    <div className="rounded-2xl overflow-hidden aspect-[3/2] w-full mb-5 border border-[var(--border-color)]">
                                                        <img src={heroMain.cover_image || ''} alt={heroMain.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)] leading-tight mb-3 group-hover:text-brand-accent transition-colors">
                                                        {heroMain.title}
                                                    </h2>
                                                    <p className="text-sm text-[var(--text-muted)] font-medium">
                                                        {heroMain.author_name}
                                                    </p>
                                                </Link>
                                            </div>
                                        )}

                                        {heroSide && (
                                            <div className="lg:col-span-4">
                                                <Link href={`/blog/${heroSide.slug}`} className="group block">
                                                    <div className="rounded-2xl overflow-hidden aspect-[3/2] w-full mb-5 border border-[var(--border-color)]">
                                                        <img src={heroSide.cover_image || ''} alt={heroSide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug mb-3 group-hover:text-brand-accent transition-colors">
                                                        {heroSide.title}
                                                    </h3>
                                                    <p className="text-sm text-[var(--text-muted)] font-medium mb-3">
                                                        {heroSide.author_name}
                                                    </p>
                                                    {heroSide.excerpt && (
                                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-5 leading-relaxed">
                                                            {heroSide.excerpt}
                                                        </p>
                                                    )}
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Row 2: 3 Posts (Equal) */}
                                    {heroGrid.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {heroGrid.map(post => (
                                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                                    <div className="rounded-xl overflow-hidden aspect-[3/2] w-full mb-4 border border-[var(--border-color)]">
                                                        <img src={post.cover_image || ''} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-[var(--text-primary)] leading-snug mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-xs text-[var(--text-muted)] font-medium">
                                                        {post.author_name}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right Content: Timeline Sidebar (3/12) */}
                                {sidebarPosts.length > 0 && (
                                    <div className="lg:col-span-3">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="font-display font-bold text-[var(--text-primary)] text-xl">Xem nhanh</h3>
                                            <Link href="/blog" className="text-brand-accent text-sm font-bold hover:underline">Xem tất cả</Link>
                                        </div>
                                        
                                        <div className="flex flex-col gap-8 relative pl-6">
                                            {/* Vertical line with dots */}
                                            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] border-l border-dashed border-brand-accent/40"></div>
                                            
                                            {sidebarPosts.map(post => (
                                                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex items-start gap-4 relative">
                                                    {/* Blue Dot */}
                                                    <div className="absolute -left-[23px] top-[10px] w-2.5 h-2.5 rounded-full bg-brand-accent border-2 border-[var(--bg-card)] group-hover:scale-125 transition-transform"></div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-3 group-hover:text-brand-accent transition-colors leading-snug mb-1">
                                                            {post.title}
                                                        </p>
                                                    </div>
                                                    
                                                    {post.cover_image && (
                                                        <div className="w-24 aspect-[3/2] rounded-lg overflow-hidden border border-[var(--border-color)] shrink-0">
                                                            <img src={post.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                    )}
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
                                                        <div className="w-48 md:w-64 aspect-[3/2] shrink-0 overflow-hidden">
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
