import React from "react";
import Image from "next/image";

export interface Product {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
}

interface Props {
  product: Product;
}



export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <article className="border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
      <div className="flex-shrink-0 w-24 h-24 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 200px"
          priority={false}
        />
      </div>
      <div className="flex flex-col justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="font-bold mt-1 text-gray-800">{product.price}</p>
      </div>
    </article>
  );
};
