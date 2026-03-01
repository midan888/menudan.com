import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuForYou — Digital Menus for Restaurants",
  description:
    "Put your restaurant menu online in under 5 minutes. Get a QR code for table placement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
