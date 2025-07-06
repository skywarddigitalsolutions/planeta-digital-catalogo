"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { FaPlus, FaCheck } from "react-icons/fa"
import { limpiarCentavos } from "@/utils/string"
import { useCart } from "@/context/CartContext"
import { useCatalogStore } from "@/store/catalogStore"
import { useProductModalStore } from "@/store/productModalStore"

export interface Product {
  name: string
  category: string
  subcategory?: string
  price: string
  description?: string
  image: string
  images?: string[]
}

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const { setScrollY } = useCatalogStore()
  const { openModal } = useProductModalStore()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const snippet = product.description ? product.description.slice(0, 100).trim() + "..." : ""

  const handleClick = () => {
    // Save current scroll position before opening modal
    setScrollY(window.scrollY)
    openModal(product)
  }

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Evitar múltiples clicks
    if (isAdding) return

    setIsAdding(true)

    // Agregar al carrito
    addToCart(product)

    // Mostrar animación de éxito
    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(true)

      // Ocultar el check después de un tiempo
      setTimeout(() => {
        setShowSuccess(false)
      }, 1500)
    }, 600)
  }

  return (
    <a onClick={handleClick} className="text-left w-full group cursor-pointer">
      <article className="relative bg-white rounded-lg shadow flex items-start hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
        <div className="w-48 aspect-square flex-shrink-0 relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            loading="lazy"
            className="transition-transform duration-300 group-hover:scale-105"
          />

          {/* Botón de agregar con animaciones */}
          <button
            onClick={handleAdd}
            disabled={isAdding}
            aria-label="Añadir al carrito"
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 transform ${
              isAdding
                ? "bg-blue-500 scale-110 animate-pulse"
                : showSuccess
                  ? "bg-green-500 scale-110"
                  : "bg-gray-800 hover:bg-gray-700 hover:scale-110 active:scale-95"
            }`}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              <FaCheck className="w-4 h-4 text-white animate-bounce" />
            ) : (
              <FaPlus className="w-4 h-4 text-white transition-transform duration-200 group-hover:rotate-90" />
            )}
          </button>

          {/* Animación de ondas cuando se agrega */}
          {isAdding && (
            <div className="absolute bottom-4 right-4 w-10 h-10 pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
              <div
                className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          )}

          {/* Mensaje de éxito flotante */}
          {showSuccess && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-slide-down-fade shadow-lg">
              ¡Agregado!
            </div>
          )}
        </div>

        <div className="flex-1 px-6 py-4">
          <h4 className="font-semibold text-base text-gray-800 leading-snug group-hover:text-gray-900 transition-colors">
           {product.name}
          </h4>
          <p className="text-xs text-gray-500 uppercase">{product.category}</p>
          {product.subcategory && <p className="text-xs text-gray-500 uppercase">{product.subcategory}</p>}
          <p className="font-bold text-base text-gray-800 mt-2 group-hover:text-blue-600 transition-colors">
            ${limpiarCentavos(product.price)}
          </p>
          {snippet && <p className="text-sm text-gray-700 mt-2 line-clamp-2">{snippet}</p>}
        </div>
      </article>
    </a>
  )
}
