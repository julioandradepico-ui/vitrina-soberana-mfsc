import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vitrina de Forestería Comunitaria — Bosques Comunitarios de Colombia",
  description:
    "Repositorio comercial soberano de la Mesa Nacional de Manejo Forestal Sostenible Comunitario. Conecta directamente con 30+ asociaciones forestales y agroforestales de 16 departamentos.",
  openGraph: {
    title: "Vitrina de Forestería Comunitaria — Bosques Comunitarios de Colombia",
    description:
      "Madera legal certificada, frutos amazónicos, aceites, miel de meliponas, artesanías y restauración ecológica directo de las comunidades.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-sand text-bark antialiased pb-20 md:pb-0">
        <MarketplaceProvider>
          <Navigation />
          {children}
          <CartDrawer />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
