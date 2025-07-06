"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useProductModalStore } from "@/store/productModalStore"
import { useCart } from "@/context/CartContext"
import { FaTimes, FaShoppingCart, FaChevronLeft, FaChevronRight, FaSearchPlus, FaCreditCard } from "react-icons/fa"
import Image from "next/image"
import { limpiarCentavos } from "@/utils/string"

export const ProductDetailModal: React.FC = () => {
  const { isOpen, product, closeModal } = useProductModalStore()
  const { addToCart } = useCart()
  const router = useRouter()
  const MAX_DESCRIPTION_LENGTH = 300;

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showImageZoom, setShowImageZoom] = useState(false)
  const [zoomImageIndex, setZoomImageIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    setShowFullDescription(false);
  }, [product, isOpen]);

  let descriptionToShow = "";
  let isLongDescription = true;
  if (product?.description) {
    isLongDescription = product?.description.length > MAX_DESCRIPTION_LENGTH;
    descriptionToShow = showFullDescription || !isLongDescription
      ? product.description
      : `${product.description.slice(0, MAX_DESCRIPTION_LENGTH)}…`;
  }

  // Touch/swipe handling
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll when modal is open and add blur
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.classList.add("modal-blur-bg")
      setCurrentImageIndex(0)
    } else {
      document.body.style.overflow = "unset"
      document.body.classList.remove("modal-blur-bg")
    }

    return () => {
      document.body.style.overflow = "unset"
      document.body.classList.remove("modal-blur-bg")
    }
  }, [isOpen])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showImageZoom) {
          setShowImageZoom(false)
        } else {
          closeModal()
        }
      }
      if (e.key === "ArrowLeft" && images.length > 1) {
        prevImage()
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        nextImage()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, showImageZoom])

  if (!isOpen || !product) return null

  const images = product.images?.length ? product.images : [product.image]
  const hasMultipleImages = images.length > 1

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (showImageZoom) {
        setShowImageZoom(false)
      } else {
        closeModal()
      }
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    addToCart(product)

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 800)
  }

  const handleBuyNow = async () => {
    setIsPurchasing(true)

    // Agregar al carrito primero
    addToCart(product)

    // Simular proceso y redirigir al carrito
    setTimeout(() => {
      setIsPurchasing(false)
      closeModal()

      // Redirigir al carrito (ajusta la ruta según tu aplicación)
      router.push("/cart") // o la ruta que uses para el carrito
    }, 1000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageClick = (index: number) => {
    setZoomImageIndex(index)
    setShowImageZoom(true)
  }

  const nextZoomImage = () => {
    setZoomImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevZoomImage = () => {
    setZoomImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && hasMultipleImages) {
      nextImage()
    }
    if (isRightSwipe && hasMultipleImages) {
      prevImage()
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <>
      {/* Main Modal */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-xs bg-white/20 transition-all duration-300 pt-12 ${isOpen ? "opacity-100" : "opacity-0"
          } flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-800 backdrop-blur-sm">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100/80 text-gray-800 backdrop-blur-sm">
                  {product.subcategory}
                </span>
              )}
            </div>

            <button
              onClick={closeModal}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-colors backdrop-blur-sm cursor-pointer"
              aria-label="Cerrar modal"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(95vh-120px)] bg-white/60 backdrop-blur-sm">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                ref={imageContainerRef}
                className="relative aspect-square bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden group cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleImageClick(currentImageIndex)}
              >
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <FaSearchPlus size={14} />
                </div>

                {/* Image Navigation - Siempre visibles */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-lg transition-all backdrop-blur-sm cursor-pointer z-10"
                    >
                      <FaChevronLeft size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-lg transition-all backdrop-blur-sm cursor-pointer z-10"
                    >
                      <FaChevronRight size={10} />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                          }}
                          className={`w-3 h-3 rounded-full transition-all backdrop-blur-sm cursor-pointer ${index === currentImageIndex
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-white/50 hover:bg-white/75"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Swipe Indicator */}
                {hasMultipleImages && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/70 text-xs bg-black/30 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    Desliza para ver más
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all backdrop-blur-sm cursor-pointer ${index === currentImageIndex
                        ? "border-blue-500 ring-2 ring-blue-200/50 bg-white/80"
                        : "border-gray-200/50 hover:border-gray-300 bg-white/60"
                        }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>

                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">${limpiarCentavos(product.price)}</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {descriptionToShow}
                  </p>
                  {isLongDescription && (
                    <button
                      onClick={() => setShowFullDescription(prev => !prev)}
                      className="mt-2 text-blue-600 hover:underline focus:outline-none"
                    >
                      {showFullDescription ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>
              )}


              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-white transition-all transform backdrop-blur-sm cursor-pointer ${isAddingToCart
                    ? "bg-gray-900/90 scale-95"
                    : "bg-gray-900/90 hover:bg-gray-800 hover:scale-105 active:scale-95"
                    } shadow-lg hover:shadow-xl`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Agregando...</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart size={18} />
                      <span>Agregar al carrito</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isPurchasing}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 border-2 font-semibold rounded-xl transition-all backdrop-blur-sm cursor-pointer ${isPurchasing
                    ? "border-blue-300 bg-blue-50 text-blue-600 scale-95"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95"
                    } shadow-sm hover:shadow-md mb-5`}
                >
                  {isPurchasing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirigiendo...</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard size={16} />
                      <span>Comprar ahora</span>
                    </>
                  )}
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
            {/* Close button - más grande */}
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black/50 p-4 rounded-full transition-colors backdrop-blur-sm cursor-pointer"
              aria-label="Cerrar zoom"
            >
              <FaTimes size={15} />
            </button>

            {/* Navigation buttons - más grandes */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevZoomImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 p-5 rounded-full transition-colors backdrop-blur-sm z-10 cursor-pointer"
                >
                  <FaChevronLeft size={8} />
                </button>
                <button
                  onClick={nextZoomImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 p-5 rounded-full transition-colors backdrop-blur-sm z-10 cursor-pointer"
                >
                  <FaChevronRight size={8} />
                </button>
              </>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {zoomImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Zoomed image */}
            <div
              className="relative w-full h-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[zoomImageIndex] || "/placeholder.svg"}
                alt={`${product.name} - Imagen ${zoomImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
