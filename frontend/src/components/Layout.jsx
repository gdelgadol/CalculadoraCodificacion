import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md">
        <nav className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-xl font-bold">Codificación</h1>
          <button className="md:hidden text-white focus:outline-none">☰</button>
          <ul className="hidden md:flex space-x-6">
            <li><a href="/sardinas-patterson" className="hover:text-gray-400">Sardinas-Patterson</a></li>
            <li><a href="/shannon-fano" className="hover:text-gray-400">Shannon-Fano</a></li>
            <li><a href="/huffman" className="hover:text-gray-400">Huffman</a></li>
            <li><a href="#" className="hover:text-gray-400">Tunstall</a></li>
            <li><a href="#" className="hover:text-gray-400">Códigos Lineales (En construcción)</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {children} {/* This is where the page content will be injected */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400 text-xs md:text-sm">
        <p>Creado por Gabriel Santiago Delgado Lozano</p>
        <p>Teoría de Codificación | 2024-2 | Universidad Nacional de Colombia</p>
      </footer>
    </div>
  );
};

export default Layout;