import { NextResponse } from "next/server";
export async function POST(req: Request) {
  let email = "";
  try { email = String((await req.json()).email || "").trim(); } catch {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  const key = process.env.RESEND_API_KEY?.trim(); const rawAud = (process.env.RESEND_AUDIENCE_ID || "").replace(/["'\s]/g, ""); const aud = /^[0-9a-f-]{36}$/i.test(rawAud) ? rawAud : "d06c0a5d-79db-4909-bb0f-198bbf38ae90";
  if (!key || !aud) return NextResponse.json({ message: "Thanks! The newsletter is coming soon. We'll be in touch." });
  const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, unsubscribed: false }) });
  if (!r.ok) { const detail = await r.text(); console.error("resend", r.status, detail); return NextResponse.json({ message: "Couldn't subscribe right now. Please try again." }, { status: 502 }); }
  return NextResponse.json({ message: "You're in! Watch your inbox." });
}
