"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "./SearchBar"
import { SortSelector } from "./SortSelector"
import { slugify } from "@/utils/string"
import { BiFilter } from "react-icons/bi"

interface FilterBarProps {
  categories: string[]
  onFilterChange: (category: string, searchTerm: string, sortOption: string) => void
  selectedCategory?: string
}

export const FilterBar: React.FC<FilterBarProps> = ({ categories, onFilterChange, selectedCategory = "TODAS" }) => {
  const router = useRouter()
  const [cat, setCat] = useState(selectedCategory)
  const [term, setTerm] = useState("")
  const [sort, setSort] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)

  // Indica si hay filtros activos
  const hasFilters = cat !== "TODAS" || term.trim() !== "" || sort !== ""

  // Sincronizar con selectedCategory externo
  useEffect(() => {
    setCat(selectedCategory)
    setTerm("")
    setSort("")
  }, [selectedCategory])

  // Maneja selección de categoría
  const handleCategorySelect = (newCat: string) => {
    setCat(newCat)
    if (!panelOpen) {
      // Desktop: aplicar y navegar inmediatamente
      onFilterChange(newCat, term, sort)
      if (newCat === "TODAS") router.push("/")
      else router.push(`/categoria/${slugify(newCat)}`)
    }
  }

  // Aplica filtros (búsqueda u orden) y notifica al padre (útil en desktop)
  const applyFilters = (newCat: string = cat, newTerm: string = term, newSort: string = sort) => {
    setCat(newCat)
    setTerm(newTerm)
    setSort(newSort)
    onFilterChange(newCat, newTerm, newSort)
  }

  // Mobile: aplicar todos los filtros y cerrar modal
  const applyAndClose = () => {
    onFilterChange(cat, term, sort)
    if (cat === "TODAS") router.push("/")
    else router.push(`/categoria/${slugify(cat)}`)
    setPanelOpen(false)
  }

  // Mobile: limpiar filtros y cerrar modal
  const clearFilters = () => {
    setCat("TODAS")
    setTerm("")
    setSort("")
    onFilterChange("TODAS", "", "")
    router.push("/")
    setPanelOpen(false)
  }

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        {/* SearchBar fija */}
        <div className="sticky top-0 mt-16 bg-white z-40 p-2 border-b shadow-sm">
          <SearchBar onSearch={(t) => applyFilters(cat, t, sort)} />
        </div>

        {/* Botón flotante */}
        <button
          onClick={() => setPanelOpen(true)}
          className={`fixed bottom-20 left-6 z-40 p-3 rounded-full shadow-lg text-white focus:outline-none transition-colors ${
            hasFilters ? 'bg-red-600' : 'bg-gray-800'
          }`}
          aria-label="Abrir filtros"
        >
          <BiFilter size={20} />
        </button>

        {/* Modal */}
        {panelOpen && (
          <div
            className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex justify-center items-end"
            onClick={() => setPanelOpen(false)}
          >
            <div className="w-full h-3/4 bg-white rounded-t-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button onClick={() => setPanelOpen(false)} className="p-2">
                  ×
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium">Ordenar por</h3>
                  <SortSelector selectedSort={sort} onSelectSort={(s) => applyFilters(cat, term, s)} />
                </div>
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium">Categorías</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCategorySelect(c)}
                        className={`px-3 py-2 text-sm rounded-md font-medium transition ${
                          c === cat ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-white flex justify-end space-x-2">
                <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">
                  Limpiar
                </button>
                <button onClick={applyAndClose} className="px-4 py-2 bg-gray-800 text-white rounded font-medium">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block mt-32 p-4 bg-white rounded-lg shadow border border-gray-100">
        <div className="mb-6">
          
          <SearchBar onSearch={(t) => applyFilters(cat, t, sort)} />
        </div>
        <div className="mb-6">
          <h3 className="mb-2 flex items-center text-sm font-medium text-gray-800">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg> Categorías
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onFilterChange(category, term, sort)
                  if (category === "TODAS") router.push("/")
                  else router.push(`/categoria/${slugify(category)}`)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                  category === cat ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-200 hover:cursor-pointer'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 flex items-center text-sm font-medium text-gray-800">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg> Ordenar por
          </h3>
          <SortSelector selectedSort={sort} onSelectSort={(s) => applyFilters(cat, term, s)} />
        </div>
      </div>
    </>
  )
}
