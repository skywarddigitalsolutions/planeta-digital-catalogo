"use client";

import React from "react";

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onClose,
}) => {
  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-lg p-6 z-50 overflow-auto"
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            aria-label="Cerrar panel de filtros"
            className="text-gray-700 font-bold"
          >
            ✕ Cerrar
          </button>
        </div>

        <h3 className="mb-3 font-semibold text-lg">Categorías</h3>

        <ul>
          {categories.map(cat => (
            <li key={cat} className="mb-2">
              <button
                className={`w-full text-left px-4 py-2 rounded ${selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 text-gray-700"
                  }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
