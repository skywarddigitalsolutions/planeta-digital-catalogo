"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [observation, setObservation] = useState("");
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const total = cartItems.reduce((sum, item) => {
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return sum + priceNum * (item.quantity || 1);
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
            const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            const quantity = item.quantity || 1;
            const lineTotal = (priceNum * quantity).toFixed(2);

            return (
              <div key={item.name} className="flex gap-4 items-start">
                {/* Miniatura */}
                <div className="w-20 h-20 relative rounded border overflow-hidden flex-shrink-0">
                  <Image
                    src={item.images?.[0] ?? "/placeholder.png"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {/* Detalle */}
                <div className="flex-1 flex flex-col">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Cantidad:</p>
                  <select
                    value={quantity}
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
                  <p className="font-semibold text-gray-800">${lineTotal} US$</p>
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
          {/* Total */}
          <div className="mt-auto">
            <p className="text-lg font-bold mb-4 text-black">VALOR TOTAL:</p>
            <p className="text-2xl font-semibold text-gray-800 mb-8">
              ${total.toFixed(2)}
            </p>

            {/* Comprar por WhatsApp */}
            <a
              href={`https://wa.me/5491135657692?text=${encodeURIComponent(
                // Empieza con saludo
                `¡Hola! 👋\nMe gustaría hacer el siguiente pedido:\n\n` +
                // Lista de productos
                cartItems
                  .map((p, i) => {
                    const unit = parseFloat(p.price.replace(/[^0-9.]/g, ""));
                    const qty = p.quantity || 1;
                    const line = (unit * qty).toFixed(2);
                    return `${i + 1}. ${p.name}\n   • Cantidad: ${qty}\n   • Subtotal: $${line} US$`;
                  })
                  .join("\n\n") +
                // Observación si existe
                (observation ? `\n\nObservación:\n${observation}` : "") +
                // Total al final
                `\n\n*Total: $${total.toFixed(2)} US$*`
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
