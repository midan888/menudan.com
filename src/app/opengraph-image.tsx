import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "qarta.app — Digital Menus for Restaurants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.app";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-1px",
            marginBottom: 24,
          }}
        >
          {APP_NAME}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Digital menus for restaurants — online in 5 minutes
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "rgba(255,255,255,0.5)",
            fontSize: 16,
          }}
        >
          <span>🍽️</span>
          <span>QR codes · AI extraction · 4 themes · 16 languages</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
