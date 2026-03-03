import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ParticlesBackground from '@/components/ParticlesBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ViewCounter from '@/components/blog/ViewCounter';

type Props = {
    params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (!post) {
        return {
            title: 'Bài viết không tồn tại - Space Like',
            description: 'Đã có lỗi xảy ra hoặc bài viết không tồn tại.',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const siteName = 'Space Like Blog';

    return {
        title: `${post.title} - ${siteName}`,
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            url: `https://spacelike.vn/blog/${post.slug}`,
            siteName: siteName,
            images: post.cover_image ? [post.cover_image, ...previousImages] : previousImages,
            type: 'article',
            publishedTime: post.created_at,
            authors: [post.author_name],
        },
    };
}

export default async function BlogDetailPage(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch related posts
    const { data: relatedPosts } = await supabase
        .from('blog_posts')
        .select('id, title, slug, cover_image, author_name, created_at')
        .eq('is_published', true)
        .neq('id', post.id)
        .order('created_at', { ascending: false })
        .limit(3);

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return (
        <>
            <ViewCounter postId={post.id} initialCount={post.view_count || 0} />
            <ParticlesBackground />
            <Header />
            <main className="pt-28 pb-16 min-h-screen relative z-10">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    {/* Back link */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-brand-accent transition-colors mb-6">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại Blog
                    </Link>

                    {/* Category */}
                    {post.category && (
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-wider mb-4 border border-brand-accent/20">
                            {post.category}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--text-primary)] leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--border-color)]">
                        {post.author_avatar ? (
                            <img src={post.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-orange-500 flex items-center justify-center text-white font-bold">
                                {post.author_name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-[var(--text-primary)]">{post.author_name}</p>
                            <p className="text-sm text-[var(--text-muted)]">
                                {formatDate(post.created_at)} · {post.view_count || 0} lượt xem
                            </p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="rounded-2xl overflow-hidden mb-8 border border-[var(--border-color)]">
                            <img src={post.cover_image} alt={post.title} className="w-full h-auto" />
                        </div>
                    )}

                    {/* Content */}
                    <article className="prose prose-lg max-w-none text-[var(--text-primary)]
                        prose-headings:text-[var(--text-primary)] prose-headings:font-display
                        prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
                        prose-a:text-brand-accent prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[var(--text-primary)]
                        prose-blockquote:border-brand-accent prose-blockquote:text-[var(--text-secondary)]
                        prose-code:text-brand-accent prose-code:bg-[var(--input-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-img:rounded-xl prose-img:border prose-img:border-[var(--border-color)]
                        mb-12"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />

                    {/* Related Posts */}
                    {relatedPosts && relatedPosts.length > 0 && (
                        <div className="border-t border-[var(--border-color)] pt-10">
                            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">Bài viết liên quan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedPosts.map(rp => (
                                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                                        <div className="rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-brand-accent/40 transition-all h-full flex flex-col" style={{ background: 'var(--bg-glass-card)' }}>
                                            {rp.cover_image && (
                                                <div className="h-36 overflow-hidden">
                                                    <img src={rp.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            )}
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-brand-accent transition-colors mb-2">
                                                    {rp.title}
                                                </h4>
                                                <p className="text-xs text-[var(--text-muted)]">{rp.author_name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
