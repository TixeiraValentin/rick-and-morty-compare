import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppHeader } from "@/presentation/components/feature/AppHeader";
import { QueryProvider } from "@/presentation/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rick & Morty · Comparador de Personajes",
  description: "Elegí un personaje en cada columna y compará qué episodios comparten.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <Suspense fallback={null}>
          <NuqsAdapter>
            <QueryProvider>
              <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:h-dvh lg:overflow-hidden">
                <AppHeader />
                <main className="min-h-0 flex-1">{children}</main>
              </div>
            </QueryProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
