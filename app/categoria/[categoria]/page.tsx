"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { FilterBar } from "@/components/FilterBar"
import { ProductList } from "@/components/ProductList"
import { useCatalogStore } from "@/store/catalogStore"
import productosData from "@/data/productos.json"
import { slugify } from "@/utils/string"

// Función para convertir strings de precio a números correctamente
const parsePrice = (raw: string) =>
  parseFloat(
    raw
      .replace(/[^\d,\.!]/g, "") // conservar dígitos, comas y puntos
      .replace(/\./g, "")         // eliminar separadores de miles
      .replace(/,/g, ".")          // convertir coma decimal a punto
  )

export default function CategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const { setFilters } = useCatalogStore()

  // Extraer slug y determinar categoría
  const rawParam = typeof params.categoria === "string" ? params.categoria : Array.isArray(params.categoria) ? params.categoria[0] : ""
  const filterCat = useMemo(() => {
    const allCats = Array.from(new Set(productosData.products.map((p) => p.category)))
    return allCats.find((cat) => slugify(cat).toLowerCase() === rawParam.toLowerCase()) || "TODAS"
  }, [rawParam])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("")

  // Sincronizar store al cambiar categoría
  useEffect(() => {
    setFilters({ category: filterCat.toUpperCase(), searchTerm: "", sortOption: "" })
    setSearchTerm("")
    setSortOption("")
  }, [filterCat, setFilters])

  // Lista de categorías
  const categories = useMemo(() => {
    const cats = productosData.products.map((p) => p.category.toUpperCase())
    return ["TODAS", ...Array.from(new Set(cats))]
  }, [])

  // Filtrar, buscar y ordenar
  const filteredProducts = useMemo(() => {
    let list = productosData.products

    if (filterCat !== "TODAS") {
      list = list.filter((p) => p.category === filterCat)
    }
    if (searchTerm.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (sortOption) {
      list = [...list]
      switch (sortOption) {
        case "priceAsc":
          list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
          break
        case "priceDesc":
          list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
          break
        case "nameAsc":
          list.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "nameDesc":
          list.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }
    return list
  }, [filterCat, searchTerm, sortOption])

  const handleFilterChange = (category: string, search: string, sort: string) => {
    setSearchTerm(search)
    setSortOption(sort)

    if (category !== filterCat.toUpperCase()) {
      if (category === "TODAS") router.push("/")
      else router.push(`/categoria/${slugify(category)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filtros móviles */}
      <div className="lg:hidden">
        <FilterBar categories={categories} selectedCategory={filterCat.toUpperCase()} onFilterChange={handleFilterChange} />
      </div>
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block">
          <FilterBar categories={categories} selectedCategory={filterCat.toUpperCase()} onFilterChange={handleFilterChange} />
        </aside>
        <section className="px-4 lg:px-0 pt-12 min-h-screen">
          <h2 className="text-2xl font-bold mb-4 text-black text-center pt-8 lg:pt-8">
            {filterCat === "TODAS" ? "Todos los productos" : filterCat}
          </h2>
          <ProductList products={filteredProducts} />
        </section>
      </div>
    </div>
  )
}
