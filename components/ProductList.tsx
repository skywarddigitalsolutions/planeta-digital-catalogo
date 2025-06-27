// components/ProductList.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductCard, Product } from "./ProductCard";

interface Props {
  products: Product[];
}

const PAGE_SIZE = 10;

export const ProductList: React.FC<Props> = ({ products }) => {
  const loader = useRef<HTMLDivElement>(null);

  // 1) Siempre arrancamos en page=1
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState<Product[]>([]);

  // 2) Al montar en el cliente, restauramos page y scroll si existen
  useEffect(() => {
    const savedPage = typeof window !== "undefined"
      ? sessionStorage.getItem("catalogPage")
      : null;
    if (savedPage) {
      setPage(parseInt(savedPage, 10));
    }
    const savedScroll = typeof window !== "undefined"
      ? sessionStorage.getItem("catalogScroll")
      : null;
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }
  }, []);

  // 3) Cada vez que cambien products o page, recortamos el slice
  useEffect(() => {
    setVisible(products.slice(0, page * PAGE_SIZE));
  }, [products, page]);

  // 4) Guardar page en sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("catalogPage", page.toString());
    }
  }, [page]);

  // 5) Guardar scroll
  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "catalogScroll",
          window.scrollY.toString()
        );
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 6) IntersectionObserver para cargar más
  useEffect(() => {
    if (!loader.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          page * PAGE_SIZE < products.length
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0 }
    );
    obs.observe(loader.current);
    return () => obs.disconnect();
  }, [page, products]);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mx-3">
        {visible.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </section>
      <div ref={loader} className="h-px" />
    </>
  );
};
