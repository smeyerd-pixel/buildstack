import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("check-ai-code-before-you-ship")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Ask for the plan before the code", text: "Before your agent edits anything, ask it to explain in plain English what it will change and why. Fix a bad plan now, not after 40 files changed." },
  { name: "Make it run the boring checks", text: "Ask the agent to run your project's typecheck, linter, tests and production build, and to show you the output. Red output means it is not done, whatever the agent says." },
  { name: "Prove it works in the real app", text: "Click through the feature yourself, or use Reticle so the agent drives your running app and returns a pass, fail or cannot-tell verdict with evidence." },
  { name: "Read the diff summary", text: "Ask for a list of every file changed and one sentence on each. Look hard at anything touching payments, logins, secrets, or deleting data." },
  { name: "Get a second pair of AI eyes", text: "Run an AI code review from a different tool or model than the one that wrote the code, for example GitHub Copilot code review, Devin Review or Cursor's review agent." },
  { name: "Check that you understand it", text: "Before you push to main, make sure you could explain the change. Sphinx automates this with a short quiz on every push to a protected branch." },
];
const faq = [
  { q: "Do I need to read every line my AI agent writes?", a: "No, but you need evidence it works and a rough understanding of what changed. Passing checks, a real click-through or a Reticle verdict, and a diff summary you understand cover most of the risk for small projects." },
  { q: "What is the cheapest way to check AI-written code?", a: "All of the steps in this checklist can be done for free: your project's own typecheck, lint, test and build commands, the free open-source Reticle SDK, and Sphinx (free and open source, though its quiz uses a model from your Claude Code or Codex plan or an API key)." },
  { q: "Why use a different AI to review the code?", a: "The model that wrote the code tends to agree with its own reasoning. A separate reviewer, ideally one that sees only the final change and not the chat that produced it, is more likely to spot what was missed." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to check AI-written code before you ship it", description: g.description, totalTime: "PT15M",
      tool: ["Reticle", "Sphinx"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["reticle", "sphinx"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to check AI-written code before you ship it</h1>
      <p className="text-lg text-gray-400">A vibe coder&apos;s checklist. Your agent says &quot;done.&quot; Here&apos;s how to know it actually is. About a 6-minute read. Updated October 21, 2026.</p>
      <p>AI coding agents like <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T> and <T s="openai-codex">Codex</T> write code faster than anyone can read it. The risk isn&apos;t that they write bad code every time. It&apos;s that they <b>sound</b> equally confident when the button works and when it silently does nothing. You don&apos;t need to become a senior engineer to catch that. You need a short routine you run every time.</p>

      <H2>The 6-step checklist</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2>Step 1: Ask for the plan first</H2>
      <p>Most agents have a plan mode, or you can just say it. Paste this before any big request:</p>
      <Code>{"Before you change anything, explain your plan in plain English:\nwhich files you'll touch, what you'll add or remove, and anything risky.\nWait for me to say go."}</Code>

      <H2>Step 2: Make it run the boring checks</H2>
      <p>Every real project has commands that catch mistakes automatically: a <b>typecheck</b> (finds code that doesn&apos;t fit together), a <b>linter</b> (finds sloppy patterns), <b>tests</b>, and a <b>build</b> (proves the app can actually be packaged for production). Look in your <code>package.json</code> scripts, or ask:</p>
      <Code>{"Run the typecheck, lint, tests and production build for this project.\nShow me the actual output. If anything fails, fix it and run them again."}</Code>
      <p>This is exactly what we do before every update to {SITE.name}: no push unless typecheck and build both pass.</p>

      <H2 id="reticle">Step 3: Prove it works in the real app (Reticle)</H2>
      <p>Passing checks don&apos;t prove the feature works. A page can render perfectly over a failed request. The low-tech fix is to click through it yourself. The new option is <T s="reticle">Reticle</T>, which was shown on Hacker News on October 20, 2026. It puts a small, development-only SDK in your web app so your agent can click through a flow and read what really happened underneath: the network request, the app&apos;s state, and the console. It answers with <b>pass</b>, <b>fail</b> or <b>cannot tell</b>, plus the file and line to fix. Only a definite yes counts as a pass.</p>
      <Code>{"npx @reticlehq/server init\n# restart your dev server and your coding agent, then ask it:\nVerify the sign-up flow with Reticle."}</Code>
      <p>It works with Claude Code, Cursor, Codex and other agents that support MCP, needs Node 20 or newer, and the SDK is left out of production builds. The SDK is Apache-2.0 and free; check <a className="underline" href="https://docs.reticle.sh" target="_blank" rel="noopener">its docs</a> for which frameworks are supported today. Flows you save can be replayed later without an AI model, so yesterday&apos;s fix can&apos;t quietly break last week&apos;s feature.</p>

      <H2>Step 4: Read the diff summary</H2>
      <Code>{"List every file you changed with one sentence on what changed in each.\nFlag anything touching payments, auth, secrets, or deleting data."}</Code>
      <p>You&apos;re not reviewing code line by line. You&apos;re checking the agent did what you asked and nothing else. A one-line copy change that touched 30 files deserves a question.</p>

      <H2>Step 5: Get a second pair of AI eyes</H2>
      <p>The model that wrote the code tends to agree with itself. Ask a <b>different</b> tool or model to review the change. Options in our directory include <T s="github-copilot">GitHub Copilot</T> code review on pull requests, <T s="devin">Devin</T> Review, and Cursor&apos;s review agent. Even pasting the diff into another model and asking &quot;what could break?&quot; helps.</p>

      <H2 id="sphinx">Step 6: Check that you understand it (Sphinx)</H2>
      <p><T s="sphinx">Sphinx</T> is a free, open-source (MIT) Git hook that pauses a push to <code>main</code> and asks you to predict what the change will do, for example what happens if a worker crashes halfway through a job. Get it wrong and it explains, then gives you a new scenario. The questions come from a separate reviewer model that only sees the committed change, using your Claude Code or Codex plan, OpenRouter, or another compatible endpoint.</p>
      <Code>{"npm install -g sphinx-understand\nsphinx install\ncd your-repo && sphinx init"}</Code>
      <p>Know before you install: it needs Node.js 22.19+ on macOS, Linux or WSL, it applies to pushes in every repo on your machine until you adjust it per repo, and the changed code is sent to the reviewer model you pick. Its own README calls it practice, not a security gate.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Plan first, then make the agent run typecheck, lint, tests and build.</li><li>Prove the feature works in the running app, by hand or with Reticle.</li><li>Skim the diff summary, get a second AI review, and make sure you understand the change (Sphinx can quiz you).</li></ul>
      <p className="text-sm text-gray-500">Picking an agent? See our <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, <Link className="underline" href="/compare">side-by-side comparisons</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
