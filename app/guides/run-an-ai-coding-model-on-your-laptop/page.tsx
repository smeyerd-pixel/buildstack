import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("run-an-ai-coding-model-on-your-laptop")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Check your computer has enough memory", text: "Local models live in your computer's memory (RAM). Recursive's own Mac engine for Flint asks for an M4 Pro, M5 Pro or M5 Max with at least 48 GB of unified memory and about 30 GB of free disk space. Less memory means you need a smaller model or a shorter context." },
  { name: "Install a model runner", text: "Download Ollama (or LM Studio) and open it. This is the app that loads the model and serves it on your computer, the same way a website server serves pages." },
  { name: "Download and test the model", text: "Run ollama run flint:40b-a2b-qat-int4 in a terminal. The first run downloads the model, then opens a chat so you can ask a test question. Type /bye to leave." },
  { name: "Connect a coding agent", text: "From your project folder, run ollama launch opencode (or ollama launch codex, or pick Ollama in Cline's settings) and choose the Flint model when asked. The agent now reads and edits your code using the model on your machine." },
  { name: "Give it small, clear tasks", text: "Start with one function, one test, one bug. Smaller local models need more guidance than big paid ones, so break bigger jobs into steps and check the diff after each one." },
];
const faq = [
  { q: "Is a local AI coding model really free?", a: "The model weights are free to download (Flint is Apache 2.0) and there is no per-token bill, because your own computer does the work. You pay in hardware: you need a machine with a lot of memory, and it will use more battery and fan." },
  { q: "Is my code private when I run a model locally?", a: "Yes, the model runs on your computer, so your prompts and code are not sent to an AI company's servers. Check the coding agent's own settings too, since some agents can still send usage data or search the web." },
  { q: "Is a local model as good as Claude Code or Codex?", a: "Not usually for big, messy tasks. Recursive itself says Flint may need more guidance than larger closed-source models. Many builders use a local model for everyday, private or offline work and a paid cloud agent for the hard jobs." },
  { q: "What if my laptop doesn't have enough memory?", a: "Use a smaller model in Ollama or LM Studio, lower the context length, or stay with a cloud agent. Some agents, like OpenCode, also offer hosted models on free tiers, subject to limits." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to run a free AI coding model on your own laptop", description: g.description, totalTime: "PT30M",
      tool: ["Ollama", "Recursive Flint", "OpenCode"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["flint", "opencode", "vercel-fx", "cline"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to run a free AI coding model on your own laptop (offline, private, no API bills)</h1>
      <p className="text-lg text-gray-400">A plain-English guide to local AI coding for vibe coders. About a 5-minute read. Updated October 23, 2026.</p>
      <p>Most AI coding agents, like <T s="claude-code">Claude Code</T> or <T s="openai-codex">Codex</T>, send your code to a model running in someone else&apos;s data center and charge you for it. A <b>local model</b> runs on your own computer instead: it works offline, your code stays on your machine, and there is no usage bill. Until recently the local options were too slow or too weak for real coding. On October 21, 2026, Recursive released <T s="flint">Flint</T>, a free coding model built to run fast on a laptop, which makes this a good moment to try it.</p>

      <H2>The 5-step setup</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2>What you need (be honest about your hardware)</H2>
      <p>Flint has 40 billion parameters in total but only uses about 2.5 billion for each word it writes. That is why it is fast, but the whole model still has to fit in memory. Recursive&apos;s numbers: more than 125 tokens per second on an M4 Pro MacBook Pro, and its optimized Mac engine needs an M4 Pro, M5 Pro or M5 Max with at least 48 GB of unified memory. On NVIDIA hardware it runs through llama.cpp, vLLM or SGLang. If your laptop has 16 GB, a model this size is not for you yet; stick with a cloud agent or a much smaller model.</p>

      <H2 id="ollama">The commands, copy and paste</H2>
      <p>After installing <a className="underline" href="https://ollama.com" target="_blank" rel="noopener">Ollama</a>, open a terminal and run:</p>
      <Code>{"# 1. download Flint and chat with it (type /bye to leave)\nollama run flint:40b-a2b-qat-int4\n\n# 2. go to your project folder\ncd my-project\n\n# 3. start a coding agent that uses the local model\nollama launch opencode\n# or: ollama launch codex   (install Codex first)"}</Code>
      <p>Pick <code>flint:40b-a2b-qat-int4</code> when the launcher asks for a model. Prefer a desktop app? In LM Studio, get the model with <code>lms get recursivesi/flint</code>. In <T s="cline">Cline</T>, choose Ollama as the provider in its settings. <T s="openhands">OpenHands</T> can connect to Ollama&apos;s local address too.</p>

      <H2 id="rec">On a newer Mac: Recursive&apos;s rec engine</H2>
      <p>If you have one of the supported Macs (M4 Pro, M5 Pro or M5 Max, 48 GB or more), Recursive&apos;s free <a className="underline" href="https://github.com/recursive-oss/rec" target="_blank" rel="noopener">rec</a> engine is the fastest option. Recursive says it is 1.4 to 2.6 times faster than llama.cpp on an M4 Pro. It downloads the model and sets up a coding agent for you:</p>
      <Code>{"curl -fsSL https://raw.githubusercontent.com/recursive-oss/rec/main/install.sh | bash\nrec launch pi        # Recursive's recommended agent\nrec launch opencode  # or OpenCode\nrec stop             # stop the model server when you're done"}</Code>
      <p>rec is built for one agent at a time. If you want to <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">run several agents at once</Link>, use Ollama or another server instead.</p>

      <H2>Which coding agent should I pair it with?</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li><T s="opencode">OpenCode</T>: free, open-source terminal agent with a one-command Ollama launcher. The easiest start.</li>
        <li><T s="openai-codex">Codex</T>: if you already know it, <code>ollama launch codex</code> points it at your local model.</li>
        <li><T s="cline">Cline</T>: if you would rather stay inside VS Code.</li>
        <li><T s="vercel-fx">fx</T>: Vercel Labs&apos; tiny experimental agent, which can connect to any OpenAI-compatible endpoint such as Ollama. Good if you want to script an agent.</li>
      </ul>

      <H2>Check the work, like always</H2>
      <p>A local model makes mistakes just like a cloud one, and a smaller one makes more. Keep tasks small, run your tests, and read the diff summary before you push. Our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link> walks through it step by step.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Local models are free to run, private and work offline, but need a computer with lots of memory.</li><li>Fastest path: install Ollama, run <code>ollama run flint:40b-a2b-qat-int4</code>, then <code>ollama launch opencode</code>.</li><li>Give a local model small, clear tasks and keep a paid cloud agent for the hard ones.</li></ul>
      <p className="text-sm text-gray-500">Picking an agent? See our <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, <Link className="underline" href="/compare">side-by-side comparisons</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
