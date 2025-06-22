// app/products/[slug]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import productosData from "@/data/productos.json";
import { ProductDetail } from "@/components/ProductDetail";
import { slugify } from "@/utils/string";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = productosData.products.find(
    (p) => slugify(p.name) === slug
  );

  if (!product) {
    return <p className="p-8 text-center">Producto no encontrado</p>;
  }

  return <ProductDetail product={product} />;
}
