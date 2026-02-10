import { Metadata } from "next";
import config from "@/config";

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noIndex?: boolean;
  image?: string;
}

const baseUrl = `https://${config.domainName}`;

/**
 * Generate metadata for a page with all SEO best practices
 * @param page - Page metadata configuration
 * @param path - URL path (e.g., "/about", "/services/web-design")
 */
export function generatePageMetadata(page: PageMetadata, path: string): Metadata {
  const url = `${baseUrl}${path}`;

  return {
    // Title: 50-60 characters optimal
    title: `${page.title} | ${config.appName}`,
    // Description: 150-160 characters optimal
    description: page.description,
    keywords: page.keywords,

    // Canonical URL - prevents duplicate content
    alternates: {
      canonical: url,
    },

    // Robots directives
    robots: page.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    // Open Graph
    openGraph: {
      title: page.title,
      description: page.description,
      url: url,
      siteName: config.appName,
      type: page.ogType || "website",
      locale: "en_US",
      ...(page.image && {
        images: [{ url: page.image, width: 1200, height: 630 }],
      }),
      ...(page.ogType === "article" && {
        publishedTime: page.publishedTime,
        modifiedTime: page.modifiedTime,
        authors: page.author ? [page.author] : undefined,
        section: page.section,
      }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      ...(page.image && { images: [page.image] }),
    },
  };
}

/**
 * Generate metadata for programmatic/template pages
 * Replaces {{variable}} placeholders with actual values
 */
export function generateProgrammaticMetadata(
  template: { title: string; description: string },
  variables: Record<string, string>,
  path: string
): Metadata {
  let title = template.title;
  let description = template.description;

  // Replace template variables: {{variable}}
  Object.entries(variables).forEach(([key, value]) => {
    title = title.replace(new RegExp(`{{${key}}}`, "g"), value);
    description = description.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return generatePageMetadata(
    { title, description, ogType: "article" },
    path
  );
}

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
  return baseUrl;
}

/**
 * Generate a full URL from a path
 */
export function getFullUrl(path: string): string {
  return `${baseUrl}${path}`;
}
