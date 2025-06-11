"use client";

import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SortSelector } from "./SortSelector";
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

  const apply = (newCat = cat, newTerm = term, newSort = sort) => {
    onFilterChange(newCat, newTerm, newSort);
  };

  return (
    <div className="bg-white p-4 mt-16 md:mt-0 md:p-4 rounded shadow">
      {/* Buscador móvil */}
      <div className="lg:hidden mb-4">
        <SearchBar
          onSearch={t => {
            setTerm(t);
            apply(cat, t, sort);
          }}
        />
      </div>

      {/* Categorías */}
      <h3 className="font-semibold mb-2 text-black">Categorías</h3>
      <CategorySelector
        categories={categories}
        selectedCategory={cat}
        onSelectCategory={c => {
          setCat(c);
          apply(c, term, sort);
        }}
      />

      {/* Ordenar */}
      <h3 className="font-semibold mt-6 mb-2 text-black">Ordenar por</h3>
      <SortSelector
        selectedSort={sort}
        onSelectSort={s => {
          setSort(s);
          apply(cat, term, s);
        }}
      />
    </div>
  );
};
