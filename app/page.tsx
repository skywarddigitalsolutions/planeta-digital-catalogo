"use client";

import React, { useMemo, useState } from "react";
import { ProductList } from "@/components/ProductList";
import { FilterBar } from "@/components/FilterBar";
import productosData from "../data/productos.json";

export default function Home() {
  const [filterCategory, setFilterCategory] = useState("TODAS");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const categories = useMemo(() => {
    const cats = productosData.products.map(p => p.category.toUpperCase());
    return ["TODAS", ...Array.from(new Set(cats))];
  }, []);



  const filteredProducts = useMemo(() => {
    let list = productosData.products;

    if (filterCategory !== "TODAS") {
      list = list.filter(
        (p) => p.category.toUpperCase() === filterCategory
      );
    }
    if (searchTerm.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortOption) {
      list = [...list];
      if (sortOption === "priceAsc") {
        list.sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^0-9.]/g, "")) -
            parseFloat(b.price.replace(/[^0-9.]/g, ""))
        );
      }
      if (sortOption === "priceDesc") {
        list.sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^0-9.]/g, "")) -
            parseFloat(a.price.replace(/[^0-9.]/g, ""))
        );
      }
      if (sortOption === "nameAsc") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (sortOption === "nameDesc") {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    return list;
  }, [filterCategory, searchTerm, sortOption]);

  const handleFilterChange = (
    category: string,
    search: string,
    sort: string
  ) => {
    setFilterCategory(category);
    setSearchTerm(search);
    setSortOption(sort);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="lg:hidden">
        <FilterBar
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block sticky top-20 self-start">
          <FilterBar
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <section className="pt-4">
          <h2 className="text-2xl font-bold mb-4 text-black mt-0 sm:mt-20 text-center">
            {filterCategory === "TODAS" ? "Todos los productos" : filterCategory}
          </h2>
          <ProductList products={filteredProducts} />
        </section>
      </div>
    </div>
  );
}
