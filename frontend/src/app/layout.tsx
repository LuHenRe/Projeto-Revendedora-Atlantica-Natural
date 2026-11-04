import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/infrastructure/query/QueryProvider";
import { ThemeProvider } from "@/presentation/context/ThemeContext";
import { VitrineProvider } from "@/presentation/context/VitrineContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Vitrine Virtual | Atlântica Natural - Hub de Curadoria & Bem-Estar",
  description:
    "Catálogo e vitrine de cosméticos, óleos essenciais e bem-estar da Atlântica Natural. Produtos com pronta-entrega local e pedidos diretos no WhatsApp.",
  keywords: [
    "Atlântica Natural",
    "Óleos Essenciais",
    "Cosméticos Naturais",
    "Bem-Estar",
    "Pronta Entrega",
    "Revendedora Autorizada",
  ],
  authors: [{ name: "Atlântica Natural Revendedora" }],
  other: {
    "color-scheme": "light dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased font-sans" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || ((!saved || saved === 'system') && prefersDark);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                  } else {
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                  }
                  var meta = document.querySelector('meta[name="color-scheme"]');
                  if (meta) {
                    meta.content = (!saved || saved === 'system') ? 'light dark' : (isDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200">
        <QueryProvider>
          <ThemeProvider>
            <VitrineProvider>{children}</VitrineProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
