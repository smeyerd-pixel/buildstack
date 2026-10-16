"use client";
import { useMemo, useState } from "react";
import ToolCard from "./ToolCard";
import type { Tool } from "@/data/tools";
import type { Category } from "@/data/categories";
export default function Search({ tools, categories }: { tools: Tool[]; categories: Category[] }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return tools.filter((t) => (!cat || t.categories.includes(cat)) && (!s || [t.name, t.verdict, t.pricing, ...t.categories.map((c) => categories.find((x) => x.slug === c)?.name + " " + categories.find((x) => x.slug === c)?.description)].join(" ").toLowerCase().includes(s)));
  }, [q, cat, tools, categories]);
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What are you building? e.g. mobile app, voice agent, landing page" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg outline-none focus:border-violet-400" />
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setCat("")} className={`chip ${!cat ? "border-violet-400 text-white" : ""}`}>All</button>
        {categories.map((c) => <button key={c.slug} onClick={() => setCat(c.slug)} className={`chip ${cat === c.slug ? "border-violet-400 text-white" : ""}`}>{c.name}</button>)}
      </div>
      <p className="mt-4 text-sm text-gray-500">{list.length} tools</p>
      <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
    </div>
  );
}
