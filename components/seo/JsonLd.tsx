/**
 * JSON-LD Structured Data Component
 * Renders schema.org structured data for SEO
 * 
 * Usage:
 * <JsonLd data={generateArticleSchema({ ... })} />
 * <JsonLd data={[schema1, schema2]} /> // Multiple schemas
 */

interface JsonLdProps {
  data: object | object[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
