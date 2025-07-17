"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaShoppingCart, FaTimes } from "react-icons/fa"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import { limpiarCentavos } from "@/utils/string"

// Usar exactamente la misma función que usa el cart normal
function parsePrice(price: string): number {
  const cleaned = price
    .replace(/[^0-9.,]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
  return Number.parseFloat(cleaned)
}

export const CartWidget = () => {
  const { cartItems, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // No mostramos el widget si estamos en la ruta /cart
  if (pathname === "/cart") return null

  // Calcular cantidad total de productos (incluyendo cantidades)
  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  // Calcular total del carrito usando la misma lógica que el cart normal
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parsePrice(item.price)
    const quantity = item.quantity || 1
    return total + price * quantity
  }, 0)

  const handleGoToCart = () => {
    setIsOpen(false)
    router.push("/cart")
  }

  if (cartItems.length === 0) return null

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-5 bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 cursor-pointer transition-all duration-200 hover:scale-110 z-40 group"
        aria-label="Ver carrito"
      >
        <FaShoppingCart size={24} />
        {/* Badge con cantidad total */}
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce-in">
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        )}
      </button>

      {/* Modal del carrito con blur xs */}
      {isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-xs bg-white/20 flex items-end justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Mi Carrito ({totalQuantity} {totalQuantity === 1 ? "producto" : "productos"})
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                <FaTimes size={20} /> 
              </button>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
              {cartItems.map((item) => (
                <div key={item.name} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  {/* Imagen */}
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={item.images?.[0] || item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">
                        {item.quantity || 1}x ${limpiarCentavos(item.price)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  ${totalPrice.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>

              <button
                onClick={handleGoToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Ver carrito completo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
