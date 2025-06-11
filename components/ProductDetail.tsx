"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useSwipeable } from "react-swipeable";

interface Product {
  name: string;
  category: string;
  price: string;
  description: string;
  images: string[];
}

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  // Detectar desktop
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setIdx((i) => Math.min(i + 1, product.images.length - 1)),
    onSwipedRight: () => setIdx((i) => Math.max(i - 1, 0)),
    trackMouse: true,
  });

  // Descripción truncada
  const fullDesc = product.description;
  const snippet =
    fullDesc.length > 300 ? fullDesc.slice(0, 300).trim() + "…" : fullDesc;

  return (
    <div className="max-w-6xl mx-auto p-4 mt-16 mb-10 md:mt-32 ">
      {/* Volver */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-gray-700 hover:text-gray-900 font-semibold"
      >
        <FaArrowLeft /> Volver
      </button>

      {/* Contenedor: mobile = columna, desktop = fila */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Slider + miniaturas */}
        <div className="lg:w-1/2">
          <div
            {...handlers}
            className="relative w-full h-72 sm:h-[400px] overflow-hidden select-none"
          >
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {product.images.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full h-full relative">
                  <Image
                    src={img}
                    alt={`${product.name} imagen ${i + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    priority={i === idx}
                  />
                </div>
              ))}
            </div>
            {/* Indicadores */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === idx ? "bg-black" : "bg-black/50"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Miniaturas */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`relative w-20 h-20 rounded border ${
                  i === idx ? "border-blue-600" : "border-gray-300"
                }`}
                onClick={() => setIdx(i)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={img}
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
            <p className="text-gray-500 font-semibold uppercase">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-gray-800">{product.price}</p>
            <hr className="my-4 border-gray-300" />

            {/* Descripción con toggle solo en desktop */}
            <p className="text-gray-700 leading-relaxed">
              {!expanded ? snippet : fullDesc}
            </p>
            {fullDesc.length > 300 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-2 text-blue-600 hover:underline"
              >
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-blue-800 text-white py-3 rounded text-center font-medium hover:bg-blue-900 transition"
          >
            <FaShoppingCart className="inline mr-2" /> Añadir producto
          </button>
        </div>
      </div>
    </div>
  );
};
