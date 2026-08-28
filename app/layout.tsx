import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VedaAI — AI Teacher's Toolkit",
  description:
    "Upload a question paper and a handwritten answer sheet. VedaAI extracts questions, maps answers, highlights exact regions, and drafts AI feedback.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-page font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
