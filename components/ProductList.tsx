"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ProductCard, type Product } from "./ProductCard"
import { useCatalogStore } from "@/store/catalogStore"
import { useProductModalStore } from "@/store/productModalStore"
import { ProductDetailModal } from "./ProductDetailModal"

interface Props {
  products: Product[]
}

const PAGE_SIZE = 10

export const ProductList: React.FC<Props> = ({ products }) => {
  const loader = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRestored = useRef(false)

  const { page, scrollY, setPage, setScrollY } = useCatalogStore()
  const { isOpen } = useProductModalStore()
  const [visible, setVisible] = useState<Product[]>([])

  // Update visible products when products or page changes
  useEffect(() => {
    const newVisible = products.slice(0, page * PAGE_SIZE)
    setVisible(newVisible)
  }, [products, page])

  // Restore scroll position after products are loaded
  useEffect(() => {
    if (!scrollRestored.current && visible.length > 0 && scrollY > 0 && !isOpen) {
      scrollRestored.current = true

      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: "auto",
        })
      }, 100)
    }
  }, [visible, scrollY, isOpen])

  // Reset scroll restoration flag when products change (new filter)
  useEffect(() => {
    scrollRestored.current = false
  }, [products])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loader.current || isOpen) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page * PAGE_SIZE < products.length) {
          setPage(page + 1)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    observer.observe(loader.current)
    return () => observer.disconnect()
  }, [page, products.length, setPage, isOpen])

  // Save scroll position periodically
  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen) {
        setScrollY(window.scrollY)
      }
    }

    const throttledScroll = throttle(handleScroll, 100)
    window.addEventListener("scroll", throttledScroll)

    return () => {
      window.removeEventListener("scroll", throttledScroll)
    }
  }, [setScrollY, isOpen])

  return (
    <>
      <section ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mx-3 mb-5">
        {visible.map((product, index) => (
          <ProductCard key={`${product.name}-${index}`} product={product} />
        ))}
      </section>

      {page * PAGE_SIZE < products.length && <div ref={loader} className="h-px" />}

      <ProductDetailModal />
    </>
  )
}

// Throttle function to limit scroll event frequency
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
