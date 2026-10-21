// `tools` = directory slugs the guide features; tool pages link back to guides that feature them.
export type Guide = { slug: string; title: string; description: string; date: string; tools?: string[] };
export const guides: Guide[] = [
  { slug: "use-a-github-repo", title: "How to use someone else's GitHub repo (a plain-English guide for beginners)", description: "What a GitHub repo is, the 3 ways people actually use them, a real walkthrough installing Anthropic's skills into Claude Code, and how to tell if a repo is safe to trust.", date: "2026-10-16", tools: ["claude-code"] },
  { slug: "check-ai-code-before-you-ship", title: "How to check AI-written code before you ship it (a vibe coder's checklist)", description: "Your AI agent says \"done.\" A 6-step, plain-English checklist to prove it works and understand what it changed before you push, with free tools like Reticle and Sphinx.", date: "2026-10-21", tools: ["reticle", "sphinx", "claude-code", "cursor", "openai-codex", "devin", "github-copilot"] },
];
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const guidesForTool = (slug: string) => guides.filter((g) => g.tools?.includes(slug));
