// app/categoria/[categoria]/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { ProductList } from "@/components/ProductList";
import productosData from "@/data/productos.json";
import { slugify } from "@/utils/string";

export default function CategoriaPage() {
  // 1) Extraemos el slug de la URL
  const params = useParams();
  const rawParam = typeof params.categoria === "string"
    ? params.categoria
    : Array.isArray(params.categoria) && params.categoria.length > 0
    ? params.categoria[0]
    : "";

  // 2) Reconstruimos la categoría original con ñ y tildes
  const filterCat = useMemo(() => {
    // todas las categorías EXACTAS de tu JSON
    const allCats = Array.from(
      new Set(productosData.products.map((p) => p.category))
    );
    // buscar la que coincida en slug
    return (
      allCats.find(
        (cat) => slugify(cat).toLowerCase() === rawParam.toLowerCase()
      ) || "TODAS"
    );
  }, [rawParam]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // 3) Lista de categorías para el sidebar (en mayúsculas)
  const categories = useMemo(() => {
    const cats = productosData.products.map((p) => p.category.toUpperCase());
    return ["TODAS", ...Array.from(new Set(cats))];
  }, []);

  // 4) Filtrar + búsqueda + orden
  const filteredProducts = useMemo(() => {
    let list = productosData.products;
    if (filterCat !== "TODAS") {
      list = list.filter((p) => p.category === filterCat);
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
  }, [filterCat, searchTerm, sortOption]);

  const handleFilterChange = (
    category: string,
    search: string,
    sort: string
  ) => {
    setSearchTerm(search);
    setSortOption(sort);
  };

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      {/* Sidebar móvil */}
      <div className="lg:hidden">
        <FilterBar
          categories={categories}
          selectedCategory={filterCat.toUpperCase()}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden lg:block sticky top-20 self-start">
        <FilterBar
          categories={categories}
          selectedCategory={filterCat.toUpperCase()}
          onFilterChange={handleFilterChange}
        />
      </aside>

      {/* Contenido */}
      <section className="pt-4 px-4 lg:px-0">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {filterCat === "TODAS" ? "Todos los productos" : filterCat}
        </h2>
        <ProductList products={filteredProducts} />
      </section>
    </div>
  );
}
