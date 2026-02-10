import config from "@/config";

const baseUrl = `https://${config.domainName}`;

// ============================================
// PAGE NODE TYPE
// ============================================

export interface PageNode {
  slug: string;
  title: string;
  description: string;
  path: string;
  category: string;
  tags: string[];
  parent?: string;
  priority: number;
}

// ============================================
// SITE PAGES REGISTRY
// Define your site's page structure here for internal linking
// ============================================

export const SITE_PAGES: PageNode[] = [
  // Main Hubs (high priority pages)
  {
    slug: "home",
    title: "Home",
    description: config.appDescription,
    path: "/",
    category: "hub",
    tags: ["main"],
    priority: 10,
  },
  {
    slug: "pricing",
    title: "Pricing",
    description: "View our pricing plans and features",
    path: "/#pricing",
    category: "hub",
    tags: ["pricing", "plans"],
    priority: 9,
  },
  {
    slug: "blog",
    title: "Blog",
    description: "Read our latest articles and updates",
    path: "/blog",
    category: "hub",
    tags: ["blog", "content"],
    priority: 8,
  },

  // Legal pages
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "Our privacy policy and data handling practices",
    path: "/privacy-policy",
    category: "legal",
    tags: ["legal", "privacy"],
    priority: 3,
  },
  {
    slug: "tos",
    title: "Terms of Service",
    description: "Our terms of service and usage agreement",
    path: "/tos",
    category: "legal",
    tags: ["legal", "terms"],
    priority: 3,
  },

  // TODO: Add your content pages here following this pattern:
  // {
  //   slug: "feature-1",
  //   title: "Feature One",
  //   description: "Description of feature one",
  //   path: "/features/feature-1",
  //   category: "features",
  //   tags: ["features", "specific-tag"],
  //   parent: "features", // Optional: links to parent hub
  //   priority: 7,
  // },
];

// ============================================
// INTERNAL LINKING FUNCTIONS
// ============================================

/**
 * Get related pages using relevance scoring
 * Uses category matching, shared tags, and sibling relationships
 */
export function getRelatedPages(
  currentSlug: string,
  limit: number = 5
): PageNode[] {
  const currentPage = SITE_PAGES.find((p) => p.slug === currentSlug);
  if (!currentPage) return [];

  const scored = SITE_PAGES.filter((p) => p.slug !== currentSlug)
    .map((page) => {
      let score = 0;

      // Same category = high relevance
      if (page.category === currentPage.category) score += 5;

      // Shared tags = medium relevance
      const sharedTags = page.tags.filter((t) => currentPage.tags.includes(t));
      score += sharedTags.length * 2;

      // Same parent (siblings) = high relevance
      if (page.parent && page.parent === currentPage.parent) score += 4;

      // Priority boost
      score += page.priority / 5;

      return { page, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ page }) => page);

  return scored;
}

/**
 * Get breadcrumb trail for a page
 */
export function getBreadcrumbs(
  slug: string
): Array<{ name: string; url: string }> {
  const page = SITE_PAGES.find((p) => p.slug === slug);
  if (!page) return [{ name: "Home", url: baseUrl }];

  const crumbs = [{ name: "Home", url: baseUrl }];

  // Add parent if exists
  if (page.parent) {
    const parent = SITE_PAGES.find((p) => p.slug === page.parent);
    if (parent) {
      crumbs.push({ name: parent.title, url: `${baseUrl}${parent.path}` });
    }
  }

  // Add current page
  crumbs.push({ name: page.title, url: `${baseUrl}${page.path}` });

  return crumbs;
}

/**
 * Get all child pages of a hub
 */
export function getChildPages(hubSlug: string): PageNode[] {
  return SITE_PAGES.filter((p) => p.parent === hubSlug);
}

/**
 * Get pages by category
 */
export function getPagesByCategory(category: string): PageNode[] {
  return SITE_PAGES.filter((p) => p.category === category);
}

/**
 * Get page by slug
 */
export function getPageBySlug(slug: string): PageNode | undefined {
  return SITE_PAGES.find((p) => p.slug === slug);
}

/**
 * Get all slugs for static generation
 */
export function getAllSlugs(): string[] {
  return SITE_PAGES.map((p) => p.slug);
}
