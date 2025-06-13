// components/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { slugify } from "@/utils/string";
import { useCart } from "@/context/CartContext";

export interface Product {
  name: string;
  category: string;
  subcategory?: string;
  price: string;
  description?: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const snippet = product.description
    ? product.description.length > 100
      ? product.description.slice(0, 100).trim() + "..."
      : product.description
    : "";

  const slug = slugify(product.name);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/products/${slug}`} passHref>
      <article className="relative bg-white rounded-lg shadow flex items-start">
        {/* Imagen con contenedor fijo */}
        <div className="w-48 aspect-square flex-shrink-0 relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
          />
          {/* Botón “+” funcional */}
          <button
            onClick={handleAdd}
            aria-label="Añadir al carrito"
            className="
              absolute
              bottom-4 right-4
              w-10 h-10 rounded-full
              bg-gray-800 text-white
              flex items-center justify-center
              shadow-lg
            "
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido textual */}
        <div className="flex-1 px-6 py-4">
          <h4 className="product_title__t7dLU font-semibold text-base text-gray-800 leading-snug">
            {product.name}
          </h4>

          <div className="mt-1 space-y-0">
            <p className="product_category__MfZs_ text-xs text-gray-500 uppercase">
              {product.category}
            </p>
            {product.subcategory && (
              <p className="text-xs text-gray-500 uppercase">
                {product.subcategory}
              </p>
            )}
          </div>

          <p className="product_price__hgX1S font-bold text-base text-gray-800 mt-2">
            {product.price}
          </p>

          {snippet && (
            <p className="product_description__C_5ER text-sm text-gray-700 mt-2 line-clamp-2">
              {snippet}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};
