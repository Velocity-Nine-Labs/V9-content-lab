import config from "@/config";

const baseUrl = `https://${config.domainName}`;

// ============================================
// SITE-WIDE SCHEMAS
// ============================================

/**
 * Organization Schema - use in root layout
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.appName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: config.appDescription,
    // Add social profiles if configured
    // sameAs: [twitter, facebook, linkedin, instagram].filter(Boolean),
  };
}

/**
 * WebSite Schema with Search - use in root layout
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.appName,
    url: baseUrl,
    description: config.appDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ============================================
// CONTENT PAGE SCHEMAS
// ============================================

interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

/**
 * Article Schema - for blog posts and content pages
 */
export function generateArticleSchema(article: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image || `${baseUrl}/opengraph-image.png`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      "@type": "Person",
      name: article.author || config.appName,
    },
    publisher: {
      "@type": "Organization",
      name: config.appName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    ...(article.section && { articleSection: article.section }),
  };
}

// ============================================
// FAQ SCHEMA
// ============================================

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Schema - for FAQ sections (triggers rich results in Google)
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================
// HOW-TO SCHEMA
// ============================================

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaInput {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration: "PT30M" = 30 mins, "P2W" = 2 weeks
  steps: HowToStep[];
}

/**
 * HowTo Schema - for tutorials and guides
 */
export function generateHowToSchema(howTo: HowToSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    ...(howTo.totalTime && { totalTime: howTo.totalTime }),
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: step.image,
        },
      }),
    })),
  };
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Breadcrumb Schema - for navigation trails
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================
// BUSINESS SCHEMAS
// ============================================

interface LocalBusinessInput {
  name: string;
  description: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  priceRange?: string;
  openingHours?: string[];
}

/**
 * LocalBusiness Schema - for service businesses
 */
export function generateLocalBusinessSchema(business: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    url: baseUrl,
    ...(business.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        addressRegion: business.address.state,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
    }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(business.openingHours && {
      openingHoursSpecification: business.openingHours,
    }),
  };
}

interface ServiceSchemaInput {
  name: string;
  description: string;
  provider: string;
  url: string;
  areaServed?: string;
}

/**
 * Service Schema - for service pages
 */
export function generateServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider,
    },
    url: service.url,
    ...(service.areaServed && { areaServed: service.areaServed }),
  };
}

// ============================================
// SOFTWARE APPLICATION SCHEMA
// ============================================

interface SoftwareAppInput {
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
}

/**
 * SoftwareApplication Schema - for SaaS products
 */
export function generateSoftwareAppSchema(app: SoftwareAppInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: baseUrl,
    applicationCategory: app.applicationCategory || "BusinessApplication",
    operatingSystem: app.operatingSystem || "Web",
    ...(app.offers && {
      offers: {
        "@type": "Offer",
        price: app.offers.price,
        priceCurrency: app.offers.priceCurrency,
      },
    }),
    ...(app.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: app.aggregateRating.ratingValue,
        ratingCount: app.aggregateRating.ratingCount,
      },
    }),
  };
}
