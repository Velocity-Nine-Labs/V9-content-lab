import Link from "next/link";

/**
 * Related Pages Component for Internal Linking
 * Displays related content to improve site navigation and SEO
 * 
 * Usage:
 * <RelatedPages
 *   pages={[
 *     { title: "Related Article", description: "Description...", url: "/blog/article" },
 *   ]}
 *   title="Related Articles"
 * />
 */

interface RelatedPage {
  title: string;
  description: string;
  url: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
  className?: string;
}

export default function RelatedPages({
  pages,
  title = "Related Articles",
  className = "",
}: RelatedPagesProps) {
  if (pages.length === 0) return null;

  return (
    <aside className={className}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      
      <div className="space-y-4">
        {pages.map((page) => (
          <Link
            key={page.url}
            href={page.url}
            className="block p-4 border border-base-200 rounded-lg hover:border-primary transition-colors"
          >
            <h4 className="font-medium text-primary">{page.title}</h4>
            <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
