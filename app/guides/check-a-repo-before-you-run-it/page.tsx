import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("check-a-repo-before-you-run-it")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Clone it, but don't install, build or open it in your editor yet", text: "Downloading files with git clone does not run the project's code. npm install, pip install, opening the folder in VS Code or Cursor, or asking your agent to \"set it up\" can. Many stealers hide in install hooks or editor tasks that fire the moment you open the folder, so the scan comes first." },
  { name: "Run a read-only scan for the usual tricks", text: "Point CloneGuard at the folder (or let it clone for you). It only reads files and flags code that reaches for SSH keys, cloud credentials, browser passwords or wallets, uploads to raw IPs or webhook/paste sites, downloads and runs code, hides behind obfuscation, or auto-runs from package.json or .vscode/tasks.json." },
  { name: "Read the red flags yourself (or ask your agent to explain them, without running anything)", text: "Open the files CloneGuard points to. A \"dangerous\" or \"suspicious\" verdict on a repo from a stranger is a reason to walk away. Stuck? Paste the finding into Claude or ChatGPT and ask what that line does; tell it not to run commands." },
  { name: "If you still want to run it, use a throwaway box", text: "A clean scan is not proof of safety. Run strangers' code in a container, a VM or a cloud devbox that has none of your real keys, logins or SSH config, and delete it afterwards." },
  { name: "Guard your agent and check what already happened", text: "Install Stroq's hooks so your coding agent is stopped from running curl | sh or sending a known secret to the internet, and asked first when a command copies text it just read (the usual prompt-injection path). Then run npx @stroq/cli to see whether any keys left your machine in the last 30 days, and rotate any that did." },
];
const faq = [
  { q: "Isn't checking stars and the owner enough?", a: "It's a good first filter for popular open-source projects (see our beginner's guide to using a GitHub repo). It doesn't help with a private repo a 'recruiter' sends you, or a brand-new repo with bought stars. A scan looks at what the code actually does." },
  { q: "Is cloning a repo safe?", a: "git clone just downloads files; it doesn't run the project. The danger starts when you install dependencies, run scripts, or open the folder in an editor that trusts workspace tasks. CloneGuard's clone command clones and then scans before you touch anything else." },
  { q: "What does CloneGuard miss?", a: "It is pattern-based, so a determined attacker can hide from it, and it can flag legitimate code (a password manager should touch browser data). It skips node_modules unless you pass --include-deps. Treat 'clean' as 'no common tricks found', not 'safe'." },
  { q: "What's the difference between CloneGuard and Stroq?", a: "CloneGuard is a one-shot read-only scan of a folder before you run it. Stroq watches your AI coding agent: it reads past Claude Code, Codex and Cursor sessions to show which keys were sent where, and its hooks block risky commands in future sessions. It also has an inspect command for folders you were sent. They work well together." },
  { q: "My agent already ran npm install on a sketchy repo. What now?", a: "Disconnect it from anything important, run a Stroq session scan to see which keys showed up in commands, and rotate every credential on that machine (SSH keys, cloud keys, GitHub tokens, .env secrets) starting with the ones it names. If wallets or browser passwords were on the machine, change those too." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to check a GitHub repo (or take-home project) before you or your AI agent run it", description: g.description, totalTime: "PT10M",
      tool: ["CloneGuard", "Stroq"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["cloneguard", "stroq", "aether", "easi-run"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to check a GitHub repo (or take-home project) before you or your AI agent run it</h1>
      <p className="text-lg text-gray-400">A plain-English safety routine for vibe coders. About a 5-minute read. Updated November 9, 2026.</p>
      <p>A &quot;recruiter&quot; sends you a demo app to fix. Someone on X shares a repo that does exactly what you need. You tell <T s="claude-code">Claude Code</T> or <T s="cursor">Cursor</T> to &quot;clone it and get it running.&quot; That one sentence can be enough for a booby-trapped project to upload your SSH keys, cloud credentials or <code>.env</code> secrets, often from an install hook or an editor task, before you&apos;ve read a line of code. Here&apos;s a 5-step routine that takes about 10 minutes, with two free open-source tools that shipped this week.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="cloneguard">Step 2 in practice: scan with CloneGuard</H2>
      <p><T s="cloneguard">CloneGuard</T> is a tiny, dependency-free command-line tool (MIT) that only reads files; it never runs, installs or imports anything from the project. Download the build for your computer from its GitHub releases page (macOS, Linux and Windows), then:</p>
      <Code>{"# clone a repo and scan it straight away\ncloneguard clone https://github.com/someone/demo-app\n\n# or scan a folder you already have\ncloneguard scan ./demo-app\n\n# exit codes: 0 clean, 1 caution, 2 suspicious, 3 dangerous\ncloneguard scan . || echo \"stop and read the findings\""}</Code>
      <p>Each finding shows the file, the line, the snippet and a plain-English reason, for example &quot;Runs a command the moment you open the folder&quot; for a <code>.vscode/tasks.json</code> task, or &quot;Reaches for your secrets AND talks to a suspicious server&quot; when one file does both.</p>

      <H2 id="stroq">Step 5 in practice: guard your agent with Stroq</H2>
      <p><T s="stroq">Stroq</T> (Apache-2.0, runs locally, no account) looks at the agent side. It reads your Claude Code, Codex and Cursor session records and prints key names, never values. Needs Node.js 22 or newer.</p>
      <Code>{"npx @stroq/cli           # card of your last 30 days: commands from text the agent read, keys that left\nnpx @stroq/cli inspect   # read a folder you were sent before you run it\nnpx @stroq/cli init      # add hooks so the next session is guarded\nnpx @stroq/cli sent      # did your agent pass your keys on? (names only)"}</Code>
      <p>Its hooks deny <code>curl | sh</code> and outbound calls carrying a known secret, and ask you first when a command repeats text the agent just read. It&apos;s a filter, not a sandbox, so keep step 4.</p>

      <H2>Where to run code you don&apos;t trust</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li>A container or VM on your machine with no access to your home folder, SSH keys or cloud logins (our <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox guide</Link> walks through this).</li>
        <li>A disposable cloud devbox such as <T s="aether">Aether</T>, where the agent works in a fresh microVM you can watch and stop.</li>
        <li>If the project needs a browser login, a separate profile on hardware you control, like <T s="easi-run">easi.run</T>, never your everyday browser.</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Clone, don&apos;t install or open, until you&apos;ve scanned.</li><li>A dangerous verdict from a stranger&apos;s repo means walk away; a clean one still isn&apos;t proof.</li><li>Run strangers&apos; code in a throwaway box, guard your agent, and rotate any key that leaked.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/use-a-github-repo">how to use someone else&apos;s GitHub repo</Link>, <Link className="underline" href="/guides/check-claude-code-extension-backdoor">check your Claude Code extension for the backdoor</Link>, and <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">connect your agent to your apps safely</Link>. More tools: <Link className="underline" href="/use-case/coding-agents">coding agents</Link> and <Link className="underline" href="/new">newest AI tools</Link>.</p>
    </article>
  );
}
