import { ImageResponse } from "next/og";

export const alt = "Jaimin Panchal, AI Full Stack Developer / Project Manager at PrimeQA Solutions, Ahmedabad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card, generated at build time (no stock imagery). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0b0d", padding: 72, color: "#ecedef", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", right: -120, top: -120, width: 620, height: 620, borderRadius: 9999, background: "radial-gradient(closest-side, rgba(168,200,255,0.18), rgba(168,200,255,0.04), transparent)" }} />
        <div style={{ position: "absolute", right: 120, top: 90, width: 380, height: 380, borderRadius: 9999, border: "2px solid rgba(236,237,239,0.22)" }} />
        <div style={{ position: "absolute", right: 190, top: 160, width: 240, height: 240, borderRadius: 9999, border: "2px dashed rgba(168,200,255,0.35)" }} />
        <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>
          <span style={{ fontWeight: 700 }}>JAIMIN</span>
          <span style={{ color: "#a8c8ff", margin: "0 12px" }}>/</span>
          <span style={{ color: "#8c929b" }}>BEYOND CODE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.02, letterSpacing: -3, fontWeight: 700 }}>
          <span style={{ fontSize: 104 }}>JAIMIN PANCHAL</span>
          <span style={{ fontSize: 44, letterSpacing: -1, fontWeight: 500, color: "#8c929b", marginTop: 18 }}>AI Full Stack Developer / Project Manager</span>
        </div>
        <div style={{ fontSize: 26, color: "#8c929b" }}>PrimeQA Solutions, Ahmedabad, India. I build digital products. I think beyond code.</div>
      </div>
    ),
    size,
  );
}
