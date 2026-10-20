import { toolsByDate } from "@/lib/newTools";
import { getCategory } from "@/data/categories";
import { SITE } from "@/lib/config";
export const dynamic = "force-static";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function GET() {
  const items = toolsByDate().flatMap((g) => g.tools.map((t) => ({ t, date: g.date }))).slice(0, 50);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(`${SITE.name}: new AI tools`)}</title>
<link>${SITE.url}/new</link>
<atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
<description>${esc(`New AI tools for builders and vibe coders, added daily to ${SITE.name}.`)}</description>
<language>en</language>
${items.map(({ t, date }) => `<item>
<title>${esc(t.name)}</title>
<link>${SITE.url}/tools/${t.slug}</link>
<guid isPermaLink="true">${SITE.url}/tools/${t.slug}</guid>
<pubDate>${new Date(`${date}T12:00:00Z`).toUTCString()}</pubDate>
${t.categories.map((c) => `<category>${esc(getCategory(c)?.name ?? c)}</category>`).join("")}
<description>${esc(`${t.verdict} Pricing: ${t.pricing}.`)}</description>
</item>`).join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
