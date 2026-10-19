import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AI Madness 2026: the coding agent bracket";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, background: "linear-gradient(135deg, #0b0b14 0%, #1e1240 55%, #062a33 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#c4b5fd" }}>AI MADNESS 2026</div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800 }}>The coding agent bracket</div>
        <div style={{ display: "flex", fontSize: 40, color: "#a5f3fc" }}>32 tools · 5 rounds · you pick the champion</div>
        <div style={{ display: "flex", fontSize: 30, color: "#9ca3af" }}>Round of 32 starts Mon Oct 26 · vote at BuildStack</div>
      </div>
    ),
    size,
  );
}
