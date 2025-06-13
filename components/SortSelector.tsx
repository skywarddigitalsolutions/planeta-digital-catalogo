"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SortSelectorProps {
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortOptions = [
  { label: "Menor precio", value: "priceAsc" },
  { label: "Mayor precio", value: "priceDesc" },
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  selectedSort,
  onSelectSort,
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

  const label = sortOptions.find((o) => o.value === selectedSort)?.label || "Ordenar";

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="flex items-center gap-1 text-black font-semibold hover:text-gray-800 focus:ring-2 focus:ring-blue-400 rounded"
        onClick={() => setOpen((o) => !o)}
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
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
        <span>{label}</span>
        <FiChevronDown
          className={`ml-1 transform ${open ? "rotate-180" : ""} transition-transform`}
        />
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {sortOptions.map(({ label, value }) => (
            <li
              key={value}
              className={`cursor-pointer py-2 px-4 ${
                selectedSort === value ? "font-bold bg-blue-200" : "hover:bg-blue-100"
              }`}
              onClick={() => {
                onSelectSort(value);
                setOpen(false);
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
