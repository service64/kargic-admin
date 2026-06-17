export type SeoPageEntry = {
  key: string;
  url: string;
};

/** Keep in sync with import-export `src/lib/seo-pages.ts`. */
export const SEO_PAGES: SeoPageEntry[] = [
  { key: "home", url: "/" },
  { key: "about", url: "/about" },
  { key: "contact", url: "/contact" },
  { key: "faq", url: "/faq" },
  { key: "help", url: "/help" },
  { key: "products", url: "/products" },
  { key: "categories", url: "/categories" },
  { key: "exporters", url: "/exporters" },
  { key: "verified-exporters", url: "/verified-exporters" },
  { key: "rfq", url: "/rfq" },
  { key: "verification", url: "/verification" },
  { key: "trade-guide", url: "/trade-guide" },
  { key: "success-stories", url: "/success-stories" },
  { key: "safe-trade-protocol", url: "/safe-trade-protocol" },
  { key: "export-blog", url: "/resources/export-blog" },
  { key: "resources-success-stories", url: "/resources/success-stories" },
  { key: "resources-safe-trade-protocol", url: "/resources/safe-trade-protocol" },
  { key: "resources-product-photography", url: "/resources/product-photography" },
  { key: "global-demand-list", url: "/resources/global-demand-list" },
  { key: "hs-code-index", url: "/resources/hs-code-index" },
  { key: "important-resources", url: "/resources/important-resources" },
  { key: "industry-deep-dives", url: "/resources/industry-deep-dives" },
  { key: "trade-fair-calendar", url: "/resources/trade-fair-calendar" },
  { key: "digital-business-card", url: "/tools/digital-business-card" },
  { key: "product-photography", url: "/tools/product-photography" },
  { key: "privacy-policy", url: "/privacy-policy" },
  { key: "terms-conditions", url: "/terms-conditions" },
  { key: "cookie-policy", url: "/cookie-policy" },
];

export const PUBLIC_SITE_URL =
  import.meta.env.VITE_PUBLIC_SITE_URL ?? "https://kargic.com";

export const PUBLIC_SITE_DEFAULT_LOCALE = "en";

export function getSeoPageByKey(key: string): SeoPageEntry | undefined {
  return SEO_PAGES.find((page) => page.key === key);
}

export function buildPublicPageUrl(path: string): string {
  const base = PUBLIC_SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/${PUBLIC_SITE_DEFAULT_LOCALE}`;
  return `${base}/${PUBLIC_SITE_DEFAULT_LOCALE}${path}`;
}
