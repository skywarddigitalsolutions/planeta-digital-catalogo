"use client"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import { FaTrash, FaArrowLeft, FaWhatsapp, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { limpiarCentavos } from "@/utils/string"

function parsePrice(price: string): number {
  const cleaned = price
    .replace(/[^0-9.,]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
  return Number.parseFloat(cleaned)
}

export default function CartPage() {
  const [observation, setObservation] = useState("")
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [isClearing, setIsClearing] = useState(false)
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  // Cálculo del total
  const total = cartItems.reduce((sum, item) => {
    const unit = parsePrice(item.price)
    const qty = item.quantity || 1
    return sum + unit * qty
  }, 0)

  const handleRemoveItem = async (itemName: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemName))

    setTimeout(() => {
      removeFromCart(itemName)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemName)
        return newSet
      })
    }, 300)
  }

  const handleClearCart = async () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 500)
  }

  const handleQuantityChange = (itemName: string, newQuantity: number) => {
    updateQuantity(itemName, newQuantity)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center animate-bounce-slow">
              <FaShoppingCart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8 text-lg">¡Agrega algunos productos para comenzar!</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explorar productos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-4 lg:px-8 pb-5">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 group"
            >
              <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Volver</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Mi Carrito</h1>
            </div>

            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer duration-200 ${
                isClearing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <FaTrash className={isClearing ? "animate-spin" : ""} />
              <span className="font-medium">Limpiar</span>
            </button>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Lista de productos */}
          <div className="space-y-4">
            {cartItems.map((item, index) => {
              const unit = parsePrice(item.price)
              const qty = item.quantity || 1
              const lineTotal = unit * qty
              const isRemoving = removingItems.has(item.name)

              return (
                <div
                  key={item.name}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 animate-slide-up ${
                    isRemoving ? "opacity-0 scale-95 -translate-x-4" : "opacity-100 scale-100 translate-x-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-6 items-start">
                    {/* Imagen del producto */}
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 group">
                      <Image
                        src={item.images?.[0] ?? item.image ?? "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">{item.category}</p>

                      {/* Controles de cantidad */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 mt-15">Cantidad:</span>
                        <div className="flex items-center bg-gray-50 rounded-lg p-1 mt-15">
                          <button
                            onClick={() => handleQuantityChange(item.name, Math.max(1, qty - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white cursor-pointer rounded-md transition-all duration-200"
                            disabled={qty <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(item.name, Math.min(100, qty + 1))}
                            className="w-8 h-8 flex items-center justify-center  text-gray-600 hover:text-gray-800 hover:bg-white cursor-pointer rounded-md transition-all duration-200"
                            disabled={qty >= 100}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Precio y acciones */}
                    <div className="flex flex-col items-end space-y-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio unitario</p>
                        <p className="font-semibold text-gray-800">${limpiarCentavos(unit.toString())}</p>
                      </div>

                      {/* Solo mostrar subtotal si hay más de 1 unidad */}
                      {qty > 1 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-xl font-bold text-gray-900">${limpiarCentavos(lineTotal.toString())}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveItem(item.name)}
                        disabled={isRemoving}
                        className={`px-4 rounded-lg font-medium cursor-pointer transition-all duration-200 ${
                          isRemoving
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-105"
                        }`}
                      >
                        {isRemoving ? "Eliminando..." : <FaTrash /> }
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:sticky lg:top-24 lg:self-start mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>

              {/* Total simplificado */}
              <div className="mb-6">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${limpiarCentavos(total.toString())}</span>
                  </div>
                </div>
              </div>

              {/* Campo de observaciones */}
              <div className="mb-6">
                <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  id="observation"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Agrega cualquier comentario sobre tu pedido..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Botón de WhatsApp */}
              <a
                href={`https://wa.me/2271438717?text=${encodeURIComponent(
                  `¡Hola! 👋\nMe gustaría hacer el siguiente pedido:\n\n` +
                    cartItems
                      .map((p, i) => {
                        const unit = parsePrice(p.price)
                        const qty = p.quantity || 1
                        const line = unit * qty
                        return (
                          `${i + 1}. ${p.name}\n` +
                          `   • Cantidad: ${qty}\n` +
                          `   • Subtotal: $${limpiarCentavos(line.toString())}`
                        )
                      })
                      .join("\n\n") +
                    (observation ? `\n\nObservación:\n${observation}` : "") +
                    `\n\n*Total: $${limpiarCentavos(total.toString())}*`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center rounded-xl py-4 px-6 font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                <FaWhatsapp size={24} className="group-hover:animate-bounce" />
                <span>Comprar por WhatsApp</span>
              </a>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
