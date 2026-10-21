"use client";
import { useState } from "react";
export default function GuideGate({ pdf }: { pdf: string }) {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    try { const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json(); if (r.ok) setOk(true); else setMsg(j.message || "Something went wrong. Try again."); } catch { setMsg("Something went wrong. Try again."); }
    setBusy(false);
  }
  return (
    <div className="card border-violet-400/40">
      <h3 className="text-lg font-semibold text-white">📄 Get the free PDF version</h3>
      {ok ? (<div className="mt-2 space-y-2"><p className="text-sm text-cyan-300">You&apos;re in! Here&apos;s your guide:</p><a href={pdf} download className="btn">Download the PDF</a></div>) : (<>
        <p className="mb-3 text-sm text-gray-400">A printable copy of this guide. You&apos;ll also get our newsletter on new AI tools for builders. Unsubscribe anytime.</p>
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdomain.com" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 outline-none focus:border-violet-400" />
          <button disabled={busy} className="btn">{busy ? "..." : "Send me the PDF"}</button>
        </form>{msg && <p className="mt-2 text-sm text-rose-300">{msg}</p>}</>)}
    </div>
  );
}
