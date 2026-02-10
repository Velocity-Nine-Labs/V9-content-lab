/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://example.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // Exclude private/dynamic routes
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/dashboard/*",
    "/api/*",
    "/auth/*",
    "/admin/*",
  ],

  // Robots.txt policies
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/dashboard", "/api", "/auth", "/admin"] },
    ],
  },

  // Custom transform for priority and changefreq
  transform: async (config, path) => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Main hub pages
    if (["/pricing", "/about", "/features", "/blog"].includes(path)) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Content pages (blog, docs, etc.)
    if (
      path.startsWith("/blog/") ||
      path.startsWith("/docs/") ||
      path.startsWith("/learn/")
    ) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Legal pages
    if (path === "/tos" || path === "/privacy-policy") {
      return {
        loc: path,
        changefreq: "yearly",
        priority: 0.3,
        lastmod: new Date().toISOString(),
      };
    }

    // Default
    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
