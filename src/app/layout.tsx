import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeToggle } from "@/presentation/components/ui/ThemeToggle";
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import { strings } from "@/presentation/strings";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: strings.app.title,
  description: strings.app.tagline,
};

// Runs synchronously before paint: applies a saved theme with no flash and no
// hydration mismatch (see docs/preventing-flash-before-hydration).
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <NuqsAdapter>
          <QueryProvider>
            <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-6">
              <header className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                    {strings.app.title}
                  </h1>
                  <p className="mt-1 max-w-prose text-sm text-muted">{strings.app.tagline}</p>
                </div>
                <ThemeToggle />
              </header>
              <main className="flex-1">{children}</main>
              <footer className="mt-10 border-t border-border pt-4 text-center text-xs text-muted">
                Data from the Rick and Morty API · Built with Next.js
              </footer>
            </div>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
