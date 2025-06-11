"use client";

import { useParams } from "next/navigation";
import productosData from "@/data/productos.json";
import { ProductDetail } from "@/components/ProductDetail";

const slugify = (text: string) => 
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;

  const product = productosData.products.find(
    (p) => slugify(p.name) === slug
  );

  if (!product) return <p>Producto no encontrado</p>;
  
  return <ProductDetail product={product} onAddToCart={() => {}} />;
}
