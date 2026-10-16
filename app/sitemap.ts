import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/sponsor` },
    { url: `${SITE.url}/top100`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({ url: `${SITE.url}/use-case/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...comparisons.map((c) => ({ url: `${SITE.url}/compare/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7, lastModified: "2026-10-16" })),
    ...tools.map((t) => ({ url: `${SITE.url}/tools/${t.slug}`, lastModified: t.added })),
  ];
}
