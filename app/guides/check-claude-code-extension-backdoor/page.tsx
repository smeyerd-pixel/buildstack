import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("check-claude-code-extension-backdoor")!;
const url = `${SITE.url}/guides/${g.slug}`;
const NOTICE = "https://cursor.com/blog/claude-code-extension-security-notice";
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Check if you could be affected", text: "You are only at risk if you installed or updated the Claude Code extension (Anthropic.claude-code) to version 2.1.313 from the Cursor extension marketplace between about 2:27am and 1:35pm Pacific time on October 29, 2026. The Claude Code command-line tool from npm and the extension from Microsoft's VS Code marketplace were not reported as affected." },
  { name: "Run the one-line check", text: "The bad version adds an SSH key labeled svc-telemetry to your computer. Open Terminal (Mac) or PowerShell (Windows) and run Cursor's check command below. If it prints \"No key found\", that machine is not impacted." },
  { name: "If the key is found, disconnect and clean up", text: "Take the computer off the network, then run Cursor's remediation script for your system from its security notice. Uninstalling the extension is not enough on its own: the malware leaves separate background scripts that keep running." },
  { name: "Change your passwords and keys from another computer", text: "From a computer you trust, rotate API keys, cloud and GitHub tokens and any logins that were on the affected machine, and sign out of active sessions. The malware sent the names of secret-looking environment variables, which is a hint at what to rotate first." },
  { name: "Update to a clean version", text: "Install the current Claude Code extension again from your editor's marketplace (Cursor removed the bad version and rebuilt its marketplace), or use the Claude Code CLI in your terminal instead." },
];
const habits = [
  { h: "Treat extensions like apps you install", t: "An editor extension runs with the same access as you: your files, your SSH keys, your .env files. Only install what you actually use, and remove the rest." },
  { h: "Check the publisher, not just the name", t: "Look for the verified publisher and the download count. Fakes often copy a famous name and icon." },
  { h: "Think about auto-updates", t: "This attack arrived as a normal-looking update. In VS Code-based editors you can turn off automatic extension updates (Settings, search for \"Extensions: Auto Update\") and update on your own schedule after a release has been out for a while. The trade-off: you also get security fixes later, so check in weekly." },
  { h: "Keep real secrets out of reach", t: "Don't keep live production keys in project .env files on your everyday laptop. Use test keys locally and keep the real ones in your hosting provider's settings." },
  { h: "Run risky agent work in a sandbox", t: "A sandbox runs your agent on a copy of your project in a sealed-off machine, so it can't touch your real files or SSH keys. See our sandbox guide below." },
  { h: "Know where to look for news", t: "Bookmark your editor's and your AI tool's security or status pages. Cursor, for example, published its notice with check and cleanup steps the same day." },
];
const faq = [
  { q: "What exactly happened?", a: "On October 29, 2026, a maliciously modified version of Anthropic's Claude Code extension, version 2.1.313, was available in the Cursor extension marketplace for about 11 hours. Cursor says the bad version was not developed by Anthropic, that at most 5,000 users were affected, and that it will contact them directly." },
  { q: "What does the malware do?", a: "According to Cursor and the researchers at OpenSourceMalware, it collects details about your computer (hostname, username, system, Git email, public IP and the names of environment variables), adds the attacker's SSH key, tries to switch on remote login and open a reverse SSH tunnel to the attacker, and sets itself up to restart in the background." },
  { q: "If I was affected, could the attacker get into my computer?", a: "Cursor says turning on the SSH service needs admin rights, which the extension does not have on most Macs and Windows PCs, so on those machines the attacker could not log in through the tunnel. It also says the attacker's server has been taken offline. The key and background scripts are still added, so follow the cleanup steps anyway." },
  { q: "I use the Claude Code CLI in the terminal, not the extension. Am I affected?", a: "Based on what Cursor and OpenSourceMalware have published, no: the problem was one specific extension package in the Cursor marketplace, and the @anthropic-ai/claude-code npm package was reported as clean. It is still worth running the one-line check if you aren't sure what you have installed." },
  { q: "Should I stop using Cursor or Claude Code?", a: "Not necessarily. This kind of supply-chain attack can happen to any extension or package. Both tools are still widely used; what matters is cleaning up if you were affected and adopting the habits above so the next one hurts less." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a className="underline" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to check if the malicious Claude Code extension (v2.1.313) affected your computer", description: g.description, totalTime: "PT2M",
      tool: ["Terminal or PowerShell"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["claude-code", "cursor", "mudroom", "opencode"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Was your Claude Code extension backdoored? How to check in 2 minutes (and keep AI coding extensions safe)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders. About a 4-minute read. Updated October 30, 2026.</p>
      <p>On October 29, 2026, a fake version of the <T s="claude-code">Claude Code</T> extension (version 2.1.313) was published to the <T s="cursor">Cursor</T> extension marketplace. If your editor installed it, it tried to plant a hidden way for an attacker to reach your computer. Cursor removed it the same day and published a <A href={NOTICE}>security notice</A>. Here is what to check, in plain English, plus the habits that make this kind of attack much less scary.</p>

      <H2>What to do, step by step</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="check">The 2-minute check</H2>
      <p>These are the commands from Cursor&apos;s notice. They only <i>read</i> one file and change nothing. On a Mac, open the Terminal app and paste:</p>
      <Code>{'grep -qs svc-telemetry ~/.ssh/authorized_keys && echo "svc-telemetry key found" || echo "No key found; machine not impacted"'}</Code>
      <p>On Windows, open PowerShell and paste:</p>
      <Code>{'$files = "$HOME\\.ssh\\authorized_keys", "C:\\ProgramData\\ssh\\administrators_authorized_keys" | Where-Object { Test-Path $_ }\nif ($files -and (Select-String svc-telemetry $files)) { "svc-telemetry key found" } else { "No key found; machine not impacted" }'}</Code>
      <p>The Mac command also works on Linux. If you see <b>&quot;svc-telemetry key found&quot;</b>, disconnect from the internet and follow the cleanup steps and scripts in <A href={NOTICE}>Cursor&apos;s notice</A>. Other signs listed there include a LaunchAgent called <code>com.apple.sysmond</code> on Mac (it is not an Apple file) or a scheduled task called <code>SysMon</code> on Windows.</p>

      <H2 id="habits">6 habits that keep AI coding extensions safe</H2>
      <ul className="list-disc space-y-2 pl-6">{habits.map((x) => <li key={x.h}><b>{x.h}.</b> {x.t}</li>)}</ul>
      <p>The sandbox habit is the big one for agents. Our guide to <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">running AI coding agents in a sandbox</Link> shows how to do it for free with <T s="mudroom">Mudroom</T>. If you prefer working in the terminal, the Claude Code CLI or an open-source agent like <T s="opencode">OpenCode</T> avoids editor extensions altogether.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Only Claude Code extension v2.1.313 from the Cursor marketplace (Oct 29, 2026) was reported as malicious.</li><li>Run the one-line check; &quot;No key found&quot; means you&apos;re fine.</li><li>If it&apos;s found: disconnect, run Cursor&apos;s cleanup script, and rotate keys from another computer.</li></ul>
      <p className="text-sm text-gray-500">Sources: <A href={NOTICE}>Cursor security notice (Oct 29, 2026)</A> and <A href="https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor">OpenSourceMalware analysis</A>. This page is general guidance, not professional incident response; if you run a company, involve your security team. More safety reading: our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link> and <Link className="underline" href="/use-case/coding-agents">the best AI coding agents</Link>.</p>
    </article>
  );
}
