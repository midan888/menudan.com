import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ui/Toaster";
import { CookieBanner } from "@/components/ui/CookieBanner";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Digital Menus for Restaurants`,
    template: `%s — ${APP_NAME}`,
  },
  description:
    "Create your restaurant menu online in minutes with AI-powered photo extraction and automatic translations. Get a QR code for table placement.",
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — Digital Menus for Restaurants`,
    description:
      "Create your restaurant menu online in minutes with AI-powered photo extraction and automatic translations. Get a QR code for table placement.",
    url: APP_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Digital Menus for Restaurants`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Digital Menus for Restaurants`,
    description:
      "Create your restaurant menu online in minutes with AI-powered photo extraction and automatic translations. Get a QR code for table placement.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {children}
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
