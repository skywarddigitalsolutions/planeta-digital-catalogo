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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block w-full max-w-xs" ref={ref}>
      <button
        className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-left flex justify-between items-center hover:border-blue-500 focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-gray-700">
          {selectedCategory === "TODAS" ? "Categorías" : selectedCategory}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform ${open ? "rotate-180" : ""}`}
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
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {categories.map((c) => (
            <li
              key={c}
              className={`cursor-pointer py-2 px-4 text-black ${
                selectedCategory === c ? "font-bold bg-blue-200" : "hover:bg-blue-100"
              }`}
              onClick={() => {
                onSelectCategory(c);
                setOpen(false);
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
