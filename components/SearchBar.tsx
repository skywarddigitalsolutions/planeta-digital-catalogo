"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Search } from "lucide-react" // Importa el icono de búsqueda de Lucide React

interface SearchBarProps {
  onSearch: (term: string) => void
  initialSearchTerm?: string // <--- ¡Añadimos esta prop!
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialSearchTerm = "" }) => {
  const [term, setTerm] = useState(initialSearchTerm) // <--- Inicializamos el estado con la prop

  // Usamos useEffect para sincronizar el estado interno si initialSearchTerm cambia desde el padre
  useEffect(() => {
    setTerm(initialSearchTerm)
  }, [initialSearchTerm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
    onSearch(e.target.value) // Mantenemos tu lógica de búsqueda en cada cambio
  }

  return (
    <div className="px-4 py-2 mt-3 border-b border-gray-200 flex items-center">
      <Search size={18} className="text-gray-500 mr-2" /> {/* Icono de búsqueda */}
      <input
        type="search"
        placeholder="Buscar productos"
        value={term}
        onChange={handleChange}
        className="w-full border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
        aria-label="Buscar productos"
      />
    </div>
  )
}
