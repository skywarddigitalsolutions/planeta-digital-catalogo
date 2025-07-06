import { create } from "zustand";
import { Product } from "@/components/ProductCard";

interface ProductModalState {
  isOpen: boolean;
  product: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

export const useProductModalStore = create<ProductModalState>((set) => ({
  isOpen: false,
  product: null,
  openModal: (product) => set({ isOpen: true, product }),
  closeModal: () => set({ isOpen: false, product: null }),
}));
