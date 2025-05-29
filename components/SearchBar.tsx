import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="px-4 py-2 mt-3 border-b border-gray-200 flex items-center">
      <FiSearch className="text-gray-400 mr-2" size={20} />
      <input
        type="search"
        placeholder="Buscar productos..."
        value={term}
        onChange={handleChange}
        className="w-full border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
        aria-label="Buscar productos"
      />
    </div>
  );
};
