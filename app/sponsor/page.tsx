import type { Metadata } from "next";
import { SITE } from "@/lib/config";
export const metadata: Metadata = { title: "Sponsor / Featured listings", description: `Feature your AI tool on ${SITE.name} in front of vibe coders and builders.` };
const plans = [
  { name: "Featured – 1 week", price: "$99", per: "/week", url: SITE.stripeFeaturedWeeklyUrl },
  { name: "Featured – 1 month", price: "$299", per: "/month", url: SITE.stripeFeaturedMonthlyUrl, best: true },
];
export default function Sponsor() {
  return (
    <div className="space-y-8 pt-6">
      <div><h1 className="text-4xl font-bold text-white">Get your AI tool in front of builders</h1>
      <p className="mt-2 max-w-2xl text-gray-400">Featured listings sit at the top of the home page and every relevant use-case page, with a highlighted card and a mention in the newsletter.</p></div>
      <div className="grid gap-4 md:grid-cols-2">{plans.map((p) => (
        <div key={p.name} className={`card space-y-3 p-8 ${p.best ? "border-violet-400/50" : ""}`}>
          <div className="text-gray-400">{p.name}{p.best && <span className="chip ml-2 text-violet-300">Best value</span>}</div>
          <div className="text-4xl font-bold text-white">{p.price}<span className="text-base text-gray-500">{p.per}</span></div>
          <ul className="space-y-1 text-sm text-gray-400"><li>✓ Top slot on home + category pages</li><li>✓ Featured badge & highlighted card</li><li>✓ Newsletter mention</li></ul>
          <a href={p.url || `mailto:${SITE.contactEmail}?subject=Featured listing`} className="btn">{p.url ? "Book now" : "Contact us to book"}</a>
        </div>))}</div>
    </div>
  );
}
