import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("pick-an-ai-model-for-your-coding-agent")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Start with what your plan already includes", text: "Before paying for anything new, use the models you already have. ChatGPT Plus, Pro, Enterprise and Edu users get GPT-6.2 Sol and Astra in Codex. GitHub Copilot Free includes MAI Code 2 Flash; Copilot Pro and above add MAI Code 2 and GPT-6.2 in the model picker." },
  { name: "Pick a cheap everyday default", text: "Most vibe coding is small: explain this, fix that bug, add a button. Use a mid-priced model as your default: GPT-6.2 Sol in Codex, or MAI Code 2 in Copilot. Drop to MAI Code 2 Flash for quick explanations and one-line fixes." },
  { name: "Switch to a frontier model only for hard jobs", text: "For a big refactor, a tricky bug you've already failed to fix twice, or a polished frontend, switch to GPT-6.2 Astra for that task, then switch back. Its API price is four times Sol's, and OpenAI's own coding benchmark puts Sol within 0.5 points of Astra." },
  { name: "Paying per token? Compare cost per task, not price per token", text: "A cheaper model that needs three tries costs more than a pricier one that gets it right once, and the agent (harness) matters too. Try your real task on two models and compare the bill. For a big codebase on a budget, Qwen4-Max offers a 1-million-token context at $1.50/$4.50 per million tokens; Agav is a model-agnostic terminal agent built to spend fewer tokens." },
  { name: "Want no bill at all? Run a model on your own machine", text: "If you have a high-memory laptop (around 48 GB), Edge0-145B is a free open-weight coding model that runs offline, so there's no per-token cost and your code never leaves your computer. It takes more setup and independent results are still to come, so keep a cloud model handy for the hard jobs." },
];
const faq = [
  { q: "What's the difference between a model and an agent?", a: "The model (GPT-6.2 Sol, MAI Code 2, Qwen4-Max) is the brain that writes the code. The agent or harness (Codex, Copilot, Claude Code, Cursor, Agav) is the app that gives the model your files, runs commands and shows you the changes. Most agents let you swap the model, and the same model can cost very different amounts in different agents." },
  { q: "Which model is best for a total beginner?", a: "The one already in the tool you use. If you pay for ChatGPT, use Codex with GPT-6.2 Sol. If you use VS Code with GitHub Copilot, pick MAI Code 2 (or MAI Code 2 Flash on the free plan). Only switch to a bigger model when the default gets stuck." },
  { q: "Are the benchmark numbers in announcements trustworthy?", a: "Treat them as the maker's claims. Each company picks the tests and settings, and results vary with your project. The honest test is your own: give two models the same real task and compare whether it works, how many tries it took, and what it cost." },
  { q: "Will switching models mid-project break anything?", a: "No. Your code lives in your files and git, not in the model. Commit before you switch, start a fresh session with a short summary of the task, and carry on. Our guide to switching agents without losing work shows the routine." },
  { q: "How do I stop a pay-per-token model from running up a huge bill?", a: "Set a budget or spending limit with your provider before you start, keep sessions short, and use the cheap default for routine work. On a GitHub Copilot team plan, ask your admin to set a budget for extra usage. Our token bill guide has more ways to cut costs." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
const rows: [string, string, string, string][] = [
  ["MAI Code 2 Flash", "mai-code-2", "$0.05 / $0.25 (promo until May 17, 2027)", "Quick explanations, small edits; on Copilot Free"],
  ["MAI Code 2", "mai-code-2", "$0.50 / $2.50 (promo until May 17, 2027)", "Everyday coding in GitHub Copilot"],
  ["Qwen4-Max", "qwen4-max", "$1.50 / $4.50", "Big codebases on a budget (1M-token context)"],
  ["GPT-6.2 Sol", "gpt-6-2-astra-sol", "$2 / $10", "Everyday default in Codex and ChatGPT"],
  ["Gemini 4 Neon (added Nov 19)", "gemini-4-neon", "$3 / $15", "Complex coding in Google Antigravity or the Gemini API (1M-token context)"],
  ["GPT-6.2 Astra", "gpt-6-2-astra-sol", "$8 / $40", "Hard jobs: big refactors, stubborn bugs, polished frontends"],
  ["Edge0-145B", "edge0-145b", "Free (runs on your machine)", "Private, offline coding on a ~48 GB laptop"],
];
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to pick the right AI model for your coding agent", description: g.description, totalTime: "PT20M",
      tool: ["Codex", "GitHub Copilot", "Agav"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["gpt-6-2-astra-sol", "mai-code-2", "qwen4-max", "edge0-145b", "agav", "openai-codex", "github-copilot", "openrouter"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Which AI model should your coding agent use? A beginner&apos;s pick-by-job guide (November 2026)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders using Codex, GitHub Copilot or any agent that lets you pick a model. About a 6-minute read. Updated November 19, 2026.</p>
      <p>This week alone brought three big launches: OpenAI&apos;s <T s="gpt-6-2-astra-sol">GPT-6.2 Astra and Sol</T> and Microsoft&apos;s <T s="mai-code-2">MAI Code 2 and MAI Code 2 Flash</T> (both November 17), and Alibaba&apos;s <T s="qwen4-max">Qwen4-Max</T> (November 16). Every announcement says its model is the best value. You don&apos;t need to follow the leaderboard. You need a cheap default for everyday work, a bigger model for the hard jobs, and a habit of checking what each task actually costs. Here&apos;s a 5-step routine.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="prices">The new models side by side</H2>
      <p>Prices are per 1 million tokens (input / output) at standard API rates, or GitHub Copilot AI-credit rates for the MAI models. A million tokens is roughly 750,000 words; a typical small coding task uses a fraction of that, but long agent sessions add up fast.</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-white/10 text-white"><th className="py-2 pr-4">Model</th><th className="py-2 pr-4">Price (in / out)</th><th className="py-2">Best for</th></tr></thead>
        <tbody>{rows.map(([n, s, p, b]) => <tr key={n} className="border-b border-white/5"><td className="py-2 pr-4"><T s={s}>{n}</T></td><td className="py-2 pr-4">{p}</td><td className="py-2">{b}</td></tr>)}</tbody></table></div>
      <p className="text-sm text-gray-500">Sources: OpenAI&apos;s GPT-6.2 announcement, GitHub&apos;s Copilot models and pricing page, Alibaba&apos;s Qwen4-Max model page, Google&apos;s Gemini 4 Neon announcement (November 18) and Edge0&apos;s launch post. Benchmark claims below are the makers&apos; own numbers.</p>

      <H2 id="plan">Step 1: Start with what your plan already includes</H2>
      <p>If you pay for ChatGPT (Plus, Pro, Enterprise or Edu), GPT-6.2 Sol and Astra are already in <T s="openai-codex">Codex</T> as of November 17. If you use <T s="github-copilot">GitHub Copilot</T>, MAI Code 2 Flash is on every plan including Free, and MAI Code 2 is on Pro, Pro+, Max, Business and Enterprise. Pick them from the model picker in VS Code, Copilot CLI, JetBrains, Xcode or github.com. In Codex, type <code>/model</code> in a session, or start it with a model name:</p>
      <Code>{"codex -m gpt-6.2-sol      # everyday default\ncodex -m gpt-6.2-astra    # for the hard jobs"}</Code>

      <H2 id="default">Step 2: Pick a cheap everyday default</H2>
      <p>OpenAI says GPT-6.2 Sol is smarter than GPT-6.1 Sol at the same API price and lets you finish more tasks on the same paid plan. Microsoft says MAI Code 2 delivers 98% of GPT-6.1 Sol&apos;s score on four coding benchmarks at 40% of the cost (at its launch promo price), while being upfront that it isn&apos;t yet tuned for very long agent tasks. For one-line fixes and &quot;what does this do?&quot; questions, MAI Code 2 Flash costs a tenth of MAI Code 2. Whichever you choose, stick with it for a week before judging.</p>

      <H2 id="frontier">Step 3: Switch to a frontier model only for hard jobs</H2>
      <p>GPT-6.2 Astra is OpenAI&apos;s top model, and OpenAI says it writes cleaner code and builds better-looking websites, games and 3D scenes. It also costs four times as much as Sol per token, and on Cognition&apos;s FrontierCode 2.0 benchmark Sol came within 0.5 points of Astra at about a fifth of the cost. So use Astra like a specialist: when the default has failed twice on the same bug, for a large refactor, or for a landing page that has to look great. Then switch back. Before a big change, write down exactly what you want; our <Link className="underline" href="/guides/write-a-spec-for-your-ai-coding-agent">spec template</Link> helps any model get it right the first time.</p>

      <H2 id="cost">Step 4: Compare cost per task, not price per token</H2>
      <p>The cheapest model per token isn&apos;t always the cheapest per finished task: a model that needs three attempts can cost more than one that gets it right once. The agent matters too. <T s="agav">Agav</T>, a new open-source terminal agent (Show HN, November 17), published a study where it spent 49% less than Codex on the same tasks with the same model, while solving fewer of them (60% versus 77%). Cheaper isn&apos;t automatically better, so measure. Agav works with OpenAI, Anthropic, Gemini, OpenRouter, NVIDIA NIM or local Ollama, and switches models with <code>/model</code>:</p>
      <Code>{"curl -fsSL https://agav.dev/install.sh | bash\nagav --provider openrouter --model openrouter/free   # try it on a free model first"}</Code>
      <p>Working on a large codebase on a budget? <T s="qwen4-max">Qwen4-Max</T> has a 1-million-token context window at $1.50 / $4.50 per million tokens through OpenAI- and Anthropic-compatible APIs, so most tools can point at it. <T s="openrouter">OpenRouter</T> gives you many models behind one key, which makes side-by-side tests easy. More ways to cut the bill: <Link className="underline" href="/guides/cut-your-ai-agent-token-bill">how to cut your AI agent&apos;s token bill</Link>.</p>

      <H2 id="local">Step 5: Want no bill at all? Run a model on your own machine</H2>
      <p><T s="edge0-145b">Edge0-145B</T> is a free open-weight coding model designed to run on a high-memory laptop (about 48 GB, like a MacBook Pro) or a PC with an RTX 4090/5090. It works offline, so there are no token bills and your code stays on your computer. Its makers put it near cloud models like DeepSeek-V4-Flash on coding; independent results are still to come. Our <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">guide to running a coding model on your laptop</Link> walks through the setup.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Use the models your plan already includes: GPT-6.2 in Codex, MAI Code 2 (or Flash) in Copilot.</li><li>Make a mid-priced model your default and switch to GPT-6.2 Astra only for hard jobs.</li><li>Judge by cost per finished task on your own work, not by leaderboards; run Edge0-145B locally if you want no bill.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/cut-your-ai-agent-token-bill">cut your AI agent&apos;s token bill</Link>, <Link className="underline" href="/guides/switch-ai-coding-agents-without-losing-work">switch agents or models without losing work</Link>, <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">run a free coding model on your laptop</Link>, <Link className="underline" href="/use-case/llm-apis">best LLM APIs</Link>, <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
