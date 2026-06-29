import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { BlogContent } from "@/components/blog-content";
import { getBlogPostBySlug, getRelatedPosts, blogPosts } from "@/lib/blog-data";

// Generate static params for all blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <NextLink href="/haircare" className="hover:text-[#533a00] transition-colors">Hair Care</NextLink>
            <span>/</span>
            <span className="text-[#533a00] font-semibold truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <div className="relative w-full h-[40dvh] md:h-[55dvh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#c4a35a] font-body font-semibold mb-3 bg-black/30 px-3 py-1">
            {post.category}
          </span>
          <h1 className="text-white font-header font-bold text-2xl md:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-white/70 text-xs md:text-sm font-body">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span>By {post.author}</span>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] uppercase tracking-wider font-body font-semibold bg-[#faf7f2] text-[#533a00] border border-[#e8dfd3]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Blog body */}
        <article className="prose-custom">
          <BlogContent content={post.content} />
        </article>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-[#e8dfd3]">
          <NextLink
            href="/haircare"
            className="inline-flex items-center gap-2 text-sm font-body font-semibold text-[#533a00] hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hair Care
          </NextLink>
        </div>
      </div>

      {/* ─── Related Posts ─── */}
      {relatedPosts.length > 0 && (
        <div className="bg-[#faf7f2] border-t border-[#e8dfd3]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
            <h2 className="font-header font-bold text-[#1a120b] text-2xl mb-10 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((related) => (
                <NextLink
                  key={related.slug}
                  href={`/haircare/${related.slug}`}
                  className="group flex gap-5 bg-white p-4 border border-[#e8dfd3] hover:shadow-sm transition-shadow"
                >
                  <div className="w-28 h-28 shrink-0 overflow-hidden bg-[#f5f0eb]">
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold">
                      {related.category}
                    </span>
                    <h3 className="font-header font-bold text-[#1a120b] text-sm mt-1 group-hover:text-[#533a00] transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-[#8a7a6a] text-xs font-body mt-1.5">
                      {related.readTime}
                    </span>
                  </div>
                </NextLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}