import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/config";
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "Find the right AI tool for what you're building: coding agents, app builders, design, video, voice, image, research, automation, LLM APIs and deployment.",
  openGraph: { siteName: SITE.name, type: "website" }, twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)]" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-xl font-bold text-white">Build<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Stack</span></Link>
        <nav className="flex gap-5 text-sm text-gray-400"><Link href="/top100" className="hover:text-white">Top 100</Link><Link href="/#categories" className="hover:text-white">Use cases</Link><Link href="/compare" className="hover:text-white">Compare</Link><Link href="/guides" className="hover:text-white">Guides</Link><Link href="/sponsor" className="hover:text-white">Sponsor</Link></nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-20">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} {SITE.name} · <Link href="/sponsor">Advertise</Link> · <a href="/llms.txt">llms.txt</a></footer>
    <Analytics /></body></html>
  );
}
