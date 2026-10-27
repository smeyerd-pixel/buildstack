import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("fix-port-already-in-use")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Read the error and note the port", text: "Messages like \"Error: listen EADDRINUSE: address already in use :::3000\" or \"Port 3000 is in use\" mean another program is already listening on that port. The number at the end (3000, 5173, 8000, 8080) is the port you need to free." },
  { name: "Find what is using the port", text: "On Mac or Linux run lsof -i :3000. On Windows run netstat -ano | findstr :3000 in Command Prompt or PowerShell. Or install the free proc tool and run proc on :3000, which works the same way on all three. Write down the PID (process ID) number." },
  { name: "Check it is safe to stop", text: "It is usually an old copy of your own dev server (node, next, vite, python) that an AI agent or a closed terminal left running. If it is something you don't recognise, like a database or another app, stop and look before you kill it. proc why :3000 shows what started it." },
  { name: "Stop it", text: "On Mac or Linux run kill PID (use kill -9 PID only if it refuses to exit). On Windows run taskkill /PID PID /F. With proc, run proc free :3000, which asks first, stops it and checks the port is free." },
  { name: "Start your server again and prevent repeats", text: "Run npm run dev (or your usual command) again. Then add a line to your AGENTS.md or CLAUDE.md telling your AI agent to check the port before starting a dev server and to stop any server it started when it is done." },
];
const faq = [
  { q: "What does EADDRINUSE mean?", a: "It is short for \"address in use\". Only one program can listen on a port at a time, so when your dev server tries to use port 3000 and something already has it, Node.js stops with EADDRINUSE. Nothing is broken; you just need to stop the old process or use another port." },
  { q: "Why does this keep happening when I use AI coding agents?", a: "Agents like Claude Code, Codex and Cursor often start a dev server in the background to test their work. If the session ends, crashes or you close the window, that server can keep running and hold the port. Running several agents at once makes it more likely." },
  { q: "Can I just use a different port instead?", a: "Yes. Next.js and Vite automatically try the next free port (3001, 5174 and so on) and print the new address, and most tools accept a port flag, for example npm run dev -- -p 3001 for Next.js. That works, but old servers keep piling up and using memory, so it is worth cleaning them up." },
  { q: "Is kill -9 or taskkill /F safe?", a: "It ends the process immediately without letting it clean up, which is fine for a dev server but can lose data for databases or apps with unsaved work. Try a normal kill first, and only force it if the process won't exit." },
  { q: "Is proc free?", a: "Yes. proc is free and open source (MIT) and runs on macOS, Linux and Windows. Install it with Homebrew (brew install yazeed/proc/proc) or from npm, cargo, Scoop, Nix or Docker." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to fix \"port 3000 is already in use\" (EADDRINUSE)", description: g.description, totalTime: "PT5M",
      tool: ["Terminal", "proc"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["proc", "corgi", "orca", "claude-code"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to fix &quot;port 3000 is already in use&quot; (EADDRINUSE) when vibe coding</h1>
      <p className="text-lg text-gray-400">A plain-English fix for Mac, Windows and Linux. About a 3-minute read. Updated October 27, 2026.</p>
      <p>You ask your AI agent to start the app, or you run <code>npm run dev</code>, and instead of your site you get something like this:</p>
      <Code>{"Error: listen EADDRINUSE: address already in use :::3000"}</Code>
      <p>It looks scary, but it only means something else is already using port 3000, very often an old copy of your own dev server that <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T>, <T s="cursor">Cursor</T> or a closed terminal left running. Here is how to find it, stop it and keep it from happening again.</p>

      <H2>The 5-step fix</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="mac-linux">Mac and Linux commands</H2>
      <p>Open Terminal and replace 3000 with your port:</p>
      <Code>{"# see what is listening on port 3000 (note the PID column)\nlsof -i :3000\n\n# ask it to stop (replace 12345 with the PID)\nkill 12345\n\n# only if it refuses to stop\nkill -9 12345"}</Code>

      <H2 id="windows">Windows commands</H2>
      <p>Open Command Prompt or PowerShell. The PID is the last number on the line:</p>
      <Code>{"netstat -ano | findstr :3000\n\ntaskkill /PID 12345 /F"}</Code>

      <H2 id="proc">The easy way: proc (free, all three systems)</H2>
      <p><T s="proc">proc</T> is a free, open-source command-line tool that lets you target processes by port, name or folder in plain words, and it asks before stopping anything. It got a new release on October 25 and was shown on Hacker News on October 26, 2026.</p>
      <Code>{"# install on Mac (also on npm, cargo, Scoop, Nix and Docker)\nbrew install yazeed/proc/proc\n\nproc on :3000      # what is on the port\nproc why :3000     # what started it\nproc free :3000    # stop it and check the port is free (asks first)\nproc orphans --in . # leftover processes from this project folder"}</Code>
      <p>Add <code>--dry-run</code> to any command that changes something to see what it would do first. proc also has an agent skill that teaches Claude Code, Codex, Cursor, <T s="gemini-cli">Gemini CLI</T> and others to use it, and a <code>--json</code> option so agents can read its output.</p>

      <H2 id="prevent">Stop your AI agent leaving servers running</H2>
      <p>Most repeat cases come from agents starting a dev server to test their work and never stopping it. Add this to the AGENTS.md or CLAUDE.md file at the top of your project:</p>
      <Code>{"Before starting a dev server, check whether one is already running on the port\nand reuse it. Stop any server or background process you started when you finish."}</Code>
      <p>If you run several agents at once, a tool like <T s="corgi">Corgi</T> or <T s="orca">Orca</T> keeps each agent in its own pane so you can see what each one started. Our guide to <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">running several AI coding agents at once</Link> also covers giving each one its own port.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>EADDRINUSE means something is already on the port, usually an old dev server.</li><li>Find it with lsof (Mac/Linux), netstat (Windows) or proc on :3000.</li><li>Stop it with kill, taskkill or proc free :3000, then tell your agent to clean up after itself.</li></ul>
      <p className="text-sm text-gray-500">Server running again? Before you ship, use our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link>. Picking tools? See the <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link> or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
