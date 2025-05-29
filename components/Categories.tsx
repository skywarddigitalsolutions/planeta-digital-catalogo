import React from "react";

interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="static top-14 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-3 space-x-4 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`
                snap-start
                rounded-full
                px-5 py-2
                font-medium
                text-sm
                whitespace-nowrap
                transition
                duration-300
                focus:outline-none
                focus:ring-2 focus:ring-blue-400
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                }
              `}
              aria-current={isSelected ? "true" : undefined}
            >
              {cat}
              {isSelected && (
                <span
                  className="block h-1 rounded-full bg-white mt-1 mx-auto w-6"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
