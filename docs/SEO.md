# SEO Implementation Guide

This boilerplate includes a comprehensive SEO system. This guide explains how to use it effectively.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Metadata](#metadata)
4. [Structured Data (Schema.org)](#structured-data)
5. [SEO Components](#seo-components)
6. [Internal Linking](#internal-linking)
7. [Programmatic SEO](#programmatic-seo)
8. [Checklist](#checklist)

---

## Quick Start

For a new content page:

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/libs/seo/metadata";
import { generateArticleSchema } from "@/libs/seo/schema";
import { JsonLd, Breadcrumbs, FAQSection } from "@/components/seo";

export const metadata: Metadata = generatePageMetadata(
  {
    title: "Your Page Title",
    description: "Your 150-160 character description...",
    ogType: "article",
  },
  "/your-page-path"
);

export default function YourPage() {
  return (
    <>
      <JsonLd data={generateArticleSchema({ ... })} />
      <main>
        <Breadcrumbs items={[...]} />
        {/* Your content */}
        <FAQSection faqs={[...]} />
      </main>
    </>
  );
}
```

---

## Project Structure

```
├── libs/seo/
│   ├── index.ts           # Central export
│   ├── metadata.ts        # Metadata generators
│   ├── schema.ts          # Schema.org generators
│   └── internal-links.ts  # Hub-and-spoke linking
├── components/seo/
│   ├── index.ts           # Central export
│   ├── JsonLd.tsx         # JSON-LD renderer
│   ├── Breadcrumbs.tsx    # Breadcrumb with schema
│   ├── FAQSection.tsx     # FAQ accordion with schema
│   └── RelatedPages.tsx   # Internal linking component
├── data/
│   └── seo-content.ts     # Programmatic content data
├── next-sitemap.config.js # Sitemap configuration
└── public/robots.txt      # Crawler directives
```

---

## Metadata

### Basic Usage

```tsx
import { generatePageMetadata } from "@/libs/seo/metadata";

export const metadata = generatePageMetadata(
  {
    title: "Page Title",           // 50-60 chars
    description: "Description...", // 150-160 chars
    keywords: ["keyword1", "keyword2"],
    ogType: "website",             // or "article"
  },
  "/page-path"
);
```

### Article Pages

```tsx
export const metadata = generatePageMetadata(
  {
    title: "Article Title",
    description: "Article description...",
    ogType: "article",
    publishedTime: "2024-01-01",
    modifiedTime: "2024-06-15",
    author: "Author Name",
    section: "Category",
  },
  "/blog/article-slug"
);
```

### No-Index Pages

```tsx
export const metadata = generatePageMetadata(
  {
    title: "Private Page",
    description: "...",
    noIndex: true, // Prevents indexing
  },
  "/private"
);
```

---

## Structured Data

### Available Schemas

| Function | Use Case |
|----------|----------|
| `generateOrganizationSchema()` | Site-wide (in layout) |
| `generateWebSiteSchema()` | Site-wide (in layout) |
| `generateArticleSchema()` | Blog posts, content pages |
| `generateFAQSchema()` | FAQ sections |
| `generateHowToSchema()` | Tutorials, guides |
| `generateBreadcrumbSchema()` | Navigation trails |
| `generateLocalBusinessSchema()` | Service businesses |
| `generateServiceSchema()` | Service pages |
| `generateSoftwareAppSchema()` | SaaS products |

### Usage

```tsx
import { JsonLd } from "@/components/seo";
import { generateArticleSchema, generateFAQSchema } from "@/libs/seo/schema";

export default function Page() {
  const articleSchema = generateArticleSchema({
    title: "Article Title",
    description: "Description",
    url: "https://example.com/article",
    publishedTime: "2024-01-01",
    author: "Author Name",
  });

  const faqSchema = generateFAQSchema([
    { question: "Q1?", answer: "A1" },
    { question: "Q2?", answer: "A2" },
  ]);

  return (
    <>
      {/* Multiple schemas */}
      <JsonLd data={[articleSchema, faqSchema]} />
      <main>...</main>
    </>
  );
}
```

---

## SEO Components

### JsonLd

Renders structured data in the page head.

```tsx
import { JsonLd } from "@/components/seo";

<JsonLd data={schema} />
<JsonLd data={[schema1, schema2]} /> // Multiple
```

### Breadcrumbs

Renders navigation with BreadcrumbList schema.

```tsx
import { Breadcrumbs } from "@/components/seo";

<Breadcrumbs
  items={[
    { name: "Home", url: "https://example.com" },
    { name: "Blog", url: "https://example.com/blog" },
    { name: "Article", url: "https://example.com/blog/article" },
  ]}
/>
```

### FAQSection

Accordion FAQ with FAQPage schema (triggers rich results).

```tsx
import { FAQSection } from "@/components/seo";

<FAQSection
  faqs={[
    { question: "What is this?", answer: "This is..." },
    { question: "How does it work?", answer: "It works by..." },
  ]}
  title="Frequently Asked Questions"
/>
```

### RelatedPages

Internal linking for better crawlability.

```tsx
import { RelatedPages } from "@/components/seo";

<RelatedPages
  pages={[
    { title: "Related 1", description: "...", url: "/page-1" },
    { title: "Related 2", description: "...", url: "/page-2" },
  ]}
  title="Related Articles"
/>
```

---

## Internal Linking

### Setup

Define your site structure in `libs/seo/internal-links.ts`:

```typescript
export const SITE_PAGES: PageNode[] = [
  {
    slug: "home",
    title: "Home",
    description: "...",
    path: "/",
    category: "hub",
    tags: ["main"],
    priority: 10,
  },
  {
    slug: "feature-1",
    title: "Feature One",
    description: "...",
    path: "/features/feature-1",
    category: "features",
    tags: ["features", "specific-tag"],
    parent: "features", // Links to parent hub
    priority: 8,
  },
];
```

### Usage

```tsx
import { getRelatedPages, getBreadcrumbs } from "@/libs/seo/internal-links";

// Get related pages
const related = getRelatedPages("current-slug", 5);

// Get breadcrumbs
const breadcrumbs = getBreadcrumbs("current-slug");
```

---

## Programmatic SEO

For scaling content pages, use `data/seo-content.ts`:

```typescript
// data/seo-content.ts
export const SERVICE_PAGES: ContentPage[] = [
  {
    slug: "web-design",
    title: "Web Design",
    metaTitle: "Web Design Services | Company",
    metaDescription: "Custom web design...",
    heroTitle: "Web Design That Converts",
    // ... more content
    faqs: [{ question: "...", answer: "..." }],
    relatedSlugs: ["seo", "branding"],
  },
];
```

Then generate pages dynamically:

```tsx
// app/services/[slug]/page.tsx
export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export default function ServicePage({ params }) {
  const service = getServiceBySlug(params.slug);
  // Render page with service data
}
```

---

## Checklist

### Initial Setup
- [ ] Update `config.ts` with your domain
- [ ] Create `app/opengraph-image.png` (1200x630px)
- [ ] Create `app/twitter-image.png` (1200x630px)
- [ ] Update `app/icon.png` (favicon)
- [ ] Configure `next-sitemap.config.js`

### Per Page
- [ ] Export `metadata` using `generatePageMetadata()`
- [ ] Include appropriate schema (Article, FAQ, etc.)
- [ ] Add breadcrumbs
- [ ] Add FAQ section if applicable
- [ ] Include related pages section
- [ ] Add page to `SITE_PAGES` for internal linking

### Before Launch
- [ ] Run build: `npm run build`
- [ ] Verify sitemap.xml generated
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Submit sitemap to Google Search Console

---

## Quick Reference

| Element | Optimal Length |
|---------|----------------|
| Title Tag | 50-60 characters |
| Meta Description | 150-160 characters |
| H1 Heading | 20-70 characters |
| URL Slug | 3-5 words, lowercase, hyphens |
| Image Alt | 125 characters max |
| OG Image | 1200x630px (1.91:1 ratio) |

---

## Resources

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
