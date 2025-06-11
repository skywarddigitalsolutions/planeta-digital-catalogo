"use client";

import React, { useState, useRef, useEffect } from "react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full max-w-xs" ref={dropdownRef}>
      <button
        className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-left shadow-sm flex justify-between items-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-700">
          {selectedCategory === "TODAS" ? "Categorías" : selectedCategory}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
          tabIndex={-1}
        >
          {categories.map((cat) => (
            <li
              key={cat}
              className={`cursor-pointer select-none py-2 px-4 text-gray-700 hover:bg-blue-100 ${selectedCategory === cat ? "font-bold bg-blue-200" : ""
                }`}
              role="option"
              aria-selected={selectedCategory === cat}
              onClick={() => {
                onSelectCategory(cat);
                setOpen(false);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectCategory(cat);
                  setOpen(false);
                }
              }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
