import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("test-aws-code-locally-with-your-ai-agent")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Keep your real AWS keys away from the agent", text: "Before anything else, make sure the terminal your agent uses has no real AWS credentials in it. Unset AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN and AWS_PROFILE, so a test can never create, change or delete something in your real account." },
  { name: "Install AWS Emulator", text: "Install Amazon's free AWS Emulator: the Linux package, or a small Docker image on macOS and Windows. Or install the aws-emulator agent skill and ask Claude Code, Cursor or Kiro to set it up for you. No AWS account is needed." },
  { name: "Point your project at the emulator", text: "Set a handful of environment variables (endpoint, the emulator's own credentials file, config and certificate) in the same script that runs your tests. Your code stays unchanged; the AWS SDK and CLI simply talk to your laptop instead of AWS." },
  { name: "Let the agent build, test and fix in a loop", text: "Ask your agent to create the tables, buckets and queues it needs, run your tests against the emulator and fix what fails. Each call comes back in milliseconds and nothing is billed, so the agent can try as often as it needs. Run one emulator per agent so parallel agents don't see each other's data." },
  { name: "Verify \"done\", then do one real test before production", text: "Check the agent's claim that tests pass (AgentMon Live's Done Gate does this for Claude Code). Then remember what the emulator can't do: it doesn't check IAM permissions like AWS, and some operations aren't supported yet. Run a final test on a real AWS dev account before you go live." },
];
const faq = [
  { q: "Is AWS Emulator really free?", a: "Yes. Amazon says it has no service fee and doesn't need an AWS account; you only pay for real AWS resources when you deploy. The source code is on GitHub under the CC0 1.0 public-domain dedication (third-party code in its vendor folder is Apache-2.0). It became generally available on November 11, 2026." },
  { q: "Which AWS services does it support?", a: "Services that have a published AWS API model, the same models behind the AWS SDKs, such as DynamoDB and S3. How closely each one matches AWS varies, so check the fidelity scores published with each release on the GitHub releases page. Operations it doesn't support yet return 501 Not Implemented instead of pretending to work." },
  { q: "Can my agent break anything real with it?", a: "Not if you follow step 1. The emulator only accepts requests signed with keys it generates itself, and listens only on your own computer by default. The risk is a shell that still has real credentials and no AWS_ENDPOINT_URL set, because then your code talks to real AWS. Set the variables in the same script that runs your tests." },
  { q: "Can I use it to test my security settings?", a: "No. AWS says not to. The emulator doesn't evaluate IAM and resource policies the way AWS does, so a request AWS would deny can succeed locally. Test permissions on a real AWS dev account." },
  { q: "Does it collect data?", a: "It sends anonymous usage telemetry by default (never your requests, code or credentials, per AWS). Turn it off with aws-emulator --telemetry off, the environment variable EMULATOR_TELEMETRY=off, or a setting in ~/.aws/emulator/config.toml." },
  { q: "I don't use AWS. Is this for me?", a: "Probably not. If your backend is Supabase, Firebase or a similar service, test against a separate dev project instead. Our guide to stopping your agent from deleting your database walks through that setup." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to let your AI coding agent test AWS code on your laptop with AWS Emulator", description: g.description, totalTime: "PT20M",
      tool: ["AWS Emulator", "AWS CLI", "Docker", "Claude Code", "AgentMon Live"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["aws-emulator", "agentmon-live", "mudroom", "kiro"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to let your AI coding agent test AWS code on your laptop (free, no AWS account or surprise bill)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders building on AWS. About a 6-minute read. Updated November 12, 2026.</p>
      <p>Letting <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T> or <T s="kiro">Kiro</T> loose on your AWS account is scary: every test can create real resources, cost real money, or touch real data, and every deploy to check a fix takes minutes. On November 11, 2026, Amazon released a free fix: <T s="aws-emulator">AWS Emulator</T>, a copy of the AWS APIs that runs on your own computer. Your agent makes the same calls it would make to AWS, gets answers in milliseconds, and nothing real is touched. Here is the routine.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="keys">Step 1: Clear real AWS keys from the terminal</H2>
      <p>Environment variables beat config files, so a leftover real key wins over the emulator&apos;s keys. In the terminal where your agent or tests run (macOS and Linux):</p>
      <Code>{"unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE"}</Code>
      <p>If you keep real keys in <code>~/.aws/credentials</code>, the next step points your tools at a different file, so they won&apos;t be used. For extra safety, run the agent in a sandbox like <T s="mudroom">Mudroom</T>, which only lets it reach the hosts you allow.</p>

      <H2 id="install">Step 2: Install AWS Emulator</H2>
      <p><b>Easiest: let your agent do it.</b> With the AWS CLI version 2.35.0 or later, install AWS&apos;s skill for the coding agents on your machine (Kiro, Cursor, Claude Code and others), then ask in plain words. The skill asks before it runs <code>sudo</code> or edits your shell profile.</p>
      <Code>{"aws --version          # needs 2.35.0 or later\naws agent-toolkit add-skill --skill-name aws-emulator --region us-east-1\n\n# then ask your agent:\nInstall AWS Emulator and point my project at it."}</Code>
      <p><b>On Linux by hand</b> (Amazon Linux, Fedora and other RPM systems; a Debian package is also available, see AWS&apos;s Linux guide):</p>
      <Code>{"PKG=https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest\nsudo dnf install -y $PKG/aws-emulator-x86_64.rpm\naws-emulator            # serves https://127.0.0.1:9297"}</Code>
      <p><b>On macOS or Windows</b>, AWS doesn&apos;t publish a ready-made image, so you build a small one with Docker. Put this in a file named <code>Dockerfile</code> in an empty folder (on Apple silicon Macs, change <code>x86_64</code> to <code>aarch64</code>):</p>
      <Code>{"FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal\nADD https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest/aws-emulator-x86_64.rpm /tmp/aws-emulator.rpm\nRUN rpm -i /tmp/aws-emulator.rpm && rm /tmp/aws-emulator.rpm \\\n && mkdir -p /home/emulator && chown 1000 /home/emulator\nUSER 1000\nENV HOME=/home/emulator\nEXPOSE 9297\nENTRYPOINT [\"aws-emulator\", \"-b\", \"0.0.0.0\"]"}</Code>
      <Code>{"docker build -t aws-emulator .\nmkdir -p ~/.aws/emulator\nPORT=9297\ndocker run --rm --memory=2g --memory-swap=2g -p 127.0.0.1:$PORT:$PORT \\\n  -e HOME=\"$HOME\" -v \"$HOME/.aws/emulator:$HOME/.aws/emulator\" \\\n  aws-emulator -p $PORT"}</Code>
      <p>Keep the <code>127.0.0.1:</code> part of <code>-p</code>; without it, other computers on your network can reach the emulator. Add <code>--telemetry off</code> at the end if you don&apos;t want it to send anonymous usage data.</p>

      <H2 id="point">Step 3: Point your project at it</H2>
      <p>When the emulator starts, it writes fresh keys, a config file and a certificate to <code>~/.aws/emulator/9297/</code>. Put these lines at the top of the script that runs your tests (macOS and Linux):</p>
      <Code>{"export AWS_ENDPOINT_URL=https://127.0.0.1:9297\nexport AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/9297/emulator_credentials\nexport AWS_CONFIG_FILE=~/.aws/emulator/9297/config\nexport AWS_CA_BUNDLE=~/.aws/emulator/9297/ca.pem\nexport AWS_EC2_METADATA_DISABLED=true\nexport AWS_DISABLE_HOST_PREFIX_INJECTION=true\nexport AWS_REGION=us-east-1\nexport AWS_DEFAULT_REGION=us-east-1\n\n# optional: check it's up (prints ok)\ncurl --cacert ~/.aws/emulator/9297/ca.pem https://127.0.0.1:9297/__admin/health"}</Code>
      <p>Your code doesn&apos;t change: the AWS SDK reads these variables, so it needs no endpoint or keys in your code. <code>AWS_CA_BUNDLE</code> covers the AWS CLI, Python (Boto3) and Go; other SDKs, such as Java, need one extra setting to trust the certificate, listed in AWS&apos;s &quot;Pointing your AWS SDK at AWS Emulator&quot; page.</p>

      <H2 id="loop">Step 4: Give your agent the loop</H2>
      <p>Now paste something like this into your agent:</p>
      <Code>{"Use the local AWS Emulator (env vars are in scripts/test-local.sh) for all AWS calls.\nNever use real AWS credentials. Create the DynamoDB tables and S3 buckets the app\nneeds, run the test suite, and fix failures until every test passes.\nShow me the final test output."}</Code>
      <p>The emulator keeps everything in memory and forgets it when you stop it, so each run starts clean. Running several agents at once, say in separate git worktrees? Start one emulator per agent on a different port (change the port in all three places of the Docker command, and in the variables), and they&apos;ll never overwrite each other&apos;s data. Our guide to <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">running AI coding agents in parallel</Link> covers the worktree side.</p>

      <H2 id="verify">Step 5: Check &quot;done&quot;, then test once on real AWS</H2>
      <p>Agents sometimes say &quot;all tests pass&quot; when they didn&apos;t run them. If you use Claude Code, <T s="agentmon-live">AgentMon Live</T> (free, Apache-2.0, from Codenotary) shows each tool call live and its Done Gate sends Claude back when tests failed or went stale:</p>
      <Code>{"/plugin install agentmon-live --marketplace codenotary/agentmon-live"}</Code>
      <p>Then know the emulator&apos;s limits. It does <b>not</b> check IAM permissions like AWS does, so a request AWS would deny can work locally. Each copy acts as one account in one region. How closely each service matches AWS varies, so look up the fidelity scores on the <a className="underline" href="https://github.com/aws/aws-emulator/releases" rel="noopener" target="_blank">AWS Emulator releases page</a> for the services you use. Before production, deploy once to a separate AWS dev account and run your tests there, with a person approving the merge (see <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keeping AI code behind a quality gate</Link>).</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Clear real AWS keys from the agent&apos;s terminal, then install the free AWS Emulator (or its agent skill).</li><li>Set the emulator&apos;s environment variables in the same script that runs your tests, and let the agent build, test and fix in a fast loop.</li><li>Verify the agent&apos;s &quot;done&quot;, and run one real test on an AWS dev account before production.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop your AI agent deleting your database</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run AI coding agents in a sandbox</Link>, <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>, <Link className="underline" href="/use-case/deployment-backend">best deployment and backend tools</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
