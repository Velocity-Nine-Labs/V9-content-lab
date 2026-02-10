import Link from "next/link";
import JsonLd from "./JsonLd";
import { generateBreadcrumbSchema, BreadcrumbItem } from "@/libs/seo/schema";

/**
 * Breadcrumbs Component with Schema.org markup
 * Displays navigation trail and adds structured data for SEO
 * 
 * Usage:
 * <Breadcrumbs items={[
 *   { name: "Home", url: "https://example.com" },
 *   { name: "Blog", url: "https://example.com/blog" },
 *   { name: "Article Title", url: "https://example.com/blog/article" },
 * ]} />
 */

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-base-content/30">/</span>
              )}
              {index === items.length - 1 ? (
                <span className="text-base-content/60">{item.name}</span>
              ) : (
                <Link
                  href={item.url}
                  className="text-primary hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
