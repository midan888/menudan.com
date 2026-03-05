import type { MetadataRoute } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} — Digital Menus for Restaurants`,
    short_name: APP_NAME,
    description:
      "Create your restaurant menu online in minutes with AI-powered photo extraction and automatic translations. Get a QR code for table placement.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon-192.png",
          sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
