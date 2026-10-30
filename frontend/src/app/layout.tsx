import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { QueryProvider } from "@/infrastructure/query/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
