interface SchemaMarkupProps {
  type: "Organization" | "WebSite" | "Article";
  data?: any;
}

export function SchemaMarkup({ data = {} }: SchemaMarkupProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      type="application/ld+json"
    />
  );
}

interface BreadcrumbProps {
  items: Array<{
    name: string;
    url?: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      type="application/ld+json"
    />
  );
}

export function FAQ({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer,
      },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      type="application/ld+json"
    />
  );
}
