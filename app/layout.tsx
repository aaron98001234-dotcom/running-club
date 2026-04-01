import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "火車嘟嘟嘟",
  description: "火車嘟嘟嘟社團網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
          <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="text-lg font-semibold text-zinc-900">
              火車嘟嘟嘟
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                首頁
              </Link>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                登入
              </Link>
              <Link
                href="/records"
                className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                紀錄
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
