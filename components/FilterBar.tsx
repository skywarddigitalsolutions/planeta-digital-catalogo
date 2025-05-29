import React, { useState } from "react";
import { Categories } from "./Categories";
import { SearchBar } from "./SearchBar";

interface FilterBarProps {
  categories: string[];
  onFilterChange: (category: string, searchTerm: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ categories, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("TODO");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    onFilterChange(cat, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onFilterChange(selectedCategory, term);
  };

  return (
    <div className="bg-white shadow-sm static mt-16 top-[64px] z-40">
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};
