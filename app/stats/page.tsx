import { title } from "@/components/primitives";

export default function DocsPage() {
  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hubra.app",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Stats",
        "item": "https://hubra.app/stats",
      },
    ],
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />
      <div>
        <h1 className={title()}>Docs</h1>
      </div>
    </>
  );
}
