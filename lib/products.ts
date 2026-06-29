import { Product } from "@/types";

export const products: Product[] = [
  {
    slug: "hydrating-shampoo",
    name: "Hydrating Shampoo",
    tagline: "Weightless moisture for parched strands",
    description:
      "A sulfate-free cleansing formula that removes buildup without stripping natural oils. Infused with cold-pressed argan and jojoba oils to hydrate and soften. Formulated for curly, coily, and color-treated hair. pH-balanced to support scalp health.",
    image: "/shampoo.jpeg",
    price: 34.0,
    category: "Shampoo",
    badge: "Bestseller",
    ingredients: [
      "Aqua (Water)",
      "Aloe Vera Leaf Juice",
      "Argania Spinosa Kernel Oil (Argan)",
      "Simmondsia Chinensis Seed Oil (Jojoba)",
      "Cetyl Alcohol",
      "Behentrimonium Methosulfate",
      "Glycerin",
      "Fragrance",
    ],
    howToUse: [
      "Wet hair thoroughly with lukewarm water.",
      "Apply a small amount of shampoo to the scalp.",
      "Massage gently with fingertips — avoid nails.",
      "Rinse thoroughly and follow with Hydrating Conditioner.",
    ],
    keyBenefits: [
      "Sulfate-free, gentle cleanse",
      "Deep hydration without weight",
      "Helps reduce frizz and tangles",
      "Safe for color-treated hair",
    ],
    size: "8 fl oz / 237 mL",
    hairType: ["Curly", "Coily", "Wavy", "Color-Treated"],
  },
  {
    slug: "repair-mask",
    name: "Repair Mask",
    tagline: "Deep recovery for damaged hair",
    description:
      "An intensive weekly treatment that penetrates the hair shaft to rebuild strength from within. Powered by hydrolyzed keratin, ceramides, and cold-pressed marula oil. Transforms brittle, dull, and over-processed hair into resilient, glossy strands.",
    image: "/repair-mask.jpeg",
    price: 42.0,
    category: "Treatments",
    badge: null,
    ingredients: [
      "Aqua (Water)",
      "Cetearyl Alcohol",
      "Behentrimonium Chloride",
      "Hydrolyzed Keratin",
      "Sclerocarya Birrea Seed Oil (Marula)",
      "Ceramide NP",
      "Panthenol (Vitamin B5)",
      "Tocopherol (Vitamin E)",
    ],
    howToUse: [
      "After shampooing, apply generously from root to tip.",
      "Leave on for 10–15 minutes for light repair.",
      "For deep conditioning, leave on up to 30 minutes with a heat cap.",
      "Rinse thoroughly and style as usual.",
    ],
    keyBenefits: [
      "Rebuilds damaged fiber",
      "Reduces split ends",
      "Restores elasticity",
      "Adds intense shine",
    ],
    size: "6.7 fl oz / 200 mL",
    hairType: ["All Hair Types", "Damaged", "Color-Treated", "Relaxed"],
  },
  {
    slug: "nourishing-oil",
    name: "Nourishing Oil",
    tagline: "Daily shine and split-end seal",
    description:
      "A lightweight, fast-absorbing blend of six cold-pressed botanical oils. Adds brilliant shine, tames flyaways, and seals split ends without weighing hair down. Use as a pre-shampoo treatment, leave-in, or finishing oil.",
    image: "/nourishing.jpeg",
    price: 28.0,
    category: "Styling",
    badge: "New",
    ingredients: [
      "Simmondsia Chinensis Seed Oil (Jojoba)",
      "Argania Spinosa Kernel Oil (Argan)",
      "Sclerocarya Birrea Seed Oil (Marula)",
      "Cocos Nucifera Oil (Coconut)",
      "Oryza Sativa Bran Oil (Rice Bran)",
      "Vitis Vinifera Seed Oil (Grapeseed)",
      "Rosemary Extract",
      "Lavender Essential Oil",
    ],
    howToUse: [
      "Warm 2–3 drops between palms.",
      "Apply to damp or dry hair, focusing on ends.",
      "For deep conditioning, apply to scalp and leave for 30 min before washing.",
      "Use a few drops on styled hair to tame flyaways and add shine.",
    ],
    keyBenefits: [
      "Cold-pressed, 6-oil blend",
      "Eliminates frizz and flyaways",
      "Lightweight, non-greasy finish",
      "Supports scalp health",
    ],
    size: "2 fl oz / 60 mL",
    hairType: ["All Hair Types", "Curly", "Coily", "Wavy"],
  },
  {
    slug: "hydrating-conditioner",
    name: "Hydrating Conditioner",
    tagline: "Detangles and seals with botanicals",
    description:
      "A rich, creamy conditioner that melts tangles and locks in moisture. Formulated with shea butter, silk amino acids, and chamomile extract. Leaves hair soft, bouncy, and easy to detangle.",
    image: "/hydrating.jpeg",
    price: 36.0,
    category: "Conditioner",
    badge: "Bestseller",
    ingredients: [
      "Aqua (Water)",
      "Cetyl Alcohol",
      "Stearyl Alcohol",
      "Butyrospermum Parkii Butter (Shea)",
      "Hydrolyzed Silk Amino Acids",
      "Chamomilla Recutita Extract (Chamomile)",
      "Behentrimonium Methosulfate",
      "Glycerin",
    ],
    howToUse: [
      "After shampooing, apply generously to mid-lengths and ends.",
      "Leave on for 2–3 minutes.",
      "Detangle with fingers or wide-tooth comb.",
      "Rinse thoroughly with cool water to seal the cuticle.",
    ],
    keyBenefits: [
      "Intense slip for easy detangling",
      "Seals cuticle and locks moisture",
      "Adds softness and bounce",
      "Helps reduce breakage",
    ],
    size: "8 fl oz / 237 mL",
    hairType: ["Curly", "Coily", "Wavy", "Relaxed"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentSlug: string, count: number = 4): Product[] {
  return products.filter((p) => p.slug !== currentSlug).slice(0, count);
}