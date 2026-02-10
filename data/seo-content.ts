/**
 * SEO Content Data
 * Define your programmatic SEO pages here
 * This enables scaling content pages while maintaining SEO best practices
 */

// ============================================
// CONTENT PAGE TYPE
// ============================================

export interface ContentPage {
  slug: string;
  title: string;
  metaTitle: string; // 50-60 characters optimal
  metaDescription: string; // 150-160 characters optimal
  heroTitle: string;
  heroSubtitle: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedSlugs: string[];
  publishedDate: string;
  modifiedDate?: string;
}

// ============================================
// EXAMPLE: FEATURE PAGES
// ============================================

export const FEATURE_PAGES: ContentPage[] = [
  // TODO: Add your feature pages here
  // {
  //   slug: "feature-one",
  //   title: "Feature One",
  //   metaTitle: "Feature One - Your Key Benefit | AppName",
  //   metaDescription: "Discover how Feature One helps you achieve X. Learn about the key benefits and how to get started.",
  //   heroTitle: "Feature One That Delivers Results",
  //   heroSubtitle: "Achieve more with less effort",
  //   introduction: "Introduction paragraph explaining the feature...",
  //   sections: [
  //     {
  //       title: "How It Works",
  //       content: "Detailed explanation of how this feature works...",
  //     },
  //     {
  //       title: "Key Benefits",
  //       content: "List of benefits users will experience...",
  //     },
  //   ],
  //   faqs: [
  //     {
  //       question: "How do I get started with Feature One?",
  //       answer: "Getting started is easy. Simply...",
  //     },
  //     {
  //       question: "Is Feature One included in all plans?",
  //       answer: "Yes, Feature One is available on all plans...",
  //     },
  //   ],
  //   relatedSlugs: ["feature-two", "getting-started"],
  //   publishedDate: "2024-01-01",
  // },
];

// ============================================
// EXAMPLE: SERVICE PAGES (for agencies/service businesses)
// ============================================

export const SERVICE_PAGES: ContentPage[] = [
  // TODO: Add your service pages here
  // {
  //   slug: "web-design",
  //   title: "Web Design Services",
  //   metaTitle: "Professional Web Design Services | Company Name",
  //   metaDescription: "Custom web design solutions that convert visitors into customers. Modern, responsive designs tailored to your brand.",
  //   heroTitle: "Web Design That Converts",
  //   heroSubtitle: "Beautiful, functional websites built for results",
  //   introduction: "Your introduction paragraph...",
  //   sections: [
  //     { title: "Our Process", content: "Our design process..." },
  //     { title: "What's Included", content: "List of deliverables..." },
  //   ],
  //   faqs: [
  //     { question: "How long does a website take?", answer: "Typically 4-8 weeks..." },
  //   ],
  //   relatedSlugs: ["seo-services", "branding"],
  //   publishedDate: "2024-01-01",
  // },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a feature page by slug
 */
export function getFeatureBySlug(slug: string): ContentPage | undefined {
  return FEATURE_PAGES.find((p) => p.slug === slug);
}

/**
 * Get all feature slugs for static generation
 */
export function getAllFeatureSlugs(): string[] {
  return FEATURE_PAGES.map((p) => p.slug);
}

/**
 * Get a service page by slug
 */
export function getServiceBySlug(slug: string): ContentPage | undefined {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}

/**
 * Get all service slugs for static generation
 */
export function getAllServiceSlugs(): string[] {
  return SERVICE_PAGES.map((p) => p.slug);
}

/**
 * Get related pages from slugs
 */
export function getRelatedPagesFromSlugs(
  slugs: string[],
  allPages: ContentPage[]
): ContentPage[] {
  return slugs
    .map((slug) => allPages.find((p) => p.slug === slug))
    .filter(Boolean) as ContentPage[];
}
