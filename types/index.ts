import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  category: string;
  badge?: string | null;
  ingredients: string[];
  howToUse: string[];
  keyBenefits: string[];
  size: string;
  hairType: string[];
}
