"use client";

import { ProductList } from "@/components/ProductList";
import productosData from "../data/productos.json";
import { FilterBar } from "@/components/FilterBar";
import { useMemo, useState } from "react";

export default function Home() {
  const [filterCategory, setFilterCategory] = useState("TODO");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");


  const categories = useMemo(() => {
    const cats = productosData.products.map(p => p.category.toUpperCase());
    return ["TODO", ...Array.from(new Set(cats))];
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = productosData.products;

    if (filterCategory !== "TODO") {
      filtered = filtered.filter(
        (p) => p.category.toUpperCase() === filterCategory.toUpperCase()
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption) {
      filtered = [...filtered];
      switch (sortOption) {
        case "priceAsc":
          filtered.sort(
            (a, b) =>
              parseFloat(a.price.replace(/[^0-9.-]+/g, "")) -
              parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
          );
          break;
        case "priceDesc":
          filtered.sort(
            (a, b) =>
              parseFloat(b.price.replace(/[^0-9.-]+/g, "")) -
              parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
          );
          break;
        case "nameAsc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    return filtered;
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
    <>
      <FilterBar categories={categories} onFilterChange={handleFilterChange} />
      <ProductList products={filteredProducts} />
    </>
  );
}
