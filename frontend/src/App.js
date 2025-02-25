import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HuffmanPage from "./pages/HuffmanPage";
//import TunstallPage from "./pages/TunstallPage";
import ShannonFanoPage from "./pages/ShannonFanoPage";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/huffman">Huffman Coding</Link></li>
          <li><Link to="/shannon-fano">Shannon-Fano Coding</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/huffman" element={<HuffmanPage />} />
        <Route path="/shannon-fano" element={<ShannonFanoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
