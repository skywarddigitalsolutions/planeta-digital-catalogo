"use client";

import React, { useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import Image from "next/image";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        {/* Botón hamburguesa */}
        <button
          aria-label="Abrir menú"
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(true)}
        >
          <HiOutlineMenu size={24} />
        </button>

        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Logo de la marca"
          width={40}
          height={20}
          priority
        />

        {/* Icono perfil y entrar para desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-gray-700 hover:text-gray-900">Entrar</button>
          <button aria-label="Perfil">
            <svg
              className="w-6 h-6 text-gray-700 hover:text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0113 0" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay menú lateral */}
      <div
        className={`fixed inset-0 bg-white bg-opacity-70 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col p-6`}
      >
        {/* Botón cerrar */}
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

        {/* Contenido menú */}
        <nav className="flex flex-col gap-4 text-gray-800 font-semibold">
          <a href="#" className="hover:text-black">INICIAR SESIÓN / REGISTRARSE</a>
          <a href="#" className="hover:text-black">MI CUENTA</a>
          <a href="#" className="hover:text-black">MIS PEDIDOS</a>

          <hr className="my-4 border-gray-300" />

          <p className="uppercase font-bold mb-2">Planeta digital</p>

          <div className="flex flex-col gap-3 text-sm font-normal">
            <a href="https://wa.me/541151656813" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black">
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
                <path d="M16.5 3.5a12.25 12.25 0 0 1 3 8.75 12.25 12.25 0 0 1-21 7.5L3 21l3.5-1a12.25 12.25 0 0 1 8.75 3z" />
              </svg>
              +54 11 5165 6813
            </a>

            <a href="tel:+5491135657692" className="flex items-center gap-2 hover:text-black">
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
              +5491135657692
            </a>

            <address className="not-italic text-gray-600">
              Pasteur 277 - Local 32
            </address>
          </div>
        </nav>
      </aside>
    </>
  );
};
