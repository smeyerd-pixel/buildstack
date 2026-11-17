import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("let-your-ai-agent-test-your-app-in-your-browser")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Pick the right kind of browser tool", text: "Use OpenCode Browse if you want the agent in your everyday Chrome, Edge or Brave with your logins. Use Turbo-Browser-MCP if you'd rather it had its own separate Chromium and fills lots of forms. On a Mac running several agents, agweb gives each one its own WebKit browser." },
  { name: "Connect it to your coding agent with one command", text: "Install the tool and add it as an MCP server, so Claude Code, Codex, Cursor or OpenCode can call it. OpenCode Browse's installer finds your agents and adds itself; Turbo-Browser-MCP is one claude mcp add line or one mcpServers entry. Restart the agent so it loads the new tools." },
  { name: "Fence it to your own sites", text: "Tell the agent which sites it may open (OpenCode Browse tabs can be limited with allowedOrigins or opened read-only) and use a test account, not your admin account. Turbo-Browser-MCP blocks Submit, Send, Pay and Publish buttons by default, so leave that on." },
  { name: "Do logins, 2FA codes and payments yourself", text: "Never paste a password into the chat. When the agent reaches a login, 2FA prompt, CAPTCHA or payment, it hands the tab to you: you type it, then click Continue (OpenCode Browse) or let wait_for_human pick up again (Turbo-Browser-MCP). The agent never sees what you typed in a password field." },
  { name: "Ask for a test report, not just \"it works\"", text: "Give the agent a short list of things to click through, and ask it to report each one as pass or fail with a screenshot and any console or network errors. Then fix the failures in a new prompt and run the same list again." },
];
const faq = [
  { q: "Isn't it dangerous to let an AI agent use my logged-in browser?", a: "It can be, which is why the steps matter. A web page or email the agent reads could try to give it instructions, so keep it on your own sites, use a test account, and never approve payments or deletes you didn't ask for. OpenCode Browse's own docs say its site limits are guardrails, not a wall: pages you don't want an agent to read, don't open in it." },
  { q: "Does the agent see my passwords?", a: "Not if you type them yourself during a handoff. OpenCode Browse's page snapshots leave out what's typed into form fields, it masks password and one-time-code values, and it redacts login headers and cookies in network captures, and the agent only uses tabs it opened or you lent it. It can still read the page itself and your account details on screen, so a test account is safest." },
  { q: "Which one should a beginner pick?", a: "OpenCode Browse: add the extension from the Chrome Web Store, run one install command and it sets up your agents for you. It's free, open source (MIT) and works with Claude Code, Codex, Cursor, OpenCode and 30+ other agents." },
  { q: "Why not just let Claude Code or Cursor use its built-in browser?", a: "Use it if it works for you. These tools add things beginners need: your real logins without sharing passwords, a clean hand-back for logins and 2FA, blocked Submit and Pay buttons, and fewer wasted steps (Turbo-Browser-MCP fills a whole form in one call), which also cuts your token bill." },
  { q: "My agent runs on a cloud VM, not my laptop. Can it still use my browser?", a: "Yes. OpenCode Browse can run next to the agent and let your browser connect to it across a private network such as Tailscale (its connection isn't encrypted on its own, so don't use the open internet). For command-line logins like gh, use lend so the commands run on your laptop with your approval." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to let your AI coding agent test your app in your real browser without giving it your password", description: g.description, totalTime: "PT20M",
      tool: ["OpenCode Browse", "Turbo-Browser-MCP", "agweb", "Claude Code, Codex, Cursor or OpenCode"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["opencode-browse", "turbo-browser-mcp", "agweb", "lend", "coral", "opencode"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to let your AI coding agent test your app in your real browser (logged in, without giving it your password)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders. About a 7-minute read. Updated November 17, 2026.</p>
      <p>Your agent says the new checkout page is &quot;done&quot;. But has anyone actually logged in and clicked through it? Most bugs in vibe-coded apps hide behind the login screen, exactly where an AI agent usually can&apos;t go, because it doesn&apos;t have your password (and shouldn&apos;t). This week brought new free tools that fix that: <T s="opencode-browse">OpenCode Browse</T> lets <T s="claude-code">Claude Code</T>, Codex, <T s="cursor">Cursor</T> or <T s="opencode">OpenCode</T> use your real browser and hand the tab back to you for logins, and <T s="turbo-browser-mcp">Turbo-Browser-MCP</T> gives the agent its own browser that fills whole forms in one step. Here is a safe routine.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="pick">Step 1: Pick your browser tool</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li><b><T s="opencode-browse">OpenCode Browse</T></b> (free, MIT, Mac/Windows/Linux): an extension for Chrome, Edge, Brave, Arc and other Chromium browsers. The agent works in your own browser, with your logins, in background tabs grouped out of your way. Best for most beginners.</li>
        <li><b><T s="turbo-browser-mcp">Turbo-Browser-MCP</T></b> (free, MIT, needs Node 20+): a Playwright-based MCP server that normally launches its own separate Chromium. Built to use fewer steps and tokens, with Submit/Pay buttons blocked by default. Best if your app has long forms or sign-up flows.</li>
        <li><b><T s="agweb">agweb</T></b> (free, Mac only, macOS 26+): a WebKit browser made for agents, with a dashboard of every agent&apos;s tabs. Best if you run several agents at once on a Mac.</li>
      </ul>

      <H2 id="connect">Step 2: Connect it to your agent</H2>
      <p><b>OpenCode Browse:</b> add the extension from the Chrome Web Store (it walks you through the rest), or run its installer in a terminal. The installer lists the agents it finds on your computer and adds itself to the ones you pick:</p>
      <Code>{"# Mac or Linux\ncurl -fsSL https://opencode.ai/browse/install | bash\n\n# Windows (PowerShell)\nirm https://opencode.ai/browse/install.ps1 | iex"}</Code>
      <p><b>Turbo-Browser-MCP:</b> one line for Claude Code, then check the setup:</p>
      <Code>{"claude mcp add turbo-browser -- npx -y turbo-browser-mcp\nnpx -y turbo-browser-mcp --doctor"}</Code>
      <p>For Cursor and other apps, add it to the <code>mcpServers</code> list in the app&apos;s MCP settings with the command <code>npx</code> and the arguments <code>-y turbo-browser-mcp</code>. New to this? Our <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">beginner&apos;s guide to adding MCP servers</Link> explains where those settings live. Restart your agent afterwards, then test it with a harmless request such as &quot;open news.ycombinator.com and tell me the top story&quot;.</p>

      <H2 id="fence">Step 3: Fence it to your own sites</H2>
      <p>An agent in your browser can, in principle, go anywhere you&apos;re signed in. Narrow that down:</p>
      <ul className="list-disc space-y-1 pl-6"><li><b>Name the sites.</b> Start your prompt with &quot;Only open pages on localhost:3000 and myapp.com.&quot; OpenCode Browse can enforce this per tab with its <code>allowedOrigins</code> option, and a <code>readOnly</code> option stops clicks and typing when you only want it to look.</li><li><b>Use a test account.</b> Sign up a separate account with fake data for the agent to use, not your admin or owner account, and test on a preview or local copy when you can.</li><li><b>Keep the safety catch on.</b> Turbo-Browser-MCP refuses to click Submit, Send, Publish, Pay or Confirm unless you allow it, so the agent can fill a form and leave the final click to you.</li><li><b>Close other sensitive tabs.</b> OpenCode Browse only uses tabs it opened or you lent it, but anything it opens it can read, including your bank or email if you send it there.</li></ul>

      <H2 id="logins">Step 4: You do the logins, 2FA and payments</H2>
      <p>Never paste a password, API key or 2FA code into the chat: it ends up in the transcript and goes to the AI provider. Instead, when the agent reaches a login page, it should hand over. In OpenCode Browse a small card appears on the tab; you log in, then click <b>Continue</b>. You can also hand it a tab you&apos;re already logged into with the toolbar button (the badge shows <b>ON</b>) and click again to take it back at any time. Turbo-Browser-MCP has a <code>wait_for_human</code> step that pauses until you&apos;re done, and agweb has <code>ask</code>. None of these solve CAPTCHAs for the agent; that&apos;s your job too.</p>

      <H2 id="report">Step 5: Ask for a test report</H2>
      <p>Copy this prompt and change the list to match your app:</p>
      <Code>{"Use the browser tool to test my app at http://localhost:3000.\nOnly open pages on localhost:3000. Use the test account; if you need to\nlog in, hand the tab to me and wait. Do not click Pay, Delete or Send.\n\nCheck each item and report PASS or FAIL with a screenshot:\n1. Sign up with a new email and land on the dashboard\n2. Create a project, rename it, refresh: is the new name still there?\n3. Open Settings and change the profile photo\n4. Log out and try to open /dashboard directly (should go to login)\n\nFor any FAIL, include console errors and failed network requests.\nDon't fix anything yet."}</Code>
      <p>Read the report, then ask the agent to fix the failures and run the same list again. Keeping the list in a file in your project (for example <code>test-checklist.md</code>) makes this a two-minute habit before every launch. It pairs well with our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link>, and item 4 is a quick version of the stranger test in our <Link className="underline" href="/guides/check-your-lovable-app-for-data-leaks">Lovable data-leak check</Link>.</p>

      <H2 id="beyond">Beyond the browser: CLI and API logins</H2>
      <p>The same rule (the agent uses your access, but never holds your secrets) works for other tools too:</p>
      <ul className="list-disc space-y-1 pl-6"><li><b>Command-line tools on your laptop:</b> if your agent runs on a cloud VM but needs <code>gh</code> or a cloud CLI that is logged in on your laptop, <T s="lend">lend</T> (free, open source) runs the command on your laptop after you approve it with Touch ID and sends back only the output. Its policy denies everything you don&apos;t list. Never approve a shell like <code>sh</code> or <code>bash</code> through it: that hands over everything.</li><li><b>Business apps (GitHub, Slack, Linear):</b> <T s="coral">Coral</T> (free, open source, self-hosted) sits between your agent and those apps, adds the credentials itself and asks you before anything that changes data. Our guide to <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">connecting your agent to Gmail, Slack and GitHub</Link> covers more options.</li><li><b>Phones and spare accounts:</b> see <Link className="underline" href="/guides/give-ai-agent-a-phone-safely">how to give your AI agent a phone (or browser) without your main accounts</Link>.</li></ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Give your agent a browser tool (OpenCode Browse is the easiest start) and connect it with one command.</li><li>Keep it on your own sites with a test account, and leave Submit/Pay blocked.</li><li>You type the passwords and 2FA codes; the agent clicks through a checklist and reports pass/fail with screenshots.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run your agent safely in a sandbox</Link>, <Link className="underline" href="/guides/cut-your-ai-agent-token-bill">cut your AI agent&apos;s token bill</Link>, and <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keep AI code behind a quality gate</Link>. Picking an agent? See <Link className="underline" href="/use-case/coding-agents">the best AI coding agents</Link>, <Link className="underline" href="/use-case/automation-agents">automation tools</Link> or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
