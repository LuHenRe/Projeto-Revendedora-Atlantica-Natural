import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/infrastructure/query/QueryProvider";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <QueryProvider>
          <VitrineProvider>{children}</VitrineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
