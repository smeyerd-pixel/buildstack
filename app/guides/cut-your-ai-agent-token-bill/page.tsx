import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("cut-your-ai-agent-token-bill")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "See where the tokens go", text: "Before changing anything, look at one real session. AgentMon Live shows a Claude Code session's cost, context use, repeated file reads and unused MCP servers live; Agent Archive shows tokens and estimated spend per agent and model across Claude Code, Codex and Cursor." },
  { name: "Cut what the agent loads on every turn", text: "Every MCP server and skill you install is described to the model again and again. Remove the ones you don't use (toolshed lists and removes MCP servers for Claude Code and Codex), and turn skills on only in the projects that need them (Skillbox does this per folder)." },
  { name: "Stop it re-investigating old problems", text: "Agents forget everything between sessions, so they re-read the same files and retry the same dead ends. Atuin Threads keeps a searchable history of your Claude Code, Codex and OpenCode sessions, and its MCP server lets the agent look up how you solved something last time." },
  { name: "Use a cheap model for small decisions", text: "Don't pay a frontier model to answer yes/no or pick from a list. Google's Gemini Decisions API scores up to 1,000 such questions in one call for $0.10 per million input tokens with no output charge, and returns a confidence so you can send unsure cases to a bigger model or a person." },
  { name: "Turn repeat jobs into learned workflows with a spend cap", text: "If your agent does the same job every day, let it learn. AgentRun (free, open source) has a strong model figure the job out, keeps notes, skills and eventually a workflow a cheap model can run, shows the cost of every run, and pauses a run at your spend cap instead of letting it run away." },
];
const faq = [
  { q: "Why is my AI agent so expensive?", a: "Mostly because of input, not output. On every turn the model re-reads the whole conversation, the file contents it pulled in, long test and build logs, and the descriptions of every tool (MCP server) and skill you installed. Long sessions, noisy output and lots of unused tools multiply that. The steps above attack each one." },
  { q: "Will these tricks make the agent worse?", a: "Not if you measure. Removing tools you never use and giving the agent its own past notes usually helps it focus. Moving work to a cheaper model can hurt quality, which is why AgentRun shows each run's result next to its cost and the Decisions API returns a confidence score: send the low-confidence cases to the stronger model." },
  { q: "I pay a flat monthly plan (Claude Pro, ChatGPT Plus). Does this matter?", a: "Yes. Flat plans have usage limits, and the same token waste is what makes you hit them mid-task. Steps 1 to 3 work the same way on a subscription. If you hit a limit anyway, our guide to switching agents without losing work shows how to carry on in another one." },
  { q: "Are these tools free?", a: "AgentMon Live, Agent Archive, toolshed, Atuin and AgentRun are free and open source. Skillbox has a free plan (its output-trimming feature, Trim, is paid). The Gemini Decisions API charges $0.10 per million input tokens with free output, and has a no-cost tier in Google AI Studio for prototyping. You still pay your own model provider for the agent itself." },
  { q: "What is the single quickest win?", a: "Start a fresh session for each new task instead of one endless chat, and remove MCP servers you don't use. Both shrink what the model re-reads on every turn, take two minutes, and cost nothing." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to cut your AI coding agent's token bill", description: g.description, totalTime: "PT30M",
      tool: ["AgentMon Live", "toolshed", "Atuin", "Gemini Decisions API", "AgentRun"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["agentrun", "atuin", "gemini-decisions-api", "agentmon-live", "toolshed", "skillbox"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to cut your AI agent&apos;s token bill (without making it dumber)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders paying for Claude Code, Codex or API agents. About a 6-minute read. Updated November 13, 2026.</p>
      <p>AI agents get expensive fast. One team behind a new open-source tool says its AI code review bill went from $180 to $6,451 a month this year once its agents took off. Most of that money isn&apos;t spent on the answer: it&apos;s the model re-reading the same conversation, files, logs and tool lists on every turn, and re-discovering things it already worked out yesterday. Here is a 5-step routine to find the waste and cut it, with free tools that shipped this month.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="measure">Step 1: See where the tokens go</H2>
      <p>You can&apos;t cut what you can&apos;t see. On <T s="claude-code">Claude Code</T>, <T s="agentmon-live">AgentMon Live</T> (free, Apache-2.0) adds a live pane with the session&apos;s cost, how close you are to context and quota limits, and warnings about repeated file reads and MCP servers you never call:</p>
      <Code>{"/plugin install agentmon-live --marketplace codenotary/agentmon-live"}</Code>
      <p>Using several agents? <T s="agent-archive">Agent Archive</T> shows tokens and estimated spend per agent and model across Claude Code, Codex and Cursor. Look for the pattern: is it one giant session, huge test output, or the same files read again and again?</p>

      <H2 id="trim">Step 2: Cut what the agent loads on every turn</H2>
      <p>Every MCP server and skill you add is described to the model at the start of the session, used or not. Prune them. <T s="toolshed">toolshed</T> lists every MCP server you gave Claude Code and Codex and removes them with a keypress; <code>toolshed doctor</code> checks the rest still work:</p>
      <Code>{"brew install bartdegoede/tap/toolshed\ntoolshed            # see and remove servers\ntoolshed doctor     # check what's left"}</Code>
      <p>Skills piling up? <T s="skillbox">Skillbox</T> turns skills on only in the projects that need them and pauses ones you don&apos;t use; its paid Trim feature also shortens noisy test, build and git output before the agent reads it. Two free habits help just as much: start a fresh session for each new task, and ask the agent to run tests quietly (for example <code>npm test -- --silent</code>) and show only failures. New to MCP? Our <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">beginner&apos;s guide to MCP servers</Link> explains what they are.</p>

      <H2 id="memory">Step 3: Stop it re-investigating old problems</H2>
      <p>The most expensive token is the one spent rediscovering something. <T s="atuin">Atuin</T>, the popular shell-history tool, now keeps your agent sessions too (its Threads feature, version 18.24 and later), synced and end-to-end encrypted across your machines. Install it, then give your agent access to the history:</p>
      <Code>{"curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh\natuin resume                 # set up, then browse and resume past sessions\natuin mcp install claude     # or: codex, pi, opencode"}</Code>
      <p>Now when you say &quot;the login bug is back&quot;, the agent can find last week&apos;s investigation, what was tried and why it was dropped, instead of starting over. Capturing sessions is opt-in, and you can use Atuin&apos;s hosted sync, run your own server, or keep it all on one machine. It also lets you resume a session in a different agent, which our guide to <Link className="underline" href="/guides/switch-ai-coding-agents-without-losing-work">switching agents without losing work</Link> covers.</p>

      <H2 id="decisions">Step 4: Use a cheap model for small decisions</H2>
      <p>If you&apos;re building an app or agent, many of its model calls are really small choices: is this a bug report or a feature request, which tool should run, is this message safe, does this need the smart model? Google&apos;s new <T s="gemini-decisions-api">Gemini Decisions API</T> (launched November 11, 2026) is built for exactly that. You send one input and a list of questions; it scores the options in one pass in about 150 to 250 milliseconds and returns each answer with a confidence from 0 to 1. It costs $0.10 per million input tokens with no output charge. A routing example in Python:</p>
      <Code>{"from google import genai\n\nclient = genai.Client(http_options={\"api_version\": \"v1beta\"})\nresult = client.decisions.create(\n    model=\"gemini-decision-1\",\n    input=[{\"type\": \"text\", \"text\": user_message}],\n    questions={\n        \"tier\": {\n            \"type\": \"choice\",\n            \"instructions\": \"Which model should handle this request?\",\n            \"criteria\": {\n                \"cheap\": \"Simple question, lookup or small edit.\",\n                \"smart\": \"Multi-step reasoning, debugging or a large change.\",\n            },\n        },\n    },\n)"}</Code>
      <p>Send low-confidence answers to the stronger model (or a person). The cheap model can come from anywhere; <T s="openrouter">OpenRouter</T> gives you hundreds behind one key. Want no API bill at all for small coding tasks? <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">Run a free coding model on your laptop</Link>.</p>

      <H2 id="learn">Step 5: Turn repeat jobs into learned workflows, with a spend cap</H2>
      <p>If an agent does the same job again and again (reviewing pull requests, writing release notes, researching leads), it re-figures-out the job every time. <T s="agentrun">AgentRun</T> (free, Apache-2.0, from Parcha Labs) runs your agent on Claude Code, Codex, OpenCode or Pi and, with learning on, keeps what helped after each run: notes, then a skill, then a typed workflow a cheaper model can run, checked and graded before it&apos;s kept. Start it on your laptop:</p>
      <Code>{"npx @parcha/agentrun     # needs Node 24+; opens the console in your browser"}</Code>
      <p>Add one model key, apply a template such as code review or release notes, and give each run a spend cap: the run pauses at the cap instead of failing, and every run shows what it cost. Parcha says this took its code reviews to 18 cents each and a classification job from $0.89 to $0.12 per item. Those are the maker&apos;s numbers, so measure your own on the Learning tab&apos;s cost chart, and keep a person approving anything that merges (see <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keeping AI code behind a quality gate</Link>).</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Measure one real session first, then prune unused MCP servers and skills and keep sessions short.</li><li>Give the agent its own history (Atuin Threads) so it stops re-investigating, and route small decisions to a cheap model.</li><li>For jobs you run every day, let the agent learn a cheap workflow (AgentRun) and always set a spend cap.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/switch-ai-coding-agents-without-losing-work">switch AI coding agents without losing work</Link>, <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">run a free coding model on your laptop</Link>, <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">add MCP servers to Claude Code and Codex</Link>, <Link className="underline" href="/use-case/llm-apis">best LLM APIs</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
