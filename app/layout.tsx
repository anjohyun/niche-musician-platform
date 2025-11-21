import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Niche Musician Platform - 당신만의 음악 정체성을 찾아서",
  description: "고품질 뮤지션을 위한 큐레이션 플랫폼. AI 도구를 활용하여 당신만의 니치를 발견하고 진정한 팬과 연결되세요.",
  keywords: ["music", "musician", "niche", "AI", "education", "premium"],
  authors: [{ name: "Niche Musician Platform" }],
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Niche Musician Platform",
    description: "고품질 뮤지션을 위한 큐레이션 플랫폼",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-forest-50 to-sage-50 dark:from-sage-900 dark:via-forest-700 dark:to-sage-800">
          {children}
        </div>
      </body>
    </html>
  );
}
