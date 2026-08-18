import type { Metadata } from "next";
import { Inter, Syne, Playfair_Display, Fraunces, Oswald } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { db } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HATTO",
  description: "Curated product discovery site",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.siteSettings.findFirst();
  
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${playfair.variable} ${fraunces.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
      {settings?.ga4MeasurementId && <GoogleAnalytics gaId={settings.ga4MeasurementId} />}
    </html>
  );
}
