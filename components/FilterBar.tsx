"use client";

import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SortSelector } from "./SortSelector";
import { FilterPanel } from "./FilterPanel";
import { CategorySelector } from "./CategorySelector";

interface FilterBarProps {
  categories: string[];
  onFilterChange: (
    category: string,
    searchTerm: string,
    sortOption: string
  ) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  onFilterChange,
}) => {
  const [cat, setCat] = useState("TODAS");
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  // NUEVO: controla si está abierto el input de búsqueda
  const [searchOpen, setSearchOpen] = useState(false);

  const apply = (
    newCat: string = cat,
    newTerm: string = term,
    newSort: string = sort
  ) => {
    setCat(newCat);
    setTerm(newTerm);
    setSort(newSort);
    onFilterChange(newCat, newTerm, newSort);
  };

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden sticky mt-20 bg-white border-b flex">
        <div className="flex items-center px-3 py-2">
          {/* Icono buscar / cerrar */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
          >
            {searchOpen ? (
              // X icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Lupa icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>

        {/* SearchBar solo cuando searchOpen=true */}
        {searchOpen && (
          <div className="px-3 pb-2">
            <SearchBar
              onSearch={(t) => apply(cat, t, sort)}
            />
          </div>
        )}

        {/* Si el buscador está cerrado, muestro categorías + botones */}
        {!searchOpen && (
          // contenedor con border-bottom gris
          <div className="px-3 py-2 overflow-x-auto flex space-x-4 border-b border-gray-200">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => apply(c, term, sort)}
                className={`
                  whitespace-nowrap 
                  px-3 pb-2 
                  font-normal text-sm 
                  transition-colors
                  ${c === cat
                    // pestaña activa: texto negro + línea azul abajo
                    ? "text-black border-b-2 border-blue-600"
                    // pestaña inactiva: texto gris, sin border, al hover gris oscuro
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

      {/* panel de filtros (mobile) */}
      {panelOpen && (
        <FilterPanel
          categories={categories}
          selectedCategory={cat}
          onSelectCategory={(c) => {
            apply(c, term, sort);
            setPanelOpen(false);
          }}
          onClose={() => setPanelOpen(false)}
        />
      )}


      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:block mt-16 p-4 rounded shadow bg-white">
        {/* aquí dejas el layout desktop igual que tenías */}
        <div className="mb-4">
          <SearchBar
            onSearch={(t) => apply(cat, t, sort)}
          />
        </div>
        <h3 className="font-semibold mb-2">Categorías</h3>
        {/* tu CategorySelector actual */}
        <CategorySelector
          categories={categories}
          selectedCategory={cat}
          onSelectCategory={c => apply(c, term, sort)}
        />
        <h3 className="font-semibold mt-6 mb-2">Ordenar por</h3>
        <SortSelector
          selectedSort={sort}
          onSelectSort={s => apply(cat, term, s)}
        />
      </div>

    </>
  );
};
