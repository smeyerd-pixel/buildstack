export type Category = { slug: string; name: string; description: string };
export const categories: Category[] = [
  { slug: "coding-agents", name: "Coding Agents", description: "AI pair programmers and autonomous agents that write, refactor and ship code." },
  { slug: "app-builders", name: "App Builders", description: "Prompt-to-app tools that turn a description into a working web or mobile app." },
  { slug: "ui-design", name: "UI & Design", description: "Generate interfaces, components and design assets with AI." },
  { slug: "video", name: "Video", description: "Text-to-video, avatars and AI video editing." },
  { slug: "voice", name: "Voice & Audio", description: "Text-to-speech, voice cloning, transcription and music." },
  { slug: "image", name: "Image", description: "Image generation and editing models and apps." },
  { slug: "research", name: "Research & Search", description: "AI search engines and research assistants." },
  { slug: "automation-agents", name: "Automation & Agents", description: "Workflow automation and agent frameworks." },
  { slug: "llm-apis", name: "LLM APIs", description: "Model providers and gateways to build AI features." },
  { slug: "deployment-backend", name: "Deployment & Backend", description: "Hosting, databases, auth and infra for shipping AI apps." },
];
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
