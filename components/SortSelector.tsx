"use client"
import React, { ReactNode, useState, useRef, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"
import {
  FaArrowUp,
  FaArrowDown,
  FaSortAlphaDown,
  FaSortAlphaUp
} from "react-icons/fa"

interface SortSelectorProps {
  selectedSort: string
  onSelectSort: (sort: string) => void
}

const sortOptions = [
  { label: "Recomendado", value: "" },
  { label: "Menor precio", value: "priceAsc"  },
  { label: "Mayor precio", value: "priceDesc" },
  { label: "Nombre A-Z", value: "nameAsc" },
  { label: "Nombre Z-A", value: "nameDesc" },
]

const iconMap: Record<string, ReactNode> = {
  priceAsc: <FaArrowUp className="mr-2 text-gray-800" />,
  priceDesc: <FaArrowDown className="mr-2 text-gray-800" />,
  nameAsc: <FaSortAlphaDown className="mr-2 text-gray-800" />,
  nameDesc: <FaSortAlphaUp className="mr-2 text-gray-800" />,
}

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
        className="w-full flex items-center justify-between text-gray-800 font-medium hover:text-gray-900 focus:ring-2 focus:ring-gray-300 rounded-md px-3 py-2 transition-all duration-200 hover:bg-gray-50 border border-gray-200 text-sm cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2">
          <FiChevronDown
            className={`transform ${open ? "rotate-180" : ""} transition-transform duration-200`}
            size={16}
          />
          <span className="truncate">{label}</span>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {sortOptions.map(({ label, value }) => (
              <button
                key={value}
                className={`w-full flex items-center justify-between py-3 px-3 text-sm transition-colors duration-150 cursor-pointer
                  ${selectedSort === value
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                }`}
                onClick={() => {
                  onSelectSort(value)
                  setOpen(false)
                }}
              >
                <div className="flex items-center">
                  {iconMap[value] || <span className="mr-2 w-4 h-4" />} 
                  <span>{label}</span>
                </div>
                {selectedSort === value && (
                  <svg
                    className="w-4 h-4 text-gray-800 flex-shrink-0"
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
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
