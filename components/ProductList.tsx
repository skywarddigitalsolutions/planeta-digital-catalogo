"use client";

import React, { useEffect, useState, useRef } from "react";
import { ProductCard, Product } from "./ProductCard";

interface Props {
  products: Product[];
}

const PAGE_SIZE = 10;

export const ProductList: React.FC<Props> = ({ products }) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleProducts(products.slice(0, PAGE_SIZE));
  }, [products]);

  useEffect(() => {
    if (page === 1) return;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setVisibleProducts((prev) => [...prev, ...products.slice(start, end)]);
  }, [page, products]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page * PAGE_SIZE < products.length) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) obs.observe(loader.current);
    return () => {
      if (loader.current) obs.unobserve(loader.current);
    };
  }, [loader, page, products]);

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-8 mt-5 mb-10">
        {visibleProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </section>
      <div ref={loader} />
    </>
  );
};
