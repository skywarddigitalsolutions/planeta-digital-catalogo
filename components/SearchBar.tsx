"use client"

import React, { useState, useEffect } from "react"
import { Search, X } from "lucide-react" // Iconos de búsqueda y limpiar

interface SearchBarProps {
  onSearch: (term: string) => void
  initialSearchTerm?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialSearchTerm = "" }) => {
  const [term, setTerm] = useState(initialSearchTerm)

  // Sincronizar si cambia initialSearchTerm desde el padre
  useEffect(() => {
    setTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setTerm("")
    onSearch("")
  }

  return (
    <div className="relative px-4 py-2 mt-3 border-b border-gray-200">
      {/* Icono de búsqueda */}
      <Search size={18} className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Buscar productos"
        value={term}
        onChange={handleChange}
        className="w-full pl-5 pr-5 bg-transparent border-none appearance-none focus:outline-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
        aria-label="Buscar productos"
      />
      {term && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none"
        >
          <X size={18} className="text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </div>
  )
}
