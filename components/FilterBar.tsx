"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { SortSelector } from "./SortSelector";
import { FilterPanel } from "./FilterPanel";
import { CategorySelector } from "./CategorySelector";
import { slugify } from "@/utils/string";

interface FilterBarProps {
  categories: string[];
  onFilterChange: (
    category: string,
    searchTerm: string,
    sortOption: string,
  ) => void;
  selectedCategory?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  onFilterChange,
  selectedCategory = "TODAS"
}) => {
  const router = useRouter();
  const [cat, setCat] = useState(selectedCategory);
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setCat(selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (newCat: string) => {
    setCat(newCat);
    onFilterChange(newCat, term, sort);

    if (newCat === "TODAS") {
      router.push("/");
    } else {
      const slug = slugify(newCat);
      router.push(`/categoria/${slug}`);
    }
  };

  const applyFilters = (
    newCat: string = cat,
    newTerm: string = term,
    newSort: string = sort
  ) => {
    setTerm(newTerm);
    setSort(newSort);
    onFilterChange(newCat, newTerm, newSort);
  };

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
              /* icono X */
              <svg className="w-6 h-6" /*…*/ />
            ) : (
              /* icono lupa */
              <svg className="w-6 h-6" /*…*/ />
            )}
          </button>
        </div>

        {searchOpen && (
          <div className="px-3 pb-2">
            <SearchBar
              onSearch={(t) => applyFilters(cat, t, sort)}
            />
          </div>
        )}

        {!searchOpen && (
          <div className="px-3 py-2 overflow-x-auto flex space-x-4 border-b border-gray-200">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategorySelect(c)}
                className={`
                  whitespace-nowrap px-3 pb-2 font-normal text-sm transition-colors
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
            handleCategorySelect(c);
            setPanelOpen(false);
          }}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:block mt-16 p-4 rounded shadow bg-white">
        <div className="mb-4">
          <SearchBar onSearch={(t) => applyFilters(cat, t, sort)} />
        </div>
        <h3 className="font-semibold mb-2">Categorías</h3>
        <CategorySelector
          categories={categories}
          selectedCategory={cat}
          // aquí en desktop también uso handleCategorySelect
          onSelectCategory={(c) => handleCategorySelect(c)}
        />
        <h3 className="font-semibold mt-6 mb-2">Ordenar por</h3>
        <SortSelector
          selectedSort={sort}
          onSelectSort={(s) => applyFilters(cat, term, s)}
        />
      </div>
    </>
  );
};
