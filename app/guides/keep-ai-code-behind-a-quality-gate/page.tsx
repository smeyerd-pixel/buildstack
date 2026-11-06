import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("keep-ai-code-behind-a-quality-gate")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Decide what \"done\" means before the agent starts", text: "Write down the checks that must pass: typecheck, unit tests, a click-through of the happy path, and (for anything touching auth, payments or data) a second person. If you can't name the checks, you're not ready for an unsupervised agent run." },
  { name: "Make tests run on the exact change, not an earlier draft", text: "Agent edits after a green test run count as untested. Re-run your suite (or a sandbox gate) on the final diff. If the agent changes one more file, the previous green result is stale." },
  { name: "Get a review that can actually block the merge", text: "A polite AI comment is not a gate. Use a reviewer that records findings by severity and holds the change while high or critical issues are open — or at least a static risk score that makes you stop and look." },
  { name: "Require a human approval that isn't just you rubber-stamping yourself", text: "If you have a teammate, they approve. If you're solo, still separate the \"wrote it\" moment from the \"ship it\" moment: sleep on it, or force yourself through a short checklist before merge. Prefer tools that refuse to open the PR until someone clicks approve." },
  { name: "Fail closed when a check errors", text: "Timeouts, missing reviews and broken CI should mean \"no,\" not \"eh, ship it.\" Wire the same rule into your Git host so a direct push can't skip the gate." },
];
const faq = [
  { q: "Isn't this the same as \"check AI code before you ship\"?", a: "That checklist is what you do by hand. This guide is about putting those checks in front of the merge button so the agent (or you on a tired Friday) can't skip them. Think of it as the checklist with teeth." },
  { q: "Do I need a paid platform for quality gates?", a: "No. You can start with your own CI required checks, a free risk score like farol, and a human approval rule on the branch. Platforms like AI CodeOps package the whole plan→build→review→test→approve loop in the browser if you want that out of the box." },
  { q: "What if I'm a solo vibe coder?", a: "You can still gate yourself: required CI on main, a second-model review, and a rule that the PR only opens after you click approve on a summary page. Solo workspaces usually allow self-approval — the point is you approve a finished change, not a chat that said \"done.\"" },
  { q: "Where do tool-call approvals fit?", a: "withHuman (and similar layers) intercept risky tool calls while the agent is working — deleting files, calling production APIs. Quality gates catch bad code before merge. Use both: one during the run, one at the end." },
  { q: "Should the gate open the PR automatically?", a: "Only after tests, review and approval all pass. Opening a draft PR early for discussion is fine; merging or even marking it ready should wait for the gate." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to keep AI-written code from merging until tests and a person say yes", description: g.description, totalTime: "PT20M",
      tool: ["AI CodeOps", "farol", "withHuman"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["ai-codeops", "withhuman", "farol", "momentic"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to keep AI-written code from merging until tests and a person say yes</h1>
      <p className="text-lg text-gray-400">A plain-English quality-gate routine for vibe coders. About a 5-minute read. Updated November 6, 2026.</p>
      <p>Your agent said &quot;done.&quot; That is not a merge signal. Agents are great at writing diffs and terrible at knowing when those diffs are safe to ship. Here&apos;s a 5-step routine so <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T>, Codex or a browser agent like <T s="ai-codeops">AI CodeOps</T> can&apos;t open (or merge) a pull request until the tests, the review and a person all agree.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="ai-codeops">One platform that fails closed: AI CodeOps</H2>
      <p><T s="ai-codeops">AI CodeOps</T> is a browser workspace where agents plan, build, review and test against your real repo. A pull request opens only when (1) your tests passed on that exact version, (2) the AI review has no open high/critical findings, and (3) a person approved — and the person who started the session can&apos;t be the only approver when someone else can. If a check errors, the gate says no. Free during open beta.</p>
      <Code>{"# Mental model (no install — it runs in the browser)\n# 1. Connect GitHub / GitLab / Bitbucket / Gitea / Forgejo\n# 2. Start a session with one clear task\n# 3. Watch plan → build → review → sandbox tests\n# 4. Approve only when the Quality gates panel is green\n# 5. Then the PR opens — not before"}</Code>

      <H2 id="farol">A free risk score on every PR: farol</H2>
      <p>Already reviewing agent PRs in GitHub? Add <T s="farol">farol</T>. It&apos;s a free MIT CLI / GitHub Action that scores merge risk (0–100), flags untested diff lines and breaking contracts, and never uploads your code. It doesn&apos;t block by itself — you (or a required check wrapper) do — but it stops &quot;LGTM&quot; on a 900-line agent PR.</p>
      <Code>{"npx @winninjs/farol\n# or wire it as a GitHub Action after your AI review step"}</Code>

      <H2 id="during-run">While the agent is still working: withHuman</H2>
      <p>Quality gates catch bad code at the end. <T s="withhuman">withHuman</T> catches bad <i>actions</i> during the run: it intercepts tool calls, auto-approves the boring ones and routes risky ones (delete, deploy, production API) to a human. Pair it with a merge gate so you get protection before and after the diff lands.</p>

      <H2 id="click-through">Prove the app still works: Momentic</H2>
      <p>Unit tests go green while the button is still broken. <T s="momentic">Momentic (Mo)</T> is an AI QA agent that explores your web or mobile app and files real bugs. Kick it from MCP, a PR comment or CI so &quot;tests passed&quot; means someone (or something) actually clicked through.</p>

      <H2 id="dont">What not to do</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Don&apos;t treat the agent&apos;s &quot;all tests passed&quot; chat message as evidence — read the CI log for that commit.</li>
        <li>Don&apos;t let the same person who prompted the agent be the only required approver on a team repo.</li>
        <li>Don&apos;t soft-fail: a timed-out review or flaky sandbox should block, not warn-and-merge.</li>
      </ul>
      <p>For the manual pre-ship checklist, see <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>. For keeping the agent off production while it works, use a <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox</Link>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Name the checks before the agent runs; re-test the final diff.</li><li>Reviews and approvals must be able to block — fail closed on errors.</li><li>Gate tool calls during the run and the merge at the end.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox your coding agent</Link>, and <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop agents deleting your database</Link>. More tools: <Link className="underline" href="/use-case/coding-agents">coding agents</Link> and <Link className="underline" href="/new">newest AI tools</Link>.</p>
    </article>
  );
}
