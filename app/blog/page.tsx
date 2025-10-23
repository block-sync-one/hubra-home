import { title } from "@/components/primitives";

export default function BlogPage() {
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
        "name": "Blog",
        "item": "https://hubra.app/blog",
      },
    ],
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />
      <div>
        <h1 className={title()}>Blog</h1>
      </div>
    </>
  );
}
