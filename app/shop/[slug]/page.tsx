import { notFound } from "next/navigation";
import NextLink from "next/link";
import { ChevronLeft, Star, ShoppingCart, Check, Leaf, FlaskConical } from "lucide-react";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { Reveal } from "@/components/reveal";
import { useCart } from "@/context/cart-context";

// Generate static params for all products
export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(params.slug, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-[#533a00] transition-colors">Shop</a>
            <span>/</span>
            <span className="text-[#533a00] font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── Product Detail ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: Image */}
          <Reveal direction="right">
            <div className="aspect-square overflow-hidden bg-[#f5f0eb] relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-semibold">
                  {product.badge}
                </span>
              )}
            </div>
          </Reveal>

          {/* Right: Details */}
          <div className="flex flex-col">
            <Reveal direction="left">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-header text-[#1a120b] leading-tight">
                  {product.name}
                </h1>
                <p className="text-[#6a5a4a] font-body mt-3 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c4a35a] text-[#c4a35a]" />
                  ))}
                  <span className="text-xs text-[#8a7a6a] font-body ml-2">(128 reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-6 pb-6 border-b border-[#e8dfd3]">
                  <span className="text-3xl font-header font-bold text-[#533a00]">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-[#8a7a6a] font-body ml-2">{product.size}</span>
                </div>

                {/* Key Benefits */}
                <div className="mt-6 space-y-3">
                  {product.keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#533a00] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#3a2a1a] font-body">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Quantity + Add to Cart */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center border border-[#e8dfd3]">
                    <button className="px-4 py-3 text-[#6a5a4a] hover:text-[#1a120b] transition-colors font-body">-</button>
                    <span className="px-4 py-3 text-sm font-body text-[#1a120b] border-x border-[#e8dfd3]">1</span>
                    <button className="px-4 py-3 text-[#6a5a4a] hover:text-[#1a120b] transition-colors font-body">+</button>
                  </div>
                  <button className="flex-1 px-6 py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Hair Type Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.hairType.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-body font-semibold bg-[#faf7f2] text-[#533a00] border border-[#e8dfd3]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Tabs: Description / Ingredients / How To Use */}
            <div className="mt-10 border-t border-[#e8dfd3] pt-8 space-y-8">
              <Reveal direction="up" delay={0.1}>
                <div>
                  <h3 className="font-header font-bold text-[#1a120b] text-lg mb-3 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#533a00]" />
                    Description
                  </h3>
                  <p className="text-[#3a2a1a] font-body leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <div>
                  <h3 className="font-header font-bold text-[#1a120b] text-lg mb-3 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#533a00]" />
                    Ingredients
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.ingredients.map((ing) => (
                      <li key={ing} className="text-sm text-[#3a2a1a] font-body flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c4a35a] mt-1.5 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.3}>
                <div>
                  <h3 className="font-header font-bold text-[#1a120b] text-lg mb-3">How to Use</h3>
                  <ol className="space-y-3">
                    {product.howToUse.map((step, i) => (
                      <li key={step} className="flex items-start gap-4">
                        <span className="w-6 h-6 rounded-full bg-[#533a00] text-white text-xs flex items-center justify-center font-semibold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[#3a2a1a] font-body leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#faf7f2] border-t border-[#e8dfd3]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
            <Reveal direction="up">
              <h2 className="font-header font-bold text-[#1a120b] text-2xl mb-10 text-center">
                You May Also Like
              </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((related) => (
                <Reveal key={related.slug} direction="up">
                  <a href={`/shop/${related.slug}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-[#f5f0eb] mb-4 relative">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {related.badge && (
                        <span className="absolute top-3 left-3 bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold">
                          {related.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-header font-bold text-[#1a120b] text-sm md:text-base group-hover:text-[#533a00] transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-[#6a5a4a] text-xs md:text-sm font-body mt-1">{related.tagline}</p>
                    <p className="text-[#533a00] font-semibold mt-2 text-sm md:text-base">${related.price.toFixed(2)}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}