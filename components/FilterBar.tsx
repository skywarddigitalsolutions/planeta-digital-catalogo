"use client";

import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SortSelector } from "./SortSelector";
import { FilterPanel } from "./FilterPanel";

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
  const [selectedCategory, setSelectedCategory] = useState("TODO");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onFilterChange(selectedCategory, term, sortOption);
  };

  const handleSortSelect = (sort: string) => {
    setSortOption(sort);
    onFilterChange(selectedCategory, searchTerm, sort);
  };

  const openFilterPanel = () => setFilterPanelOpen(true);
  const closeFilterPanel = () => setFilterPanelOpen(false);

  return (
    <>
      {/* Barra de búsqueda fija */}
      <div className="static mt-12 left-0 right-0 bg-white z-50 shadow-sm px-6 py-3 mb-3">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Barra fija de botones debajo de la búsqueda */}
      <div className="static top-[104px] left-0 right-0 bg-white flex justify-evenly gap-12 py-2 shadow-sm z-50">

        <SortSelector selectedSort={sortOption} onSelectSort={handleSortSelect} />

        <button
          onClick={openFilterPanel}
          className="flex items-center gap-2 text-black font-semibold hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-haspopup="dialog"
          aria-expanded={filterPanelOpen}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 4h18M9 12h6M5 20h14" />
          </svg>
          Filtrar
        </button>
      </div>

      {/* Render del panel de filtros */}
      {filterPanelOpen && (
        <FilterPanel
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            onFilterChange(cat, searchTerm, sortOption);
            setFilterPanelOpen(false);
          }}
          onClose={closeFilterPanel}
        />
      )}
    </>
  );
};
