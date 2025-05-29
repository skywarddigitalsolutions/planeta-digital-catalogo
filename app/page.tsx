"use client";

import { ProductList } from "@/components/ProductList";
import productosData from "../data/productos.json";
import { FilterBar } from "@/components/FilterBar";
import { useMemo, useState } from "react";

export default function Home() {
  const [filterCategory, setFilterCategory] = useState("TODO");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    const cats = productosData.products.map(p => p.category.toUpperCase());
    return ["TODO", ...Array.from(new Set(cats))];
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = productosData.products;

    if (filterCategory !== "TODO") {
      filtered = filtered.filter(
        (p) => p.category.toUpperCase() === filterCategory
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [filterCategory, searchTerm]);

  const handleFilterChange = (category: string, search: string) => {
    setFilterCategory(category);
    setSearchTerm(search);
  };

  return (
    <>
      <FilterBar categories={categories} onFilterChange={handleFilterChange} />
      <ProductList products={filteredProducts} />
    </>
  );
}
