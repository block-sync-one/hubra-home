import "server-only";

import { siteConfig } from "@/config/site";

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hubra",
  "alternateName": "Hubra App",
  "description":
    "Your Solana all-in-one portal to the decentralized world. Track tokens, Earn yields, DeFi protocols, and market analytics with CEX-grade experience.",
  "url": siteConfig.domain,
  "logo": `/logo.png`,
  "foundingDate": "2021",
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Solana blockchain",
    "Solana validators",
    "Solana staking",
    "DeFi protocols",
    "DeFi yield farming",
    "Earning crypto",
    "Portfolio management",
    "Wallet portfolio",
    "Cryptocurrency analytics",
    "Token tracking",
    "Market data",
    "Trading analytics",
    "Blockchain technology",
    "Validator performance",
    "Liquid staking",
  ],
  "sameAs": ["https://twitter.com/hubraApp"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "url": siteConfig.domain,
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1000+",
  },
} as const;

export const ORGANIZATION_JSON_LD_STRING = JSON.stringify(ORGANIZATION_JSON_LD);

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hubra",
    "description":
      "Your Solana all-in-one portal to the decentralized world. Track tokens, Earn yields, DeFi protocols, and market analytics with CEX-grade experience.",
    "url": siteConfig.domain,
    "about": {
      "@type": "Blockchain",
      "name": "Solana",
      "description": "Solana blockchain ecosystem including validators, staking, DeFi protocols, and token analytics",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.domain}/tokens`,
      },
    },
  };
}

export const WEBSITE_JSON_LD_STRING = JSON.stringify(getWebsiteJsonLd());

export const TOKEN_ANALYTICS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Token Analytics",
  "description": "Cryptocurrency token analytics and trading data",
  "provider": {
    "@type": "Organization",
    "name": "Hubra",
    "url": siteConfig.domain,
  },
  "category": "Cryptocurrency",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
} as const;

export const TOKEN_ANALYTICS_JSON_LD_STRING = JSON.stringify(TOKEN_ANALYTICS_JSON_LD);

const breadcrumbCache = new Map<string, string>();

export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): object {
  const cacheKey = items.map((item) => item.url).join("|");

  if (breadcrumbCache.has(cacheKey)) {
    return JSON.parse(breadcrumbCache.get(cacheKey)!);
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  const stringified = JSON.stringify(breadcrumb);

  breadcrumbCache.set(cacheKey, stringified);

  return breadcrumb;
}

export function getBreadcrumbJsonLdString(items: Array<{ name: string; url: string }>): string {
  const cacheKey = items.map((item) => item.url).join("|");

  if (breadcrumbCache.has(cacheKey)) {
    return breadcrumbCache.get(cacheKey)!;
  }

  const breadcrumb = getBreadcrumbJsonLd(items);
  const stringified = JSON.stringify(breadcrumb);

  breadcrumbCache.set(cacheKey, stringified);

  return stringified;
}

export const COMMON_BREADCRUMBS = {
  home: getBreadcrumbJsonLdString([{ name: "Home", url: siteConfig.domain }]),
  tokens: getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "Tokens", url: `${siteConfig.domain}/tokens` },
  ]),
  defi: getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "DeFi", url: `${siteConfig.domain}/defi` },
  ]),
  blog: getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "Blog", url: `${siteConfig.domain}/blog` },
  ]),
  stats: getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "Stats", url: `${siteConfig.domain}/stats` },
  ]),
} as const;

export function getCollectionPageJsonLd(
  name: string,
  description: string,
  numberOfItems: number,
  items?: Array<{ name: string; url: string }>
) {
  const collection: any = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    numberOfItems,
  };

  if (items && items.length > 0) {
    collection.mainEntity = {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": item.name,
          "url": item.url,
        },
      })),
    };
  }

  return collection;
}

export function getWebPageJsonLd(name: string, description: string, url: string, breadcrumbItems?: Array<{ name: string; url: string }>) {
  const webpage: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    "isPartOf": {
      "@type": "WebSite",
      "name": siteConfig.name,
      "url": siteConfig.domain,
    },
  };

  if (breadcrumbItems && breadcrumbItems.length > 0) {
    webpage.breadcrumb = getBreadcrumbJsonLd(breadcrumbItems);
  }

  return webpage;
}

export function getFinancialProductJsonLd(token: {
  name: string;
  symbol: string;
  price: number;
  marketCap?: number;
  volume24h?: number;
  priceChange24h?: number;
  holders?: number;
  logoURI?: string;
  description?: string;
  url: string;
}) {
  const enhancedDescription =
    token.description ||
    `${token.name} (${token.symbol}) is a cryptocurrency token on the Solana blockchain. Track real-time price, market capitalization, trading volume, price changes, holder count, and comprehensive trading analytics.`;

  const product: any = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": token.name,
    "alternateName": token.symbol,
    "description": enhancedDescription,
    "image": token.logoURI || "/image/token.svg",
    "brand": {
      "@type": "Brand",
      "name": "Solana",
      "description": "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
    },
    "category": "Cryptocurrency",
    "about": {
      "@type": "Blockchain",
      "name": "Solana",
      "description": "Solana blockchain ecosystem",
    },
    "offers": {
      "@type": "Offer",
      "price": token.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": token.url,
      "priceValidUntil": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  };

  const additionalProperties = [];

  if (token.symbol) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Symbol",
      "value": token.symbol,
    });
  }
  if (token.marketCap !== undefined) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Market Cap",
      "value": token.marketCap,
    });
  }
  if (token.volume24h !== undefined) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "24h Volume",
      "value": token.volume24h,
    });
  }
  if (token.priceChange24h !== undefined) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "24h Change",
      "value": `${token.priceChange24h.toFixed(2)}%`,
    });
  }
  if (token.holders !== undefined) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Holders",
      "value": token.holders,
    });
  }

  if (additionalProperties.length > 0) {
    product.additionalProperty = additionalProperties;
  }

  return product;
}

export function getFAQPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function getEnhancedArticleJsonLd(article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  publisherName?: string;
  publisherLogo?: string;
  keywords?: string[];
  articleSection?: string;
  url: string;
  wordCount?: number;
  inLanguage?: string;
  about?: Array<{ "@type": string; "name": string }>;
  mentions?: Array<{ "@type": string; "name": string }>;
}) {
  const articleJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.author || "Hubra Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": article.publisherName || siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": article.publisherLogo || `${siteConfig.domain}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url,
    },
    "inLanguage": article.inLanguage || "en-US",
    "citation": article.url,
  };

  if (article.image) {
    articleJsonLd.image = {
      "@type": "ImageObject",
      "url": article.image,
      "width": 1200,
      "height": 630,
    };
  }

  if (article.keywords && article.keywords.length > 0) {
    articleJsonLd.keywords = Array.isArray(article.keywords) ? article.keywords.join(", ") : article.keywords;
  }

  if (article.articleSection) {
    articleJsonLd.articleSection = article.articleSection;
  }

  if (article.wordCount) {
    articleJsonLd.wordCount = article.wordCount;
  }

  if (article.about && article.about.length > 0) {
    articleJsonLd.about = article.about;
  }

  if (article.mentions && article.mentions.length > 0) {
    articleJsonLd.mentions = article.mentions;
  }

  return articleJsonLd;
}

export function getDatasetJsonLd(dataset: {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  creator?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  license?: string;
  distribution?: Array<{
    contentType: string;
    encodingFormat: string;
    url: string;
  }>;
}) {
  const datasetJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": dataset.name,
    "description": dataset.description,
    "url": dataset.url,
  };

  if (dataset.keywords && dataset.keywords.length > 0) {
    datasetJsonLd.keywords = dataset.keywords.join(", ");
  }

  if (dataset.creator) {
    datasetJsonLd.creator = {
      "@type": "Organization",
      "name": dataset.creator.name,
      "url": dataset.creator.url || siteConfig.domain,
    };
  }

  if (dataset.datePublished) {
    datasetJsonLd.datePublished = dataset.datePublished;
  }

  if (dataset.dateModified) {
    datasetJsonLd.dateModified = dataset.dateModified;
  }

  if (dataset.license) {
    datasetJsonLd.license = dataset.license;
  }

  if (dataset.distribution && dataset.distribution.length > 0) {
    datasetJsonLd.distribution = dataset.distribution.map((dist) => ({
      "@type": "DataDownload",
      "contentType": dist.contentType,
      "encodingFormat": dist.encodingFormat,
      "contentUrl": dist.url,
    }));
  }

  return datasetJsonLd;
}
