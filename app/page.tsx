"use client"
import { useMemo, useEffect } from "react"
import { ProductList } from "@/components/ProductList"
import { FilterBar } from "@/components/FilterBar"
import { useCatalogStore } from "@/store/catalogStore"
import productosData from "../data/productos.json"

export default function Home() {
  const { filters, setFilters } = useCatalogStore();
  const { category: filterCategory, searchTerm, sortOption } = filters

  useEffect(() => {
    if (filterCategory !== "TODAS") {
      setFilters({
        category: "TODAS",
        searchTerm: "",
        sortOption: "",
      });
    };
  }, [filterCategory, setFilters])

  const categories = useMemo(() => {
    const cats = productosData.products.map((p) => p.category.toUpperCase())
    return ["TODAS", ...Array.from(new Set(cats))]
  }, []);

  const parsePrice = (raw: string) =>
  parseFloat(
    raw
      .replace(/[^\d,\.]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );

  const filteredSorted = useMemo(() => {
    let list = productosData.products;

    if (filterCategory !== "TODAS") {
      list = list.filter(p => p.category.toUpperCase() === filterCategory);
    }
    if (searchTerm.trim()) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortOption) {
      list = [...list];
      switch (sortOption) {
        case "priceAsc":
          list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
          break;
        case "priceDesc":
          list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
          break;
        case "nameAsc":
          list.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          list.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }
    return list;
  }, [filterCategory, searchTerm, sortOption]);

  const handleFilterChange = (category: string, search: string, sort: string) => {
    setFilters({
      category,
      searchTerm: search,
      sortOption: sort,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className="lg:hidden">
        <FilterBar categories={categories} selectedCategory="TODAS" onFilterChange={handleFilterChange} />
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar desktop - SIN sticky para que se mueva con el scroll */}
        <aside className="hidden lg:block">
          <FilterBar categories={categories} selectedCategory="TODAS" onFilterChange={handleFilterChange} />
        </aside>

        {/* Contenido */}
        <section className="px-4 lg:px-0 pt-12 min-h-screen">
          {/* Título con margen superior para evitar que se esconda */}
          <h2 className="text-2xl font-bold mb-4 text-black text-center pt-8 lg:pt-8">Todos los productos</h2>
          <ProductList products={filteredSorted} />
        </section>
      </div>
    </div>
  )
}