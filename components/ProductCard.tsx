import React from "react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/string";

export interface Product {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Limitar la descripción
  const snippet =
    product.description.length > 100
      ? product.description.slice(0, 100) + "..."
      : product.description;

  const slug = slugify(product.name);

  return (
    <Link href={`/products/${slug}`} passHref>
      <article className="flex flex-col h-full border rounded-md shadow-sm hover:shadow-md transition-shadow bg-white">
        {/* Imagen con altura fija */}
        <div className="relative w-full h-48 md:h-56 lg:h-64 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 200px"
            priority={false}
          />
        </div>

        {/* Contenido que ocupa el resto */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
          <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500 uppercase">{product.category}</p>
          <p className="font-bold mt-1 text-gray-800">{product.price}</p>

          {/* Descripción al final */}
          <p className="hidden md:block mt-auto text-gray-700 text-sm">
            {snippet}
          </p>
        </div>
      </article>
    </Link>
  );
};
