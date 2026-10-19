"use client";
import { useState } from "react";
export default function Newsletter({
  title = "Get new AI tools in your inbox",
  blurb = "The best new releases for builders, daily. No spam.",
  cta = "Subscribe",
}: { title?: string; blurb?: string; cta?: string }) {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json(); setMsg(j.message); if (r.ok) setEmail(""); } catch { setMsg("Something went wrong. Try again."); }
    setBusy(false);
  }
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mb-3 text-sm text-gray-400">{blurb}</p>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 outline-none focus:border-violet-400" />
        <button disabled={busy} className="btn">{busy ? "..." : cta}</button>
      </form>
      {msg && <p className="mt-2 text-sm text-cyan-300">{msg}</p>}
    </div>
  );
}
