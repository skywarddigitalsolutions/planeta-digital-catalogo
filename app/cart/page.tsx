"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Helper para convertir strings de precio argentinos ("$39.900,00") a número (39900)
function parsePrice(price: string): number {
  const cleaned = price
    .replace(/[^0-9.,]/g, "")  // sólo números, puntos y comas
    .replace(/\./g, "")        // quita puntos de miles
    .replace(/,/g, ".");       // coma decimal → punto
  return parseFloat(cleaned);
}

export default function CartPage() {
  const [observation, setObservation] = useState("");
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Cálculo del total
  const total = cartItems.reduce((sum, item) => {
    const unit = parsePrice(item.price);
    const qty = item.quantity || 1;
    return sum + unit * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-white pt-16 px-4 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b py-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-700 hover:text-gray-900">
          <FaArrowLeft />
        </button>
        <span className="font-bold text-black">Total de productos: {cartItems.length}</span>
        <button onClick={clearCart} className="text-red-600 hover:text-red-800">
          <FaTrash />
        </button>
      </div>

      {/* GRID: mobile 1col, desktop 2col */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT: Lista de ítems */}
        <div className="space-y-6">
          {cartItems.map((item) => {
            const unit = parsePrice(item.price);
            const qty = item.quantity || 1;
            const lineTotal = unit * qty;

            return (
              <div key={item.name} className="flex gap-4 items-start">
                {/* Miniatura */}
                <div className="w-20 h-20 relative rounded border overflow-hidden flex-shrink-0">
                  <Image
                    src={item.images?.[0] ?? item.image ?? "/images/no-image.png"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {/* Detalle */}
                <div className="flex-1 flex flex-col">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">Cantidad:</p>
                  <select
                    value={qty}
                    onChange={(e) =>
                      updateQuantity(item.name, parseInt(e.target.value, 10))
                    }
                    className="mt-1 w-20 border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Precio y eliminar */}
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-gray-800">
                    {lineTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Resumen */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
          <div className="mt-auto">
            <p className="text-lg font-bold mb-4 text-black">VALOR TOTAL:</p>
            <p className="text-2xl font-semibold text-gray-800 mb-8">
              {total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
            </p>

            {/* Comprar por WhatsApp */}
            <a
              href={`https://wa.me/2271438717?text=${encodeURIComponent(
                `¡Hola! 👋\nMe gustaría hacer el siguiente pedido:\n\n` +
                  cartItems
                    .map((p, i) => {
                      const unit = parsePrice(p.price);
                      const qty = p.quantity || 1;
                      const line = unit * qty;
                      return (
                        `${i + 1}. ${p.name}\n` +
                        `   • Cantidad: ${qty}\n` +
                        `   • Subtotal: ${line.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}`
                      );
                    })
                    .join("\n\n") +
                  (observation ? `\n\nObservación:\n${observation}` : "") +
                  `\n\n*Total: ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}*`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white text-center rounded py-3 hover:bg-green-700 transition"
            >
              Comprar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
