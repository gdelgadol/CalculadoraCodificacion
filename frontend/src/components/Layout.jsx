import React, { useState } from "react";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <nav className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-5xl font-bold">
            <a href="/">Codificación</a>
          </h1>

          {/* Burger Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <ul
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:w-auto md:flex md:space-x-6 mt-4 md:mt-0`}
          >
            <li>
              <a href="/sardinas-patterson" className="hover:text-gray-400 block md:inline-block py-2 md:py-0">
                Sardinas-Patterson
              </a>
            </li>
            <li>
              <a href="/shannon-fano" className="hover:text-gray-400 block md:inline-block py-2 md:py-0">
                Shannon-Fano
              </a>
            </li>
            <li>
              <a href="/huffman" className="hover:text-gray-400 block md:inline-block py-2 md:py-0">
                Huffman
              </a>
            </li>
            <li>
              <a href="/tunstall" className="hover:text-gray-400 block md:inline-block py-2 md:py-0">
                Tunstall
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400 block md:inline-block py-2 md:py-0">
                Códigos Lineales (En construcción)
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {children} {/* This is where the page content will be injected */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400 text-xs md:text-sm">
        <p>Teoría de Codificación | 2024-2 | Universidad Nacional de Colombia</p>
      </footer>
    </div>
  );
};

export default Layout;