"use client";

import React, { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import Image from "next/image";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        <button
          aria-label="Abrir menú"
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(true)}
        >
          <HiOutlineMenu size={24} />
        </button>

        <a href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo de la marca"
            width={40}
            height={20}
            priority
          />
        </a>

      </nav>

      <div
        className={`fixed inset-0 bg-white bg-opacity-70 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col p-6`}
      >

        <button
          aria-label="Cerrar menú"
          className="self-end mb-6 text-gray-700 hover:text-gray-900"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav className="flex flex-col gap-4 text-gray-800 font-semibold">

          <div className="flex flex-col gap-3 text-sm">
            <p className="uppercase mb-2 text-gray-900">Planeta digital</p>

            <h4>Contacto: </h4>
            <a href="tel:2271438717" className="flex items-center gap-2 hover:text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.18 12.18 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9a16 16 0 0 0 6 6l1.17-1.17a2 2 0 0 1 2.11-.45 12.18 12.18 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              2271438717
            </a>

            <h4>Ubicación: </h4>
            <address className="not-italic text-gray-600">
              Petracchi 602 san Miguel del monte
            </address>
          </div>

        </nav>
      </aside>
    </>
  );
};
