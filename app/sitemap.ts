import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/config";
import { allR32Slugs } from "@/lib/madness";
import { latestAddedDate } from "@/lib/newTools";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/new`, changeFrequency: "daily", priority: 0.9, lastModified: latestAddedDate() },
    { url: `${SITE.url}/sponsor` },
    { url: `${SITE.url}/guides` },
    { url: `${SITE.url}/guides/use-a-github-repo`, lastModified: "2026-10-16", priority: 0.8 },
    { url: `${SITE.url}/madness`, changeFrequency: "daily", priority: 0.9, lastModified: "2026-10-19" },
    ...allR32Slugs().map((s) => ({ url: `${SITE.url}/madness/${s}`, changeFrequency: "daily" as const, priority: 0.6, lastModified: "2026-10-19" })),
    { url: `${SITE.url}/top100`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/compare`, changeFrequency: "weekly", priority: 0.8, lastModified: comparisons.map((c) => c.updated).sort().at(-1) },
    ...categories.map((c) => ({ url: `${SITE.url}/use-case/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...comparisons.map((c) => ({ url: `${SITE.url}/compare/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7, lastModified: c.updated })),
    ...tools.map((t) => ({ url: `${SITE.url}/tools/${t.slug}`, lastModified: t.added })),
  ];
}
