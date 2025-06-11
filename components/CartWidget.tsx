"use client";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

export const CartWidget = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // No mostramos el widget si estamos en la ruta /cart
  if (pathname === "/cart") return null;

  return (
    <button
      onClick={() => router.push("/cart")}
      className="fixed bottom-20 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2 z-50"
      aria-label="Ver carrito"
    >
      <FaShoppingCart /> {cartItems.length}
    </button>
  );
};
