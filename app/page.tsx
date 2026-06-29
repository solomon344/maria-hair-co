"use client";

import "@/app/style.css";
import { CTA } from "@/components/CTA";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/reveal";
import { Leaf, Sparkles, Recycle, Star } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "100% Botanical Ingredients",
    description: "Cold-pressed oils, organic extracts, and sustainably harvested botanicals in every formula."
  },
  {
    icon: Sparkles,
    title: "Science-Backed Formulas",
    description: "Developed with trichologists to deliver measurable results for all hair types and textures."
  },
  {
    icon: Recycle,
    title: "Zero-Waste Commitment",
    description: "Refillable packaging, biodegradable materials, and a carbon-neutral supply chain."
  }
];

const bestsellers = [
  {
    name: "Hydrating Shampoo",
    tagline: "Weightless moisture for parched strands",
    image: "/shampoo.jpeg",
    price: "$34.00"
  },
  {
    name: "Repair Mask",
    tagline: "Deep recovery for damaged hair",
    image: "/repair-mask.jpeg",
    price: "$42.00"
  },
  {
    name: "Nourishing Oil",
    tagline: "Daily shine and split-end seal",
    image: "/nourishing.jpeg",
    price: "$28.00"
  },
  {
    name: "Hydrating Conditioner",
    tagline: "Detangles and seals with botanicals",
    image: "/hydrating.jpeg",
    price: "$36.00"
  }
];

