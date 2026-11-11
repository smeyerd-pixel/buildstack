import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("make-ai-coding-agent-write-modern-web-code")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Give your agent up-to-date web knowledge", text: "Models learned from years of older code, so they reach for a JavaScript library or 50 lines of custom code where the browser now has a built-in feature. Install Google Chrome's free Modern Web Guidance skill in your project so Claude Code, Codex or Cursor looks up the current, expert-reviewed way before it writes front-end code." },
  { name: "Tell it which browsers you support", text: "Modern features are only useful if your visitors' browsers have them. Say so in your project instructions (AGENTS.md or CLAUDE.md), for example \"target Baseline widely available\", so the agent picks features that work everywhere and adds a light fallback when it uses something newer." },
  { name: "Scan the code you already have", text: "Most of the old patterns are already in your app. Run Modern Web Guidance's legacy-scan on your source folder to list outdated patterns, polyfills and dependencies you may no longer need, then ask your agent to modernize them one small change at a time." },
  { name: "Ask for the built-in feature by name", text: "When you know what you want, name the platform feature: a native dialog for modals, the popover attribute for menus and tooltips, view transitions for page changes, container queries for cards, passkeys for login. Agents follow a named feature far more reliably than \"make it nicer\"." },
  { name: "Check it in a real browser before you ship", text: "New code can look right and still break the keyboard, a screen reader or an older phone. Have your agent open the page and click through it (Mantis does this cheaply as text), try it yourself with only the keyboard, and run your normal typecheck and build." },
];
const faq = [
  { q: "What does \"outdated JavaScript\" mean if my app works?", a: "It works, but it is more code than you need. A hand-built modal with JavaScript often forgets focus handling and the Escape key, ships extra kilobytes and can be slower. The browser's built-in dialog does the same job with keyboard and screen-reader support included." },
  { q: "Is Modern Web Guidance free, and who makes it?", a: "Yes. It is open source (Apache-2.0) and run by the Google Chrome team, with Firefox, Microsoft Edge and MDN contributing. Version 1.0 shipped on November 10, 2026. Its install and search commands run with npx, so you need Node.js." },
  { q: "Will it fill up my agent's context window?", a: "It is designed not to. Instead of pasting 200 guides into every request, the skill has your agent search a small local index and pull in only the guide that matches the task." },
  { q: "Does it work with Cursor, Codex or Grok Build, not just Claude Code?", a: "Yes. The npx installer sets it up for your project, and Google says it is also in the plugin marketplaces of Claude Code, Codex, Cursor, Antigravity, Copilot, WebStorm, Kimi Code and Grok Build." },
  { q: "Do I still need to test the result?", a: "Yes. Guidance makes better code more likely, not guaranteed. Click through the page in a real browser, try it with the keyboard, and keep running your typecheck and build before every push." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to make your AI coding agent write modern web code instead of outdated JavaScript", description: g.description, totalTime: "PT15M",
      tool: ["Claude Code", "Cursor", "OpenAI Codex", "Modern Web Guidance", "Mantis"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["modern-web-guidance", "mantis", "recto", "reticle"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to stop your AI coding agent writing outdated JavaScript (and get faster, more accessible pages)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders. About a 5-minute read. Updated November 11, 2026.</p>
      <p>Ask <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T> or <T s="openai-codex">Codex</T> for a pop-up, a dropdown menu or a growing text box and it will usually write a pile of JavaScript, or install a library, the way people did around 2019. Today&apos;s browsers do much of that on their own, with less code and keyboard and screen-reader support built in. Your agent often knows the feature exists but doesn&apos;t reach for it. Here is how to fix that.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="modern-web-guidance">Step 1: Install Modern Web Guidance</H2>
      <p><T s="modern-web-guidance">Modern Web Guidance</T> is a free, open-source agent skill from Google Chrome, now backed by Firefox, Edge and MDN. It holds 200+ hand-checked guides on modern HTML, CSS and browser APIs, each with browser-support data. Run this in your project folder and follow the short setup wizard:</p>
      <Code>{"npx modern-web-guidance@latest install\n\n# already installed an earlier preview? update to 1.0:\nnpx modern-web-guidance@latest update"}</Code>
      <p>From then on, your agent searches the guides when it works on front-end code. You can search them yourself too, without installing anything:</p>
      <Code>{"npx modern-web-guidance@latest search \"animate a dialog modal backdrop\""}</Code>
      <p>In Chrome&apos;s own tests across 200 web tasks, agents passed 55% of checks on their own and 92% with the guidance. Treat that as the maker&apos;s number, but it matches what you&apos;ll notice: fewer libraries and fewer hand-rolled widgets.</p>

      <H2 id="legacy-scan">Step 3: Find the old patterns already in your app</H2>
      <p>Version 1.0 (November 10, 2026) added a scan that looks through your HTML, CSS, JavaScript and <code>package.json</code> for outdated patterns and unneeded polyfills. Run it, then ask your agent to work through the list:</p>
      <Code>{"npx modern-web-guidance@latest legacy-scan ./src\n\n# then, inside your agent:\n/modern-web-guidance Modernize the code in this directory"}</Code>
      <p>Do this on a fresh git branch, a few changes at a time, and run your build after each batch. The first release only checks a limited set of known patterns, so a clean scan doesn&apos;t mean every file is modern.</p>

      <H2>Step 4: Words worth using in your prompts</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li><b>&quot;Use a native &lt;dialog&gt;&quot;</b> for modals, so focus and the Escape key just work.</li>
        <li><b>&quot;Use the popover attribute&quot;</b> for menus, tooltips and pop-ups instead of a positioning library.</li>
        <li><b>&quot;Use view transitions&quot;</b> for smooth page or state changes.</li>
        <li><b>&quot;Use container queries&quot;</b> so cards adapt to the space they&apos;re in, not just the screen size.</li>
        <li><b>&quot;Support passkeys and browser autofill&quot;</b> on login and checkout forms.</li>
      </ul>
      <p>Prefer to design visually? <T s="recto">Recto</T> lets your agent build UI as real HTML on a canvas you can drag and edit, which pairs well with guidance on how that HTML should be written.</p>

      <H2 id="mantis">Step 5: Let your agent check the page in a browser</H2>
      <p>Before you ship, have the agent open the page and click through it. <T s="mantis">Mantis</T> is a free, open-source (MIT) MCP server that shows pages to your agent as short numbered text instead of screenshots, so a check costs fewer tokens. It hands CAPTCHAs, 2FA and payments back to you.</p>
      <Code>{"npx -y -p mantis-browser mantis install\nclaude mcp add mantis -- npx -y -p mantis-browser mantis-mcp\n\n# then ask your agent:\nOpen http://localhost:3000, open the sign-up dialog, close it with Escape,\nand tell me if focus went back to the button."}</Code>
      <p>Then do a 30-second check yourself: put the mouse away and use only Tab, Enter and Escape. For a full test of a flow, see our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link>, which covers <T s="reticle">Reticle</T>; for how to add MCP servers in general, see <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">adding MCP servers to Claude Code and Codex</Link>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Install Modern Web Guidance so your agent looks up today&apos;s browser features before it writes front-end code.</li><li>Say which browsers you support, scan your existing code, and name the built-in feature you want.</li><li>Check the result in a real browser and with the keyboard before you push.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>, <Link className="underline" href="/guides/write-a-spec-for-your-ai-coding-agent">write a spec your agent follows</Link>, <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
