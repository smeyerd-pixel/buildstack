import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("give-ai-agent-a-phone-safely")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Never hand over your daily-driver phone or main number", text: "Treat a phone an agent can control like a production server: if it can read SMS, it can read bank 2FA, reset passwords and approve payments. Use a spare phone, a cloud phone or a burner number. Keep banking apps, password managers and your primary SIM off that device." },
  { name: "Prefer a dedicated cloud or self-hosted session over your personal device", text: "Cloud phones (Phone Harness Cloud) and self-hosted Chrome (easi.run on your Linux box) keep the session off your pocket device, stay logged in between runs and let you watch or take over. Your personal phone is for you; the agent's phone is for the agent." },
  { name: "Take over yourself for logins, payments and anything irreversible", text: "Let the agent navigate to the login screen, then you type the password or approve 2FA. Same for buying, deleting, sending money or changing security settings. Tools like easi.run are built for live human takeover; use it." },
  { name: "Give the agent the smallest device and the shortest session it needs", text: "Start one temporary Android emulator for a single test, then stop it. Don't leave a fleet of logged-in phones running overnight unless you mean to. Revoke MCP access when you're done experimenting." },
  { name: "Gate risky tools and keep a kill switch", text: "If your agent can also call Gmail, Stripe or deploy tools, put those behind an approval layer or a short allowlist (see our OAuth guide). Know how to stop the phone session and revoke the MCP connector in one place." },
];
const faq = [
  { q: "Why would an agent need a phone at all?", a: "Plenty of apps have no usable web version: banking, ride-share, social, two-factor SMS, mobile-only admin panels. A phone harness lets Claude Code or Cursor tap, type and scroll those apps the way a person would, including reading verification codes so a workflow can finish without you." },
  { q: "Is Phone Harness free?", a: "The open-source harness that drives your own phone is MIT and free. Phone Harness Cloud Android starts free with $5 of credit, then 5¢ per phone-minute (Plus is $20/mo with 1,000 minutes). Real cloud iPhones are a flat monthly subscription. Check phone-harness.com/pricing for current rates." },
  { q: "What's the difference between a phone harness and a browser agent?", a: "A browser agent (Playwright, a cloud browser, or easi.run's self-hosted Chrome) drives websites. A phone harness drives real iOS/Android apps and the SMS inbox. Many builders use both: browser for the web product, phone for the mobile app and 2FA." },
  { q: "Is it safe to let an agent read my 2FA codes?", a: "Only on a device that has nothing valuable. If the same phone receives your bank codes and holds your main email, an agent with a confused prompt can take over those accounts. Use a dedicated number and device for agent workflows." },
  { q: "What if I only need a browser, not a phone?", a: "Use easi.run on a Linux server you control (free, AGPL, no usage fee) or a cloud coding environment like Aether that can open a real browser inside a watchable Devbox. Still take over for logins, and don't store production passwords in the agent session." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to give your AI agent a phone or browser without handing it your main accounts", description: g.description, totalTime: "PT20M",
      tool: ["Phone Harness", "easi.run", "Claude Code or Cursor"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["phone-harness", "easi-run", "aether", "mudroom"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to give your AI agent a phone (or browser) without handing it your main accounts</h1>
      <p className="text-lg text-gray-400">A plain-English safety routine for vibe coders. About a 5-minute read. Updated November 5, 2026.</p>
      <p>Agents that only edit files are useful. Agents that can tap a real phone or drive a logged-in browser can finish whole workflows: test your mobile app, grab a 2FA code, book a demo call. They can also empty a bank account if you point them at the wrong device. Here&apos;s the 5-step routine so <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T> or Codex get a phone or browser that is useful and contained.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="phone-harness">For real phones: Phone Harness (YC F26)</H2>
      <p><T s="phone-harness">Phone Harness</T> launched on Launch YC and X on November 4, 2026. It lets any MCP agent tap, type, scroll and read the screen on your own iPhone/Android or a cloud phone that stays on 24/7. New cloud Android accounts get $5 of credit. Connect it once:</p>
      <Code>{"# Claude Code\nclaude mcp add --transport http phone-harness https://mcp.phone-harness.com/mcp\n\n# Then ask your agent:\n# \"Start a temporary Android emulator, open Settings, and take a screenshot.\""}</Code>
      <p>Use a cloud phone or a spare device. Do not mirror the phone that holds your bank apps.</p>

      <H2 id="browser">For browsers you control: easi.run</H2>
      <p><T s="easi-run">easi.run</T> runs real Chrome on <i>your</i> Linux server. Agents drive it over MCP; you take over for login and 2FA; sessions stay in a vault only your password opens. No per-minute fee. On the server, paste:</p>
      <Code>{"Read https://easi.run/install.md and install easi.run on this server."}</Code>
      <p>Or, if you want the agent in a cloud Devbox you can watch (terminal, ports, screenshots on the PR), look at <T s="aether">Aether</T>: Claude Code or Codex on the subscription you already pay for, inside a Firecracker microVM.</p>

      <H2 id="dont">What not to do</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Don&apos;t point an agent at the phone that receives your primary SMS codes.</li>
        <li>Don&apos;t leave a logged-in cloud phone running with broad MCP access when you&apos;re done for the day.</li>
        <li>Don&apos;t combine phone control with send-email / pay / deploy tools in the same unsupervised session.</li>
      </ul>
      <p>For file-system safety while the agent codes, still use a <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox</Link>. For connecting Gmail or Slack the right way, use our <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">OAuth guide</Link>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Spare device or cloud/self-hosted session — never your main phone and number.</li><li>You take over for logins and irreversible actions; stop sessions when idle.</li><li>Keep phone/browser tools separate from unsupervised spend/send/deploy tools.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">connect apps with OAuth</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox your coding agent</Link>, and <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop agents deleting your database</Link>. More tools: <Link className="underline" href="/use-case/automation-agents">automation &amp; agents</Link> and <Link className="underline" href="/new">newest AI tools</Link>.</p>
    </article>
  );
}