const testimonials = [
  {
    name: "Amara K.",
    text: "My 4C hair has never felt this hydrated. After one wash day with the Hydrating Shampoo, my curls were defined and soft without any crunch. This is my forever brand.",
    rating: 5,
    title: "Verified Buyer"
  },
  {
    name: "Jasmine T.",
    text: "The Repair Mask saved my chemically damaged hair. I've tried everything — Olaplex, K18 — nothing compares. My stylist asked what I changed. I told her Mariéa.",
    rating: 5,
    title: "Verified Buyer"
  },
  {
    name: "Elena R.",
    text: "Finally, a brand that takes sustainability seriously without compromising quality. The refill program is seamless and the Nourishing Oil smells like heaven.",
    rating: 5,
    title: "Verified Buyer"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ──────────── HERO ──────────── */}
      <div className="banner h-[100dvh] w-full relative overflow-hidden">
        {/* Decorative clip-path shapes */}
        <div className="hero-shape-1" />
        <div className="hero-shape-2" />
        <div className="hero-shape-3" />
        <div className="hero-shape-4" />

        <div className="w-full h-full bg-black/50 flex items-center px-6 pt-20 relative z-10">
          <div className="flex flex-col gap-6 max-w-2xl">
            <Reveal direction="up">
              <div className="text-[3.5rem] md:text-[4rem] font-header text-white leading-tight">
                <span>Naturally Rooted.</span>
                <span className="block">Engineered for Brilliance.</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <div className="text-white text-lg md:text-xl max-w-xl font-body">
                <span>Experience the fusion of organic botanical wisdom and modern hair science.</span>
                <span className="block">Professional results, sustainably sourced.</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.4}>
              <div>
                <CTA />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Wave/rope curve divider at hero bottom */}
        <div className="hero-curve-divider">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* ──────────── SHOP BY CATEGORY ──────────── */}
      <section className="px-6 md:px-8 py-16 md:py-20 max-w-7xl mx-auto w-full">
        <Reveal direction="up">
          <div className="flex flex-col gap-3 mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold">The Essentials</p>
            <p className="text-3xl md:text-4xl font-header text-[#1a120b]">Shop by Category</p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div className="h-[40dvh] md:h-[50dvh] w-full grid grid-cols-2 gap-3 md:gap-4">

            <a href="/shop?category=Shampoo" className="h-full overflow-hidden group cursor-pointer relative block">
              <img src="/shampoo.jpeg" alt="Shampoo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-4 md:p-6">
                <span className="text-white font-header font-bold text-lg md:text-xl tracking-wide">Shampoo</span>
              </div>
            </a>

            <div className="grid grid-cols-1 h-full gap-3 md:gap-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <a href="/shop?category=Treatments" className="overflow-hidden group cursor-pointer relative block">
                  <img src="/repair-mask.jpeg" alt="Treatments" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-3 md:p-4">
                    <span className="text-white font-header font-bold text-sm md:text-lg">Treatments</span>
                  </div>
                </a>
                <a href="/shop?category=Styling" className="overflow-hidden group cursor-pointer relative block">
                  <img src="/nourishing.jpeg" alt="Styling" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-3 md:p-4">
                    <span className="text-white font-header font-bold text-sm md:text-lg">Styling</span>
                  </div>
                </a>
              </div>

              <a href="/shop?category=Conditioner" className="overflow-hidden group cursor-pointer h-full relative block">
                <img src="/hydrating.jpeg" alt="Conditioner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-4 md:p-6">
                  <span className="text-white font-header font-bold text-lg md:text-xl">Conditioner</span>
                </div>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ──────────── WHY MARIÉA ──────────── */}
      <section className="bg-[#faf7f2] w-full">
        <div className="px-6 md:px-8 py-20 max-w-7xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-14">
              <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-3">Why Mariéa</p>
              <p className="text-3xl md:text-4xl font-header text-[#1a120b]">Rooted in Nature. Proven by Science.</p>
            </div>
          </Reveal>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <StaggerItem key={benefit.title}>
                    <div className="text-center flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#e8dfd3] flex items-center justify-center text-[#533a00]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-header font-bold text-[#1a120b]">{benefit.title}</h3>
                      <p className="text-[#5a4a3a] font-body leading-relaxed">{benefit.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ──────────── BESTSELLERS ──────────── */}
      <section className="px-6 md:px-8 py-20 max-w-7xl mx-auto w-full">
        <Reveal direction="up">
          <div className="flex flex-col gap-3 mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold">The Collection</p>
            <p className="text-3xl md:text-4xl font-header text-[#1a120b]">Bestsellers</p>
          </div>
        </Reveal>

        <StaggerContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((product) => (
              <StaggerItem key={product.name}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden bg-[#f5f0eb] mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-header font-bold text-[#1a120b] text-lg">{product.name}</h3>
                  <p className="text-[#6a5a4a] text-sm font-body mt-1">{product.tagline}</p>
                  <p className="text-[#533a00] font-semibold mt-2">{product.price}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* ──────────── BANNER DIVIDER ──────────── */}
      <section className="relative w-full h-[40dvh] md:h-[50dvh] bg-[url('/banner.jpeg')] bg-fixed bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-6">
          <Reveal direction="up">
            <p className="text-white/80 text-sm uppercase tracking-[0.3em] font-body font-semibold mb-4">The Mariéa Difference</p>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="text-white text-2xl md:text-4xl font-header max-w-2xl leading-snug">
              &ldquo;Every strand tells a story. We&rsquo;re here to make yours beautiful.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────── TESTIMONIALS ──────────── */}
      <section className="bg-[#faf7f2] w-full">
        <div className="px-6 md:px-8 py-20 max-w-7xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-14">
              <p className="text-sm uppercase tracking-[0.2em] text-[#533a00] font-body font-semibold mb-3">Real Talk</p>
              <p className="text-3xl md:text-4xl font-header text-[#1a120b]">Loved by Thousands</p>
            </div>
          </Reveal>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <StaggerItem key={t.name}>
                  <div className="bg-white p-8 rounded-sm shadow-sm border border-[#e8dfd3] flex flex-col gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#c4a35a] text-[#c4a35a]" />
                      ))}
                    </div>
                    <p className="text-[#3a2a1a] font-body leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="mt-auto pt-2">
                      <p className="font-header font-bold text-[#1a120b]">{t.name}</p>
                      <p className="text-[#8a7a6a] text-sm">{t.title}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ──────────── NEWSLETTER ──────────── */}
      <section className="w-full bg-gradient-to-br from-[#3d2b1f] to-[#1a120b]">
        <div className="px-6 md:px-8 py-20 max-w-2xl mx-auto text-center">
          <Reveal direction="up">
            <p className="text-[#c4a35a] text-sm uppercase tracking-[0.2em] font-body font-semibold mb-3">Stay Connected</p>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <p className="text-white text-3xl md:text-4xl font-header mb-4">Join the Inner Circle</p>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-[#c4b5a0] font-body mb-8 leading-relaxed">
              Be the first to access new drops, exclusive discounts, and hair care tips from our team of trichologists.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.45}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-[#8a7a6a] font-body focus:outline-none focus:border-[#c4a35a] transition-colors"
              />
              <button className="px-8 py-4 bg-[#c4a35a] text-[#1a120b] font-header font-bold uppercase tracking-wider hover:bg-[#d4b36a] transition-colors">
                Subscribe
              </button>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}