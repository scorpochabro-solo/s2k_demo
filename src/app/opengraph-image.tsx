import { ImageResponse } from "next/og";

export const dynamic = "force-static"; // ponytail: нужно для output: export
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "S2K Studio";

// Корневой og-image. Латиница — рендерится без внешних шрифтов на любой платформе.
export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121212",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width="1056"
          height="120"
          viewBox="0 0 1056 120"
          style={{ position: "absolute", top: 250, left: 0 }}
        >
          <path
            d="M0 60 L300 60 Q340 60 340 30 L340 12 Q340 0 380 0 L1056 0"
            fill="none"
            stroke="#2E2D2A"
            strokeWidth="2"
          />
          <circle cx="340" cy="38" r="7" fill="#FF4D00" />
        </svg>

        <div style={{ display: "flex", fontSize: 28, color: "#8C8A84", letterSpacing: 6 }}>
          S2K STUDIO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, color: "#F2F0EB", lineHeight: 1 }}>
            S<span style={{ color: "#FF4D00" }}>2</span>K
          </div>
          <div style={{ fontSize: 40, color: "#F2F0EB", marginTop: 16, maxWidth: 900 }}>
            Digital products that move business forward
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8C8A84" }}>
          <span>s2k.studio</span>
          <span style={{ color: "#FF6A2B" }}>Nizhny Novgorod · RU</span>
        </div>
      </div>
    ),
    size,
  );
}
