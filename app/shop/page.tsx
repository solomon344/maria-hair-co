"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";

interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  badge: string | null;
  stockQty: number;
  ingredients: string[];
  howToUse: string[];
  keyBenefits: string[];
  size: string;
  hairType: string[];
}

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Selling"];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("Newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/admin/categories"),
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setAllProducts(data.products || []);
        }

        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories?.map((c: any) => ({ name: c.name, slug: c.slug })) || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync category from URL on mount
  useEffect(() => {
    if (categoryParam && categories.some((c) => c.name === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, categories]);

  const filtered = allProducts
    .filter((p) => selectedCategory === "All" || p.category?.name === selectedCategory)
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Best Selling") return a.badge === "Bestseller" ? -1 : 1;
      return 0;
    });

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-[#8a7a6a]">
            <a href="/" className="hover:text-[#533a00] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#533a00] font-semibold">Shop All</span>
          </nav>
        </div>
      </div>

      {/* ─── Page Header ─── */}
      <div className="bg-[#faf7f2] border-b border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-2">The Collection</p>
          <h1 className="text-3xl md:text-4xl font-header text-[#1a120b]">Shop All Products</h1>
          <p className="text-[#6a5a4a] font-body mt-2">{loading ? "Loading..." : `${filtered.length} products`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Sidebar Filters (Desktop) ─── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-sm uppercase tracking-wider mb-4">Category</h3>
                <ul className="space-y-2">
                  {categoryNames.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left font-body text-sm py-1.5 transition-colors ${
                          selectedCategory === cat
                            ? "text-[#533a00] font-semibold border-l-2 border-[#533a00] pl-3"
                            : "text-[#6a5a4a] hover:text-[#533a00] pl-4"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-sm uppercase tracking-wider mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[#533a00]"
                  />
                  <div className="flex items-center justify-between text-sm text-[#6a5a4a] font-body">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Mobile Filter Toggle ─── */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 font-body text-sm text-[#533a00] border border-[#e8dfd3] px-4 py-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "text-[#533a00]" : "text-[#c4b5a0]"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "text-[#533a00]" : "text-[#c4b5a0]"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── Mobile Filter Panel ─── */}
          {mobileFilterOpen && (
            <div className="lg:hidden bg-[#faf7f2] p-6 mb-4 space-y-6 border border-[#e8dfd3]">
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-sm uppercase tracking-wider mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-sm font-body transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#533a00] text-white"
                          : "bg-white text-[#6a5a4a] border border-[#e8dfd3]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-header font-bold text-[#1a120b] text-sm uppercase tracking-wider mb-3">Max Price: ${priceRange[1]}</h3>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#533a00]"
                />
              </div>
            </div>
          )}

          {/* ─── Product Grid ─── */}
          <div className="flex-1">
            {/* Top bar: sort + view toggle */}
            <div className="hidden lg:flex items-center justify-between mb-8 pb-6 border-b border-[#e8dfd3]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${viewMode === "grid" ? "text-[#533a00]" : "text-[#c4b5a0]"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${viewMode === "list" ? "text-[#533a00]" : "text-[#c4b5a0]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#e8dfd3] px-4 py-2 pr-8 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6a5a4a] pointer-events-none" />
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-[#533a00] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#6a5a4a] font-body text-lg">No products match your filters.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setPriceRange([0, 200]); }}
                  className="mt-4 text-[#533a00] underline font-body text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                  : "flex flex-col gap-6"
              }>
                {filtered.map((product) => (
                  <div key={product.id} className="group">
                    {viewMode === "grid" ? (
                      <>
                        <NextLink href={`/shop/${product.slug}`} className="block">
                          <div className="aspect-[3/4] overflow-hidden bg-[#f5f0eb] mb-4 relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.badge && (
                              <span className="absolute top-3 left-3 bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </NextLink>
                        <NextLink href={`/shop/${product.slug}`} className="block">
                          <h3 className="font-header font-bold text-[#1a120b] text-sm md:text-lg group-hover:text-[#533a00] transition-colors">{product.name}</h3>
                          <p className="text-[#6a5a4a] text-xs md:text-sm font-body mt-0.5">{product.tagline}</p>
                          <p className="text-[#533a00] font-semibold mt-1.5 text-sm md:text-base">${product.price.toFixed(2)}</p>
                        </NextLink>
                      </>
                    ) : (
                      <NextLink href={`/shop/${product.slug}`} className="block">
                        <div className="flex gap-6 bg-[#faf7f2] p-4 group">
                          <div className="w-32 h-40 shrink-0 overflow-hidden bg-[#f5f0eb]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            {product.badge && (
                              <span className="inline-block bg-[#533a00] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold w-fit mb-2">
                                {product.badge}
                              </span>
                            )}
                            <h3 className="font-header font-bold text-[#1a120b] text-lg">{product.name}</h3>
                            <p className="text-[#6a5a4a] font-body text-sm mt-1">{product.tagline}</p>
                            <p className="text-[#533a00] font-semibold mt-2">${product.price.toFixed(2)}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  image: product.image,
                                  price: product.price,
                                  quantity: 1,
                                  tagline: product.tagline,
                                });
                              }}
                              className="mt-3 w-fit px-6 py-2 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </NextLink>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#533a00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}