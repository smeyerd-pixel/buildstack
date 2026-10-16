import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/data";
import { SITE } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/sponsor` },
    ...categories.map((c) => ({ url: `${SITE.url}/use-case/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${SITE.url}/tools/${t.slug}`, lastModified: t.added })),
  ];
}
