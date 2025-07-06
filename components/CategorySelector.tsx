"use client"
import type React from "react"

interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (cat: string) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`
            w-full text-left px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium
            ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{category}</span>
            {selectedCategory === category && (
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
  )
}
