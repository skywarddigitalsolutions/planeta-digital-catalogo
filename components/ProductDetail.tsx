// components/ProductDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { limpiarCentavos } from "@/utils/string";

export interface Product {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  images: string[];
}

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  // 🚀 Forzar scroll arriba al montar
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Preparar galería
  const imgs = product.images.length > 0 ? product.images : [product.image];
  const [idx, setIdx] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-4 mt-16 mb-10 md:mt-32">
      {/* Botón Volver */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
      >
        <FaArrowLeft /> Volver
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Slider */}
        <div className="lg:w-1/2">
          <div className="relative w-full h-72 sm:h-[400px] overflow-hidden select-none">
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {imgs.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full relative"
                >
                  <Image
                    src={src}
                    alt={`${product.name} imagen ${i + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === idx ? "bg-black" : "bg-black/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative w-20 h-20 rounded border ${
                  i === idx ? "border-blue-600" : "border-gray-300"
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Miniatura ${i + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Ficha de producto */}
        <div className="lg:w-1/2 bg-gray-50 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <p className="text-gray-500 font-semibold uppercase">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-gray-800">
              $ {limpiarCentavos(product.price)}
            </p>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-blue-800 text-white py-3 rounded text-center font-medium hover:bg-blue-900 transition"
          >
            <FaShoppingCart className="inline mr-2" /> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
