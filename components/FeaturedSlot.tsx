import Link from "next/link";
import ToolCard from "./ToolCard";
import { featured } from "@/lib/data";
export default function FeaturedSlot({ cat }: { cat?: string }) {
  const f = featured(cat);
  if (f.length) return <div className="grid gap-4 md:grid-cols-2">{f.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>;
  return (
    <Link href="/sponsor" className="card flex items-center justify-between border-dashed border-amber-400/40">
      <div><div className="text-xs uppercase tracking-wider text-amber-300">Featured slot available</div>
      <div className="text-white">Put your AI tool in front of builders here →</div></div>
      <span className="chip border-amber-400/50 text-amber-300">From $99/week</span>
    </Link>
  );
}
