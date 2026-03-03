import { redirect } from "next/navigation";
import Link from "next/link";
import { ClassicTheme } from "@/components/menu/themes/ClassicTheme";
import { ModernTheme } from "@/components/menu/themes/ModernTheme";
import { DarkTheme } from "@/components/menu/themes/DarkTheme";
import { BistroTheme } from "@/components/menu/themes/BistroTheme";
import { getDemoData, VALID_THEMES } from "@/lib/demo-data";
import type { Metadata } from "next";
import "@/components/menu/themes/fonts.css";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

const THEME_MAP = {
  classic: ClassicTheme,
  modern: ModernTheme,
  dark: DarkTheme,
  bistro: BistroTheme,
} as const;

const THEME_LABELS: Record<string, string> = {
  classic: "Classic",
  modern: "Modern",
  dark: "Dark",
  bistro: "Bistro",
};

interface PageProps {
  params: Promise<{ theme: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { theme } = await params;
  const label = THEME_LABELS[theme] || "Theme";
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalUrl = `${APP_URL}/demo/${theme}`;
  const title = `${label} Theme Demo — ${APP_NAME}`;
  const description = `Preview the ${label} menu theme. See how your restaurant menu will look with the ${label} design.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export function generateStaticParams() {
  return VALID_THEMES.map((theme) => ({ theme }));
}

export default async function DemoPage({ params }: PageProps) {
  const { theme } = await params;

  if (!VALID_THEMES.includes(theme as (typeof VALID_THEMES)[number])) {
    redirect("/");
  }

  const ThemeComponent = THEME_MAP[theme as keyof typeof THEME_MAP];
  const demoData = getDemoData(theme);

  return (
    <>
      {/* Floating back bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Link
          href="/#themes"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "14px",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <span
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "13px",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          {THEME_LABELS[theme]} Theme Preview
        </span>
        <Link
          href="/register"
          style={{
            color: "white",
            background: "rgba(255,255,255,0.2)",
            textDecoration: "none",
            fontSize: "13px",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          Try Free
        </Link>
      </div>
      {/* Spacer for fixed bar */}
      <div style={{ height: "44px" }} />
      <ThemeComponent {...demoData} />
    </>
  );
}
