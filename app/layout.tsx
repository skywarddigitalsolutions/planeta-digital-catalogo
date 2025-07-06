import type { Metadata } from "next";

import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { CartWidget } from "@/components/CartWidget";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ProductDetailModal } from "@/components/ProductDetailModal"; // 👈 Importar

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Planeta Digital",
  description:
    "Explorá nuestro catálogo completo de productos. Encontrá desde artículos para el hogar hasta herramientas, tecnología y mucho más. Descubrí todo lo que tenemos para vos, en un solo lugar.",
  openGraph: {
    title: "Planeta Digital",
    description:
      "Venta de todo tipo de productos. Tecnología, hogar, herramientas y más. Ingresá a nuestro catálogo online.",
    url: "https://www.planeta-digital.shop/",
    siteName: "Planeta Digital",
    images: [
      {
        url: "https://www.planeta-digital.shop/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Catálogo de Planeta Digital",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planeta Digital",
    description:
      "Descubrí cientos de productos: tecnología, hogar, herramientas y más.",
    images: ["https://www.planeta-digital.shop/images/logo.png"],
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <CartProvider>
          <Navbar />
          {children}
          <ScrollToTopButton />
          <CartWidget />
          <ProductDetailModal />
        </CartProvider>
      </body>
    </html>
  );
}
