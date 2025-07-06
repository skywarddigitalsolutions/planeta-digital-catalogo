"use client"
import { useEffect, useState } from "react"
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { limpiarCentavos } from "@/utils/string"

interface ToastItem {
  id: string
  product: {
    name: string
    price: string
    image: string
  }
  type: "new" | "quantity"
  quantity?: number
  timestamp: number
}

export const CartToast = () => {
  const { cartItems } = useCart()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [previousCartState, setPreviousCartState] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    // Crear mapa del estado actual del carrito
    const currentCartState: { [key: string]: number } = {}
    cartItems.forEach((item) => {
      currentCartState[item.name] = item.quantity || 1
    })

    // Detectar cambios
    Object.keys(currentCartState).forEach((productName) => {
      const currentQuantity = currentCartState[productName]
      const previousQuantity = previousCartState[productName] || 0

      if (currentQuantity > previousQuantity) {
        const product = cartItems.find((item) => item.name === productName)
        if (product) {
          const isNewProduct = previousQuantity === 0
          const quantityAdded = currentQuantity - previousQuantity

          const newToast: ToastItem = {
            id: `${productName}-${Date.now()}`,
            product: {
              name: product.name,
              price: product.price,
              image: product.image || "/placeholder.svg",
            },
            type: isNewProduct ? "new" : "quantity",
            quantity: quantityAdded,
            timestamp: Date.now(),
          }

          setToasts((prev) => [...prev, newToast])

          // Auto-remove toast after 3 seconds
          setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
          }, 3000)
        }
      }
    })

    setPreviousCartState(currentCartState)
  }, [cartItems, previousCartState])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-sm animate-slide-in-right pointer-events-auto"
        >
          <div className="flex items-start space-x-3">
            {/* Icono de éxito */}
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              {toast.type === "new" ? (
                <FaCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FaPlus className="w-4 h-4 text-green-600" />
              )}
            </div>

            {/* Imagen del producto */}
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={toast.product.image || "/placeholder.svg"}
                alt={toast.product.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Información */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{toast.product.name}</p>
              <p className="text-sm text-gray-600">${limpiarCentavos(toast.product.price)}</p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {toast.type === "new"
                  ? "¡Agregado al carrito!"
                  : `¡+${toast.quantity} ${toast.quantity === 1 ? "unidad" : "unidades"}!`}
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div className="bg-green-500 h-1 rounded-full animate-progress-bar" />
          </div>
        </div>
      ))}
    </div>
  )
}
