import { ImageResponse } from "next/og";
import { getEntrant } from "@/data/madness";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Madness matchup";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [x, y] = (await params).slug.split("-vs-");
  const a = x ? getEntrant(x) : undefined;
  const b = y ? getEntrant(y) : undefined;
  const side = (name: string, seed: number, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 460 }}>
      <div style={{ fontSize: 30, color: "#9ca3af" }}>{`SEED ${seed}`}</div>
      <div style={{ fontSize: name.length > 14 ? 60 : 76, fontWeight: 800, color, textAlign: "center" }}>{name}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 56, background: "linear-gradient(135deg, #0b0b14 0%, #1e1240 55%, #062a33 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#c4b5fd" }}>AI MADNESS 2026 · CODING AGENT BRACKET</div>
        {a && b ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            {side(a.name, a.seed, "#ddd6fe")}
            <div style={{ fontSize: 56, fontWeight: 800, color: "#6b7280", margin: "0 20px" }}>VS</div>
            {side(b.name, b.seed, "#a5f3fc")}
          </div>
        ) : (
          <div style={{ fontSize: 72, fontWeight: 800 }}>32 tools. 1 champion.</div>
        )}
        <div style={{ display: "flex", fontSize: 32, color: "#e5e7eb" }}>Vote now at BuildStack · no login needed</div>
      </div>
    ),
    size,
  );
}
