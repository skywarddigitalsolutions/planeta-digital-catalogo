"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SortSelectorProps {
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortOptions = [
  { label: "Menor precio", value: "priceAsc" },
  { label: "Mayor precio", value: "priceDesc" }
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  selectedSort,
  onSelectSort,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedLabel =
    sortOptions.find((opt) => opt.value === selectedSort)?.label || "Ordenar";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 text-black font-semibold hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Ícono de ordenar (flechas arriba-abajo) */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
        <span>{selectedLabel}</span>
        <FiChevronDown className={`${open ? "rotate-180" : ""} transition-transform`} />
      </button>

      {open && (
        <ul
          className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
          role="listbox"
          tabIndex={-1}
        >
          {sortOptions.map(({ label, value }) => (
            <li
              key={value}
              className={`cursor-pointer select-none py-2 px-4 text-gray-700 hover:bg-blue-100 ${
                selectedSort === value ? "font-bold bg-blue-200" : ""
              }`}
              role="option"
              aria-selected={selectedSort === value}
              onClick={() => {
                onSelectSort(value);
                setOpen(false);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectSort(value);
                  setOpen(false);
                }
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
