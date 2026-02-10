/**
 * SEO Example Page
 * This file demonstrates how to implement all SEO best practices
 * Copy and modify for your content pages
 * 
 * Delete this folder when you don't need it anymore
 */

import { Metadata } from "next";
import config from "@/config";
import { generatePageMetadata, getFullUrl } from "@/libs/seo/metadata";
import { generateArticleSchema, generateFAQSchema } from "@/libs/seo/schema";
import { getRelatedPages, getBreadcrumbs } from "@/libs/seo/internal-links";
import { JsonLd, Breadcrumbs, FAQSection, RelatedPages } from "@/components/seo";

// Force static generation for better performance
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate every 24 hours

// ============================================
// METADATA (generates <head> tags)
// ============================================

export const metadata: Metadata = generatePageMetadata(
  {
    title: "SEO Example Page", // 50-60 chars optimal
    description: "This is an example page demonstrating all SEO best practices. Learn how to implement structured data, internal linking, and more.", // 150-160 chars
    keywords: ["SEO", "Next.js", "example", "tutorial"],
    ogType: "article",
    publishedTime: "2024-01-01",
    modifiedTime: new Date().toISOString(),
    author: "Your Name",
    section: "Tutorials",
  },
  "/seo-example" // URL path
);

// ============================================
// PAGE CONTENT
// ============================================

// FAQ data - will generate schema automatically
const faqs = [
  {
    question: "How do I implement SEO in Next.js?",
    answer: "Use the generatePageMetadata function for meta tags, structured data schemas for rich results, and the SEO components for breadcrumbs and FAQs.",
  },
  {
    question: "What is structured data?",
    answer: "Structured data is a standardized format (Schema.org/JSON-LD) that helps search engines understand your content and can trigger rich results in search.",
  },
  {
    question: "Why is internal linking important?",
    answer: "Internal links help search engines discover and index your pages, distribute page authority, and improve user navigation throughout your site.",
  },
];

export default function SEOExamplePage() {
  const baseUrl = `https://${config.domainName}`;
  const pageUrl = getFullUrl("/seo-example");

  // Generate structured data schemas
  const articleSchema = generateArticleSchema({
    title: "SEO Example Page",
    description: "This is an example page demonstrating all SEO best practices.",
    url: pageUrl,
    publishedTime: "2024-01-01",
    modifiedTime: new Date().toISOString(),
    author: "Your Name",
    section: "Tutorials",
  });

  // Get breadcrumbs and related pages
  // Note: For this to work fully, add "seo-example" to SITE_PAGES in libs/seo/internal-links.ts
  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "SEO Example", url: pageUrl },
  ];

  // Get related pages (returns empty if page not in registry)
  const relatedPages = getRelatedPages("seo-example", 3);

  return (
    <>
      {/* Structured Data - goes in <head> */}
      <JsonLd data={articleSchema} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumbs with Schema */}
        <Breadcrumbs items={breadcrumbs} className="mb-8" />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">SEO Example Page</h1>
          <p className="text-xl text-base-content/70">
            This page demonstrates all SEO best practices for Next.js
          </p>
        </header>

        {/* Content Sections */}
        <section className="prose max-w-none mb-12">
          <h2>Introduction</h2>
          <p>
            This example page shows you how to implement comprehensive SEO in your 
            Next.js application. It includes metadata, structured data, breadcrumbs, 
            FAQs with schema, and internal linking.
          </p>

          <h2>What&apos;s Included</h2>
          <ul>
            <li><strong>Metadata:</strong> Title, description, Open Graph, Twitter Cards</li>
            <li><strong>Structured Data:</strong> Article schema for rich results</li>
            <li><strong>Breadcrumbs:</strong> Navigation with BreadcrumbList schema</li>
            <li><strong>FAQ Section:</strong> Accordion with FAQPage schema</li>
            <li><strong>Internal Links:</strong> Related pages for better crawlability</li>
          </ul>

          <h2>How to Use This Template</h2>
          <ol>
            <li>Copy this file to your new page location</li>
            <li>Update the metadata with your page&apos;s title and description</li>
            <li>Modify the content sections</li>
            <li>Update the FAQs relevant to your page</li>
            <li>Add your page to <code>SITE_PAGES</code> in <code>libs/seo/internal-links.ts</code></li>
          </ol>
        </section>

        {/* FAQ Section (includes schema automatically) */}
        <FAQSection 
          faqs={faqs} 
          title="Frequently Asked Questions"
          className="mb-12" 
        />

        {/* Related Pages (internal linking) */}
        {relatedPages.length > 0 && (
          <RelatedPages
            pages={relatedPages.map((p) => ({
              title: p.title,
              description: p.description,
              url: p.path,
            }))}
            title="Related Pages"
            className="mb-12"
          />
        )}

        {/* Fallback if no related pages found */}
        {relatedPages.length === 0 && (
          <aside className="p-6 bg-base-200 rounded-lg mb-12">
            <h3 className="font-bold mb-2">💡 Tip: Set Up Internal Linking</h3>
            <p className="text-sm text-base-content/70">
              Add this page to <code>SITE_PAGES</code> in{" "}
              <code>libs/seo/internal-links.ts</code> to enable automatic related 
              pages suggestions.
            </p>
          </aside>
        )}
      </main>
    </>
  );
}
