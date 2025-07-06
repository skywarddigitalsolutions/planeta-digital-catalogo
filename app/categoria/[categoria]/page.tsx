"use client"
import { useMemo, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { FilterBar } from "@/components/FilterBar"
import { ProductList } from "@/components/ProductList"
import { useCatalogStore } from "@/store/catalogStore"
import productosData from "@/data/productos.json"
import { slugify } from "@/utils/string"

export default function CategoriaPage() {
  const router = useRouter()
  const params = useParams()
  const { setFilters } = useCatalogStore()

  // 1) Extraemos el slug de la URL
  const rawParam =
    typeof params.categoria === "string"
      ? params.categoria
      : Array.isArray(params.categoria) && params.categoria.length > 0
        ? params.categoria[0]
        : ""

  // 2) Reconstruimos la categoría original con ñ y tildes
  const filterCat = useMemo(() => {
    // todas las categorías EXACTAS de tu JSON
    const allCats = Array.from(new Set(productosData.products.map((p) => p.category)))
    // buscar la que coincida en slug
    return allCats.find((cat) => slugify(cat).toLowerCase() === rawParam.toLowerCase()) || "TODAS"
  }, [rawParam])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("")

  // 3) Sincronizar con el store cuando cambie la categoría
  useEffect(() => {
    setFilters({
      category: filterCat.toUpperCase(),
      searchTerm: "",
      sortOption: "",
    })
    setSearchTerm("")
    setSortOption("")
  }, [filterCat, setFilters])

  // 4) Lista de categorías para el sidebar (en mayúsculas)
  const categories = useMemo(() => {
    const cats = productosData.products.map((p) => p.category.toUpperCase())
    return ["TODAS", ...Array.from(new Set(cats))]
  }, [])

  // 5) Filtrar + búsqueda + orden
  const filteredProducts = useMemo(() => {
    let list = productosData.products

    if (filterCat !== "TODAS") {
      list = list.filter((p) => p.category === filterCat)
    }

    if (searchTerm.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (sortOption) {
      list = [...list]
      if (sortOption === "priceAsc") {
        list.sort(
          (a, b) =>
            Number.parseFloat(a.price.replace(/[^0-9.]/g, "")) - Number.parseFloat(b.price.replace(/[^0-9.]/g, "")),
        )
      }
      if (sortOption === "priceDesc") {
        list.sort(
          (a, b) =>
            Number.parseFloat(b.price.replace(/[^0-9.]/g, "")) - Number.parseFloat(a.price.replace(/[^0-9.]/g, "")),
        )
      }
      if (sortOption === "nameAsc") {
        list.sort((a, b) => a.name.localeCompare(b.name))
      }
      if (sortOption === "nameDesc") {
        list.sort((a, b) => b.name.localeCompare(a.name))
      }
    }

    return list
  }, [filterCat, searchTerm, sortOption])

  const handleFilterChange = (category: string, search: string, sort: string) => {
    setSearchTerm(search)
    setSortOption(sort)

    // Si cambia la categoría, navegar a la nueva URL
    if (category !== filterCat.toUpperCase()) {
      if (category === "TODAS") {
        router.push("/")
      } else {
        const slug = slugify(category)
        router.push(`/categoria/${slug}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className="lg:hidden">
        <FilterBar
          categories={categories}
          selectedCategory={filterCat.toUpperCase()}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar desktop - SIN sticky para que se mueva con el scroll */}
        <aside className="hidden lg:block">
          <FilterBar
            categories={categories}
            selectedCategory={filterCat.toUpperCase()}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Contenido */}
        <section className="px-4 lg:px-0">
          {/* Título con padding superior aumentado para que no se esconda */}
          <h2 className="text-2xl font-bold mb-4 text-center text-black pt-32 lg:pt-24">
            {filterCat === "TODAS" ? "Todos los productos" : filterCat}
          </h2>
          <ProductList products={filteredProducts} />
        </section>
      </div>
    </div>
  )
}
