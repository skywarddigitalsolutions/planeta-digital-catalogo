"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"

interface SortSelectorProps {
  selectedSort: string
  onSelectSort: (sort: string) => void
}

const sortOptions = [
  { label: "Recomendado", value: "" },
  { label: "Menor precio", value: "priceAsc" },
  { label: "Mayor precio", value: "priceDesc" },
  { label: "Nombre A-Z", value: "nameAsc" },
  { label: "Nombre Z-A", value: "nameDesc" },
]

export const SortSelector: React.FC<SortSelectorProps> = ({ selectedSort, onSelectSort }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const label = sortOptions.find((o) => o.value === selectedSort)?.label || "Recomendado"

  return (
    <div className="relative inline-block w-full" ref={ref}>
      <button
        className="w-full flex items-center justify-between gap-2 text-gray-700 font-medium hover:text-gray-900 focus:ring-2 focus:ring-blue-400 rounded-md px-3 py-2 transition-all duration-200 hover:bg-gray-50 border border-gray-200 text-sm cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span className="truncate">{label}</span>
        </div>
        <FiChevronDown
          className={`transform ${open ? "rotate-180" : ""} transition-transform duration-200 flex-shrink-0`}
          size={16}
        />
      </button>

      {/* Dropdown que se extiende hacia abajo */}
      {open && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Menu dropdown */}
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {sortOptions.map(({ label, value }) => (
              <button
                key={value}
                className={`w-full text-left cursor-pointer py-3 px-3 transition-colors duration-150 text-sm ${
                  selectedSort === value
                    ? "font-medium bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => {
                  onSelectSort(value)
                  setOpen(false)
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {selectedSort === value && (
                    <svg
                      className="w-3 h-3 text-white flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
