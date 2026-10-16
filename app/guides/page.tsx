import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { SITE } from "@/lib/config";
export const metadata: Metadata = { title: "Guides for AI builders", description: "Plain-English guides for vibe coders and new builders.", alternates: { canonical: `${SITE.url}/guides` } };
export default function Guides() {
  return (<div className="space-y-6 pt-6"><h1 className="text-4xl font-bold text-white">Guides</h1><p className="text-gray-400">Plain-English guides for people building with AI.</p>
    <div className="grid gap-4">{guides.map((g) => (<Link key={g.slug} href={`/guides/${g.slug}`} className="card"><div className="font-semibold text-white">{g.title}</div><div className="text-sm text-gray-400">{g.description}</div></Link>))}</div></div>);
}
