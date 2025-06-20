import type { Metadata } from "next";

import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { CartWidget } from "@/components/CartWidget";
import { Navbar } from "@/components/Navbar";

import { CartProvider } from "@/context/CartContext";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Planeta digital",
  description: "Explorá nuestro catálogo completo de productos. Encontrá desde artículos para el hogar hasta herramientas, tecnología y mucho más. Descubrí todo lo que tenemos para vos, en un solo lugar.",
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
        </CartProvider>
      </body>
    </html>
  );
}
