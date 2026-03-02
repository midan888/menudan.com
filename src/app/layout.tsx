import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "qarta.dev — Digital Menus for Restaurants",
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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
