"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "./SearchBar"
import { SortSelector } from "./SortSelector"
import { FilterPanel } from "./FilterPanel"
import { slugify } from "@/utils/string"

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
  const [searchOpen, setSearchOpen] = useState(false)

  // Sincronizar cuando cambie selectedCategory desde el padre
  useEffect(() => {
    setCat(selectedCategory)
  }, [selectedCategory])

  const handleCategorySelect = (newCat: string) => {
    setCat(newCat)
    // Resetear filtros cuando cambie la categoría
    setTerm("")
    setSort("")
    onFilterChange(newCat, "", "")

    if (newCat === "TODAS") {
      router.push("/")
    } else {
      const slug = slugify(newCat)
      router.push(`/categoria/${slug}`)
    }
  }

  const applyFilters = (newCat: string = cat, newTerm: string = term, newSort: string = sort) => {
    setTerm(newTerm)
    setSort(newSort)
    onFilterChange(newCat, newTerm, newSort)
  }

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden sticky mt-20 bg-white border-b flex">
        <div className="flex items-center px-3 py-2">
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
          >
            {searchOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
        {searchOpen && (
          <div className="px-3 pb-2">
            <SearchBar onSearch={(t) => applyFilters(cat, t, sort)} />
          </div>
        )}
        {!searchOpen && (
          <div className="px-3 py-2 overflow-x-auto flex space-x-4 border-b border-gray-200">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategorySelect(c)}
                className={`
                  whitespace-nowrap px-3 pb-2 font-normal text-sm transition-colors cursor-pointer
                  ${
                    c === cat
                      ? "text-black border-b-2 border-blue-600"
                      : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {panelOpen && (
        <FilterPanel
          categories={categories}
          selectedCategory={cat}
          onSelectCategory={(c) => {
            handleCategorySelect(c)
            setPanelOpen(false)
          }}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:block mt-32 p-4 ml-2 rounded-lg shadow-sm bg-white border border-gray-100">
        {/* Búsqueda */}
        <div className="mb-5">
          <h3 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar
          </h3>
          <SearchBar onSearch={(t) => applyFilters(cat, t, sort)} />
        </div>

        {/* Categorías - sin scroll interno, se extienden naturalmente */}
        <div className="mb-5">
          <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Categorías
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium cursor-pointer
                  ${
                    category === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{category}</span>
                  {category === cat && (
                    <svg className="w-3 h-3 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ordenar - posicionado después de todas las categorías */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
              />
            </svg>
            Ordenar por
          </h3>
          <SortSelector selectedSort={sort} onSelectSort={(s) => applyFilters(cat, term, s)} />
        </div>
      </div>
    </>
  )
}
