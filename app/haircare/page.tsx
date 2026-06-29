import { blogPosts } from "@/lib/blog-data";
import NextLink from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function HairCarePage() {
  const categories = Array.from(new Set(blogPosts.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#533a00] font-semibold">Hair Care</span>
          </nav>
        </div>
      </div>

      {/* ─── Page Header ─── */}
      <div className="bg-[#faf7f2] border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-3">The Journal</p>
          <h1 className="text-3xl md:text-5xl font-header text-[#1a120b]">Hair Care</h1>
          <p className="text-[#6a5a4a] font-body mt-4 max-w-xl leading-relaxed">
            Science-backed tips, ingredient deep dives, and routines crafted by our team of trichologists. Your journey to healthier hair starts here.
          </p>
        </div>
      </div>

      {/* ─── Category Pills ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 text-xs font-body font-semibold uppercase tracking-wider bg-[#faf7f2] text-[#533a00] border border-[#e8dfd3] whitespace-nowrap"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Blog Grid ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">

          {/* Featured: first post spans full width */}
          {blogPosts.slice(0, 1).map((post) => (
            <div key={post.slug} className="md:col-span-2">
              <NextLink href={`/haircare/${post.slug}`} className="group block md:grid md:grid-cols-2 md:gap-10">
                <div className="aspect-[16/9] md:aspect-[4/3] overflow-hidden bg-[#f5f0eb]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 md:mt-0 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold">
                    {post.category}
                  </span>
                  <h2 className="font-header font-bold text-[#1a120b] text-2xl md:text-3xl mt-2 group-hover:text-[#533a00] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#6a5a4a] font-body mt-3 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-[#8a7a6a] font-body">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 mt-4 text-xs font-body font-semibold text-[#533a00] uppercase tracking-wider group-hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </NextLink>
            </div>
          ))}

          {/* Remaining posts */}
          {blogPosts.slice(1).map((post) => (
            <div key={post.slug}>
              <NextLink href={`/haircare/${post.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden bg-[#f5f0eb]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold">
                    {post.category}
                  </span>
                  <h2 className="font-header font-bold text-[#1a120b] text-xl mt-2 group-hover:text-[#533a00] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#6a5a4a] font-body mt-2 leading-relaxed text-sm">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#8a7a6a] font-body">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </NextLink>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}