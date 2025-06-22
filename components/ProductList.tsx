"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ProductCard, Product } from "./ProductCard";

interface Props { products: Product[] }
const PAGE_SIZE = 10;

export const ProductList: React.FC<Props> = ({ products }) => {
  // 1) Leo lo que ya tengo guardado
  const saved = typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("catalogState") || "{}")
    : {};

  const initialPage = saved.page || 1;

  // 2) Inicializo estado con contenido ya cortado
  const [page, setPage] = useState<number>(initialPage);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(
    () => products.slice(0, initialPage * PAGE_SIZE)
  );
  const [restored, setRestored] = useState(false);
  const loader = useRef<HTMLDivElement>(null);

  // 3) Desactivo el scrollRestoration automático de Next.js/browser
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 4) Restauro el scroll **antes del paint** (useLayoutEffect)
  useLayoutEffect(() => {
    if (restored) return;
    if (typeof saved.scroll === "number") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: saved.scroll, behavior: "auto" });
        });
      });
    }
    setRestored(true);
  }, [restored, saved.scroll]);

  // 5) Cada vez que cambie `page`, recorto la lista
  useEffect(() => {
    setVisibleProducts(products.slice(0, page * PAGE_SIZE));
  }, [products, page]);

  // 6) Guardo page+scroll en sessionStorage
  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem(
        "catalogState",
        JSON.stringify({ page, scroll: window.scrollY })
      );
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  // 7) IntersectionObserver para lazy-load
  useEffect(() => {
    if (!loader.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && page * PAGE_SIZE < products.length) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    obs.observe(loader.current);
    return () => obs.disconnect();
  }, [loader, page, products]);

  return (
    <>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mx-3'>
        {visibleProducts.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </section>
      <div ref={loader} />
    </>
  );
};
