# Contentful Content Models

This document documents all Contentful content models used in the Mariéa Hair Co. project. Each model includes field definitions, validation rules, and notes on how it maps to the frontend.

---

## Blog Post

**Content Type ID:** `blogPost`

Used for the Hair Care blog at `/haircare` and `/haircare/[slug]`.

### Fields

| Field ID | Type | Required | Validation / Notes |
|---|---|---|---|
| `title` | Short text | ✅ | Main headline. Maps to `<h1>` and meta title. |
| `slug` | Short text | ✅ | URL-friendly identifier. Use Contentful's slug validation (`unique`). e.g. `ultimate-guide-to-4c-hair-care` |
| `excerpt` | Long text | ✅ | Short summary shown on listing cards and in meta descriptions. |
| `content` | **Rich text** | ✅ | Full article body. Use Contentful's Rich Text editor for structured content (headings, paragraphs, lists, bold, inline images). Render with `@contentful/rich-text-react-renderer`. |
| `coverImage` | Media (image) | ✅ | Hero image for the post. Displayed at top of detail page and as card thumbnail on listing. |
| `category` | Short text | ✅ | e.g. "Hair Care Tips", "Ingredients", "Routine". Future: migrate to a Reference → Category content type. |
| `author` | Short text | ✅ | Display name of the writer. e.g. "Mariéa Trichology Team" |
| `readTime` | Short text | ✅ | e.g. "8 min read". |
| `publishedAt` | Date & time | ✅ | Controls display order (newest first) and the published date shown on the page. |
| `tags` | Array of short text | ❌ | Displayed as pill badges on the detail page below the hero. Future: migrate to References → Tag content type. |

### Frontend Mapping

- **TypeScript interface:** `BlogPost` in `types/index.ts`
- **Mock data (pre-Contentful):** `lib/blog-data.ts`
- **Listing page:** `app/haircare/page.tsx`
- **Detail page:** `app/haircare/[slug]/page.tsx`
- **Content renderer:** `components/blog-content.tsx` — replace with `documentToReactComponents()` from `@contentful/rich-text-react-renderer` when Contentful is connected

### Migration Steps

1. Install packages: `npm install contentful @contentful/rich-text-react-renderer`
2. Create `lib/contentful.ts` with client initialization using env vars
3. Replace mock data in `lib/blog-data.ts` with Contentful API calls
4. Replace `<BlogContent>` in detail page with `documentToReactComponents(post.content)`
5. Remove `components/blog-content.tsx` once migration is complete

---

## Future Models

_(To be documented as they are created)_

- **Product** — Shop catalog items
- **Category** — Product categories (Shampoo, Conditioner, Treatments, Styling)
- **Order** — Customer orders  
- **Customer** — User profiles