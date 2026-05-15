import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bot Viewer - Lihat Website Seperti Bot Crawler",
  description: "Lihat bagaimana bot crawler (Googlebot, Facebook, Twitter, dll) melihat website Anda. Debug SEO dan Open Graph tags dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
