import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("check-if-ai-can-read-your-website")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "See what an AI crawler actually gets", text: "Paste your homepage into Bifura's free Agent readiness score (no account), or run curl -s https://your-site.com | grep -i \"your headline\". If your headline isn't in the raw HTML, your words only appear after JavaScript runs, and many AI crawlers never run it." },
  { name: "Make your key pages load without JavaScript", text: "Ask your coding agent to pre-render (static-generate) the homepage, pricing and about pages so the text is in the HTML the server sends. Next.js and Astro do this out of the box; for a React + Vite app the agent can add pre-rendering." },
  { name: "Check robots.txt isn't blocking the AI bots you want", text: "Open your-site.com/robots.txt. Look for Disallow rules for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot or Google-Extended, and keep the bots you want to read you." },
  { name: "Put the important facts in plain text", text: "One clear H1, a title and meta description, prices written as text (not inside images), JSON-LD structured data for your organization and product, a sitemap.xml and, optionally, an llms.txt file." },
  { name: "Scan again and keep an eye on it", text: "Re-run the Bifura score after your agent's changes are live. Rescan after big redesigns, or use a paid plan for weekly score-drop alerts." },
];
const faq = [
  { q: "Why does this matter for a small site?", a: "More people now ask ChatGPT, Claude, Perplexity or Gemini \"what's a good tool for X?\" instead of clicking through Google results. If an AI crawler can't read what your product does and what it costs, it can't recommend you or describe you correctly. Bifura cites SparkToro data that 68% of US Google searches ended without a click from January to April 2026." },
  { q: "My site was built with Lovable or Bolt. Is it affected?", a: "Possibly. Apps from React + Vite builders often render the whole page with JavaScript in the browser, so the HTML the server sends is mostly an empty shell. Run the curl check in step 1 on your live URL: if your headline shows up, you're fine; if not, ask your agent to pre-render your public pages (or move the marketing pages to a static site) and leave the logged-in app as it is." },
  { q: "Should I block AI bots instead?", a: "It's your choice, and robots.txt lets you choose per bot. OpenAI, for example, uses GPTBot for training and OAI-SearchBot for ChatGPT search, so you can allow one and block the other. Google-Extended controls whether Google uses your content for Gemini training and doesn't change your normal Google Search ranking. Blocking every bot means AI assistants can't read your pages when people ask about you." },
  { q: "Does llms.txt really help?", a: "It's a proposed standard (llmstxt.org): a plain Markdown file at /llms.txt that summarizes your site and links your key pages for AI tools. It's cheap to add and some AI tools and agents read it, but not every crawler uses it, so treat it as a bonus on top of readable HTML, not a replacement." },
  { q: "What does this cost?", a: "The Bifura score is free with no account. Its full one-off report is $14 (launch price, regularly $19), and monitoring plans start at $14.99 a month at launch prices locked in until December 3, 2026. The fixes themselves are a normal job for your coding agent." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
const prompt = `Make our public pages easy for AI assistants and search crawlers to read. Do not change how the app looks or works for logged-in users.
1. For the homepage, pricing and about pages, make sure the main text is in the HTML the server sends (pre-render or static-generate them). Prove it with: curl -s <live URL> | grep -i "<our headline>"
2. Each page gets exactly one <h1>, a unique <title> and a meta description.
3. Write prices and plan names as text, not images.
4. Add JSON-LD structured data: Organization on the homepage, and Product or SoftwareApplication with our prices on the pricing page.
5. Make sure /sitemap.xml lists every public page and robots.txt links to it. Do not add Disallow rules for AI bots without asking me.
6. Add /llms.txt: a short Markdown summary of what we do, who it's for and links to our key pages.
Show me the diff and the curl output before you deploy.`;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to check if ChatGPT and AI agents can read your website, and fix it", description: g.description, totalTime: "PT15M",
      tool: ["Bifura", "curl", "Claude Code", "Pax"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["bifura", "pax", "icons8-hub", "extraorbital", "claude-code", "lovable"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Can ChatGPT and AI agents read your website? A 15-minute check (and fix) for AI-built sites</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders and founders. About a 6-minute read. Updated November 27, 2026.</p>
      <p>When someone asks ChatGPT, Claude or Perplexity &quot;what&apos;s a good tool for…?&quot;, the answer comes from what those AIs could read about you. A site that looks great in your browser can look almost empty to an AI crawler, especially if your app builder draws everything with JavaScript. Here&apos;s how to check in a minute with the free <T s="bifura">Bifura</T> score (launched on Product Hunt on November 26, 2026) or one terminal command, and a copy-paste prompt so your coding agent fixes what it finds.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="check">Step 1: See your site the way an AI crawler does</H2>
      <p>The easy way: go to <T s="bifura">Bifura</T>, paste your homepage URL and get the free Agent readiness score, usually in under a minute and with no account. It shows what a person sees next to what an AI crawler gets: the HTML without JavaScript, how much of your text is visible without it, your structured data and how a model reads the page.</p>
      <p>The do-it-yourself way: open a terminal (Terminal on Mac, PowerShell on Windows) and fetch the raw HTML, the way most crawlers do:</p>
      <Code>{"curl -s https://your-site.com | grep -i \"your main headline\"   # found = good\ncurl -s https://your-site.com | grep -o \"<h1\" | wc -l          # should be 1\ncurl -s https://your-site.com/robots.txt                        # step 3\ncurl -s -o /dev/null -w \"%{http_code}\\n\" https://your-site.com/sitemap.xml   # 200 = you have one"}</Code>
      <p>On Windows, <code>grep</code> and <code>wc</code> may be missing: run the first part (<code>curl -s https://your-site.com</code>) and search the output for your headline instead. If the output is mostly <code>&lt;script&gt;</code> tags and an empty <code>&lt;div id=&quot;root&quot;&gt;</code>, your words only appear after JavaScript runs.</p>

      <H2 id="prerender">Step 2: Make your key pages load without JavaScript</H2>
      <p>You don&apos;t need to rebuild your app. Only the public pages people (and AIs) should understand need to be pre-rendered: the homepage, pricing, about and any docs or blog. Frameworks like Next.js and Astro already send finished HTML. Apps from React + Vite builders such as <T s="lovable">Lovable</T> often don&apos;t, so ask your agent to add pre-rendering for those routes, or to put the marketing pages on a small static site and keep the logged-in app as it is. Then repeat the curl check on the live URL.</p>

      <H2 id="robots">Step 3: Check you aren&apos;t blocking the AI bots you want</H2>
      <p>Your <code>robots.txt</code> file tells bots what they may read. Some templates and hosts block AI bots by default, and some site owners block them on purpose. Decide bot by bot:</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">Bot name in robots.txt</th><th className="py-2">Whose it is and what it&apos;s for</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4"><code>OAI-SearchBot</code></td><td className="py-2">OpenAI: finds pages to show in ChatGPT search answers</td></tr>
        <tr><td className="py-2 pr-4"><code>GPTBot</code></td><td className="py-2">OpenAI: collects pages for training its models</td></tr>
        <tr><td className="py-2 pr-4"><code>ClaudeBot</code></td><td className="py-2">Anthropic: crawler for Claude</td></tr>
        <tr><td className="py-2 pr-4"><code>PerplexityBot</code></td><td className="py-2">Perplexity: finds pages for its answers</td></tr>
        <tr><td className="py-2 pr-4"><code>Google-Extended</code></td><td className="py-2">Google: controls use of your pages for Gemini training; doesn&apos;t affect normal Google Search</td></tr>
      </tbody></table></div>
      <p>If you see <code>User-agent: GPTBot</code> followed by <code>Disallow: /</code>, that bot is blocked. Delete the lines for bots you want to let in, and make sure robots.txt has a <code>Sitemap: https://your-site.com/sitemap.xml</code> line.</p>

      <H2 id="facts">Step 4: Put the important facts in plain text (copy-paste prompt)</H2>
      <p>AI tools get your product wrong most often when the key facts are hidden: the price is in an image, there are three H1s, or nothing says who the product is for. Paste this into <T s="claude-code">Claude Code</T>, Cursor or <T s="pax">Pax</T> in your project:</p>
      <Code>{prompt}</Code>
      <p>Review the diff before it ships, and keep the line about not adding bot blocks: an agent &quot;tidying up&quot; robots.txt can quietly hide you from the AIs you want. BuildStack does this itself: it pre-renders every page and publishes a <a className="underline" href="/llms.txt">/llms.txt</a> and a <a className="underline" href="/sitemap.xml">/sitemap.xml</a>.</p>

      <H2 id="rescan">Step 5: Scan again, then keep an eye on it</H2>
      <p>Once the changes are live, run the Bifura score again and compare. Its $14 one-off report adds prioritized tips, a 30/60/90-day roadmap and a basic agent simulator. Paid plans add weekly or daily monitoring with score-drop alerts, which AI bots visit your site and AI visibility tracking, which asks an OpenAI model and a Google model your prompts and counts how often your brand is named. Those models answer without live web search, so tracking shows what they already know about you; a fix you make today can take a while to show up there.</p>

      <H2 id="extras">Three more launches from this week</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>A model-agnostic agent to do the fixes:</b> <T s="pax">Pax</T> is Pydantic&apos;s new terminal coding agent (beta). Install with <code>uv tool install --compile-bytecode pydantic-ai-pax</code> and sign in with a ChatGPT or GitHub Copilot subscription or an API key. It runs commands and edits files as you with no approval step unless you add one, so use it in a project you trust.</li>
        <li><b>Many agents, one inbox for decisions:</b> <T s="icons8-hub">Hub</T> by Icons8 (#1 on Product Hunt on November 26, 2026) coordinates many Claude Code or Codex sessions from your browser or Telegram and only brings you the decisions. Free and open source; experimental, and its sessions run without permission prompts.</li>
        <li><b>A backend in one command:</b> <T s="extraorbital">ExtraOrbital</T> provisions databases, storage, auth and an AI gateway with <code>npx extraorbital provision .</code> and writes the credentials to your .env. Free to start with no card; see our <Link className="underline" href="/guides/let-your-ai-agent-set-up-your-app-backend">backend setup guide</Link> for keeping control.</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Check what an AI crawler sees with the free Bifura score or one curl command.</li><li>Pre-render your public pages and put prices and key facts in plain text with structured data.</li><li>Only block the AI bots you mean to block, and rescan after every redesign.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/check-your-lovable-app-for-data-leaks">check your Lovable app for data leaks</Link>, <Link className="underline" href="/guides/make-a-launch-video-with-your-ai-coding-agent">make a launch video with your agent</Link>, <Link className="underline" href="/guides/make-ai-coding-agent-write-modern-web-code">get modern, accessible web code</Link>, <Link className="underline" href="/guides/write-a-spec-for-your-ai-coding-agent">write a spec your agent follows</Link>, <Link className="underline" href="/use-case/research">best AI search tools</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
