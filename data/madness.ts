// AI Madness 2026: a 32-tool coding agents bracket.
// Seeding signals were captured on 2026-10-19 and are frozen here so seeds never move mid-tournament.
//
// Seed score = GitHub stars of the tool's official repo
//            + followers of the tool's own X account (or a maker account whose brand IS the product)
//            + 2,000 points per mention in the BuildStack MCP & Skills Top 100 (week of 2026-10-19)
// General chatbot / parent-company accounts (@claudeai, @OpenAIDevs, @github, @jetbrains, @grok,
// @Alibaba_Qwen, @Kimi_Moonshot, @MistralAI, @charmcli) are NOT counted, because their followers
// aren't specific to the coding tool. Highest score = seed 1. Ties would go to more GitHub stars.

export type Entrant = {
  slug: string; // matches a tool slug in data/tools.ts
  name: string;
  maker: string;
  handle: string; // X handle to tag in posts (verified on 2026-10-19)
  repo?: string;
  stars: number;
  account?: string; // X account counted for seeding
  followers: number;
  top100Mentions: number;
};

export const SEEDING_SNAPSHOT = "2026-10-19";
export const MENTION_POINTS = 2000;

const raw: Entrant[] = [
  { slug: "cursor", name: "Cursor", maker: "Anysphere (SpaceX/xAI)", handle: "cursor_ai", repo: "cursor/cursor", stars: 33283, account: "cursor_ai", followers: 491233, top100Mentions: 18 },
  { slug: "opencode", name: "OpenCode", maker: "Anomaly", handle: "opencode", repo: "anomalyco/opencode", stars: 217645, account: "opencode", followers: 217831, top100Mentions: 7 },
  { slug: "claude-code", name: "Claude Code", maker: "Anthropic", handle: "claudeai", repo: "anthropics/claude-code", stars: 152567, followers: 0, top100Mentions: 67 },
  { slug: "replit", name: "Replit Agent", maker: "Replit", handle: "Replit", stars: 0, account: "Replit", followers: 239852, top100Mentions: 0 },
  { slug: "antigravity", name: "Google Antigravity", maker: "Google DeepMind", handle: "antigravity", stars: 0, account: "antigravity", followers: 199505, top100Mentions: 10 },
  { slug: "openai-codex", name: "OpenAI Codex", maker: "OpenAI", handle: "OpenAIDevs", repo: "openai/codex", stars: 129928, followers: 0, top100Mentions: 39 },
  { slug: "devin", name: "Devin", maker: "Cognition", handle: "cognition", stars: 0, account: "cognition", followers: 191328, top100Mentions: 2 },
  { slug: "gemini-cli", name: "Gemini CLI", maker: "Google", handle: "geminicli", repo: "google-gemini/gemini-cli", stars: 107456, account: "geminicli", followers: 51679, top100Mentions: 12 },
  { slug: "zed", name: "Zed", maker: "Zed Industries", handle: "zeddotdev", repo: "zed-industries/zed", stars: 91929, account: "zeddotdev", followers: 85500, top100Mentions: 0 },
  { slug: "lovable", name: "Lovable", maker: "Lovable", handle: "Lovable", stars: 0, account: "Lovable", followers: 159471, top100Mentions: 0 },
  { slug: "cline", name: "Cline", maker: "Cline Bot Inc.", handle: "cline", repo: "cline/cline", stars: 70561, account: "cline", followers: 81425, top100Mentions: 1 },
  { slug: "bolt", name: "Bolt.new", maker: "StackBlitz", handle: "boltdotnew", repo: "stackblitz/bolt.new", stars: 16574, account: "boltdotnew", followers: 123402, top100Mentions: 0 },
  { slug: "warp", name: "Warp", maker: "Warp", handle: "warpdotdev", repo: "warpdotdev/warp", stars: 65550, account: "warpdotdev", followers: 59104, top100Mentions: 0 },
  { slug: "v0", name: "v0", maker: "Vercel", handle: "v0", stars: 0, account: "v0", followers: 116975, top100Mentions: 0 },
  { slug: "openhands", name: "OpenHands", maker: "OpenHands (All Hands AI)", handle: "OpenHandsDev", repo: "OpenHands/OpenHands", stars: 91294, account: "OpenHandsDev", followers: 11685, top100Mentions: 0 },
  { slug: "goose", name: "goose", maker: "Agentic AI Foundation (started at Block)", handle: "goose_oss", repo: "aaif-goose/goose", stars: 55444, account: "goose_oss", followers: 13656, top100Mentions: 0 },
  { slug: "factory-droid", name: "Factory Droid", maker: "Factory", handle: "FactoryAI", repo: "Factory-AI/factory", stars: 58, account: "FactoryAI", followers: 57612, top100Mentions: 2 },
  { slug: "rork", name: "Rork", maker: "Rork", handle: "rork", stars: 0, account: "rork", followers: 59181, top100Mentions: 0 },
  { slug: "kilo-code", name: "Kilo Code", maker: "Kilo (Anaconda)", handle: "kilocode", repo: "Kilo-Org/kilocode", stars: 27662, account: "kilocode", followers: 29330, top100Mentions: 0 },
  { slug: "aider", name: "Aider", maker: "Paul Gauthier & contributors", handle: "paulgauthier", repo: "Aider-AI/aider", stars: 49644, followers: 0, top100Mentions: 1 },
  { slug: "trae", name: "TRAE", maker: "ByteDance", handle: "Trae_ai", stars: 0, account: "Trae_ai", followers: 43845, top100Mentions: 0 },
  { slug: "github-copilot", name: "GitHub Copilot", maker: "GitHub (Microsoft)", handle: "github", repo: "github/copilot-cli", stars: 11274, account: "GitHubCopilot", followers: 17398, top100Mentions: 6 },
  { slug: "base44", name: "Base44", maker: "Base44 (Wix)", handle: "Base44", stars: 0, account: "Base44", followers: 39243, top100Mentions: 0 },
  { slug: "emergent", name: "Emergent", maker: "Emergent Labs", handle: "emergentlabs", stars: 0, account: "emergentlabs", followers: 29237, top100Mentions: 0 },
  { slug: "crush", name: "Crush", maker: "Charm", handle: "charmcli", repo: "charmbracelet/crush", stars: 28708, followers: 0, top100Mentions: 0 },
  { slug: "qwen-code", name: "Qwen Code", maker: "Alibaba Qwen", handle: "Alibaba_Qwen", repo: "QwenLM/qwen-code", stars: 28586, followers: 0, top100Mentions: 0 },
  { slug: "amp", name: "Amp", maker: "Amp (spun out of Sourcegraph)", handle: "AmpCode", stars: 0, account: "AmpCode", followers: 28528, top100Mentions: 0 },
  { slug: "grok-build", name: "Grok Build", maker: "xAI (SpaceX)", handle: "grok", repo: "xai-org/grok-build", stars: 27457, followers: 0, top100Mentions: 6 },
  { slug: "kiro", name: "Kiro", maker: "Amazon (AWS)", handle: "kirodotdev", repo: "kirodotdev/Kiro", stars: 4375, account: "kirodotdev", followers: 22309, top100Mentions: 0 },
  { slug: "mistral-vibe", name: "Mistral Vibe", maker: "Mistral AI", handle: "mistralvibe", repo: "mistralai/mistral-vibe", stars: 5155, account: "mistralvibe", followers: 9559, top100Mentions: 0 },
  { slug: "kimi-code", name: "Kimi Code", maker: "Moonshot AI", handle: "Kimi_Moonshot", repo: "MoonshotAI/kimi-code", stars: 7936, followers: 0, top100Mentions: 1 },
  { slug: "junie", name: "Junie", maker: "JetBrains", handle: "junie_ai", repo: "JetBrains/junie", stars: 489, account: "junie_ai", followers: 508, top100Mentions: 0 },
];

export const seedScore = (e: Entrant) => e.stars + e.followers + MENTION_POINTS * e.top100Mentions;

export type SeededEntrant = Entrant & { seed: number; score: number };

export const entrants: SeededEntrant[] = [...raw]
  .map((e) => ({ ...e, score: seedScore(e) }))
  .sort((a, b) => b.score - a.score || b.stars - a.stars)
  .map((e, i) => ({ ...e, seed: i + 1 }));

export const getEntrant = (slug: string) => entrants.find((e) => e.slug === slug);
export const entrantBySeed = (seed: number) => entrants.find((e) => e.seed === seed)!;
