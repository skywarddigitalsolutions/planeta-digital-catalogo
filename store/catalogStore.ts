import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CatalogState {
  page: number
  scrollY: number
  filters: {
    category: string
    searchTerm: string
    sortOption: string
  }
  setPage: (page: number) => void
  setScrollY: (scrollY: number) => void
  setFilters: (filters: Partial<CatalogState["filters"]>) => void
  resetCatalog: () => void
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      page: 1,
      scrollY: 0,
      filters: {
        category: "TODAS",
        searchTerm: "",
        sortOption: "",
      },
      setPage: (page) => set({ page }),
      setScrollY: (scrollY) => set({ scrollY }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          page: 1, // Reset page when filters change
          scrollY: 0, // Reset scroll when filters change
        })),
      resetCatalog: () => set({ page: 1, scrollY: 0 }),
    }),
    {
      name: "catalog-storage",
      partialize: (state) => ({
        page: state.page,
        scrollY: state.scrollY,
        filters: state.filters,
      }),
    },
  ),
)
