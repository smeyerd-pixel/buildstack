import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("write-a-spec-for-your-ai-coding-agent")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Talk it through first, no code", text: "Tell the agent what you want in your own words, then add: do not write any code yet, ask me anything you need to know first. Answer its questions. This is where most misunderstandings get caught, for free." },
  { name: "Have the agent write a short spec file", text: "Ask it to save a spec in your repo (for example specs/todo-filter.md) with five parts: the goal in one sentence, what already exists in the code (with file names), the steps, what is out of scope, and how we will know it is done." },
  { name: "Get a fresh pair of eyes on the spec", text: "Open a brand-new chat or agent session that has not seen the conversation and ask it to read the spec and the code and list anything ambiguous, missing or wrong. A reviewer without your chat history reads only what is written, just like the agent that will build it." },
  { name: "Build from the spec, one step at a time", text: "Tell the agent: build exactly what specs/todo-filter.md says, step by step, add the tests it names, and stop and ask if something in the spec turns out to be wrong. Keep it on its own git branch so you can throw it away if it goes badly." },
  { name: "Check the done list before you merge", text: "Go through the done criteria yourself, run the tests, and only then commit and merge. Keep the spec file: next time you or another agent touches this feature, it explains what was built and why." },
];
const faq = [
  { q: "What is a spec, in plain English?", a: "A short written plan for one feature: what it should do, what it should not do, which parts of the code it touches, and how you will check it is done. It is usually half a page of Markdown or YAML saved in your project, not a big document." },
  { q: "Isn't this slower than just prompting?", a: "For a one-line fix, yes, so skip it. For anything that takes more than one prompt, a spec usually saves time because the agent stops guessing, you catch the wrong idea before code exists, and you are not undoing a large change that went in the wrong direction." },
  { q: "Do I need a special tool?", a: "No. The template on this page works with any agent, including Claude Code, Codex, Cursor and Copilot. Tools like spec-first, Google's Elephant-Goldfish Model and Kiro automate the steps and add checks, but a Markdown file and a fresh chat get you most of the benefit." },
  { q: "Are these tools free?", a: "spec-first is free and open source (MIT) and Google's Elephant-Goldfish Model is free and open source (Apache-2.0). Kiro has a free tier of 50 credits a month and a Pro plan at $20 a month. You still pay for the AI model or subscription your agent uses." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to write a spec your AI coding agent will follow", description: g.description, totalTime: "PT15M",
      tool: ["Git", "spec-first", "Elephant-Goldfish Model", "Kiro"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["spec-first", "egm", "kiro", "entire"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to write a spec your AI coding agent will actually follow</h1>
      <p className="text-lg text-gray-400">A plain-English guide with a copy-paste template. About a 4-minute read. Updated October 28, 2026.</p>
      <p>You asked <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T> or <T s="cursor">Cursor</T> for a simple feature and got something bigger, different, or half-finished. The agent is not being dumb: it filled every gap in your prompt with a guess. The fix is to write those gaps down before any code exists. That written plan is called a <b>spec</b>, and you do not need to be an engineer to write one, because the agent writes it with you.</p>

      <H2>The 5-step spec routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="template">Copy-paste spec template</H2>
      <p>Paste this into your agent after you have talked the feature through. It works in any agent:</p>
      <Code>{"Don't write code yet. Save a spec to specs/<feature-name>.md with:\n\n## Goal\nOne sentence: what the user can do when this is finished.\n\n## What exists today\nThe files and functions this touches (with file names and line\nnumbers you actually checked).\n\n## Steps\nNumbered, small steps. Each one should be testable.\n\n## Out of scope\nThings we are NOT doing in this change.\n\n## Done when\nA checklist I can verify myself, including the tests to add.\n\n## Open questions\nAnything you had to assume. Ask me about these before building."}</Code>
      <p>The two sections beginners skip are the ones that matter most. <b>Out of scope</b> stops the agent adding drag-and-drop, dark mode and a settings page you never asked for. <b>Done when</b> gives both of you the same finish line.</p>

      <H2 id="fresh-review">Why a fresh reviewer catches what you miss</H2>
      <p>The agent that wrote the spec remembers your whole conversation, so it reads your intent into vague sentences. A new session only sees the words on the page, exactly like the agent that will build it later. In a fresh chat, paste:</p>
      <Code>{"Read specs/<feature-name>.md and the code it mentions.\nDon't change anything. List: steps that are ambiguous, facts that\ndon't match the code, anything missing from 'Done when', and\nanything that should be cut. Then say BUILD, BUILD WITH CHANGES or STOP."}</Code>

      <H2 id="spec-first">Automate it in Claude Code with spec-first</H2>
      <p><T s="spec-first">spec-first</T> is a free, open-source (MIT) Claude Code plugin shown on Hacker News on October 27, 2026 that turns this routine into four commands. It writes the spec as YAML on its own branch and git worktree, checks that every file and line the spec cites really exists, has a fresh agent with no chat history approve, cut or refuse it, builds it with tests, and only commits if your build and tests pass, then opens the pull request. Install it inside Claude Code:</p>
      <Code>{"/plugin marketplace add holgerleichsenring/specification-first-agentic-development\n/plugin install spec-first@specification-first-agentic-development\n\n# then, once per project\n/spec-first:bootstrap-project\n\n# for each feature\n/spec-first:create-spec\n/spec-first:review-spec\n/spec-first:apply-spec\n/spec-first:deliver-spec"}</Code>
      <p>Using Codex, Cursor or Copilot instead? The project explains how to follow the same files through an AGENTS.md file and a git hook.</p>

      <H2 id="other-tools">Other ways to work spec-first</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><T s="egm">Elephant-Goldfish Model</T>: Google&apos;s free, open-source plugin for Antigravity, Gemini CLI, Claude Code and Codex. A deep-context session drafts a Markdown design doc, then fresh zero-context subagents review it before code is written, and a drift report later shows where the code wandered from the spec.</li>
        <li><T s="kiro">Kiro</T>: AWS&apos;s agentic IDE built around spec-driven development, if you would rather have specs built into the editor than add a plugin. Free tier of 50 credits a month.</li>
        <li><T s="entire">Entire</T>: a new Git forge (launched October 26, 2026) that keeps the prompts and agent sessions behind each commit, so the &quot;why&quot; travels with your code even after the chat is gone.</li>
      </ul>

      <H2>After it is built</H2>
      <p>A spec tells the agent what to build; it does not prove the agent built it. Before you push, run through our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link>. If you want several specs built at the same time, see <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">how to run several AI coding agents at once</Link>, and if you hit a usage limit halfway through, the spec doubles as a handoff note when you <Link className="underline" href="/guides/switch-ai-coding-agents-without-losing-work">switch agents without losing your work</Link>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Talk first, then have the agent save a short spec: goal, what exists, steps, out of scope, done when.</li><li>Get a fresh session to review it before any code is written.</li><li>Build one step at a time on a branch, check the done list, keep the spec.</li></ul>
      <p className="text-sm text-gray-500">Picking an agent? See our <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, <Link className="underline" href="/compare">side-by-side comparisons</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
