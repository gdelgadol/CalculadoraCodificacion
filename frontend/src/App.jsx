import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SardinasPattersonPage from "./pages/SardinasPattersonPage";
import ShannonFanoPage from "./pages/ShannonFanoPage";
import HuffmanPage from "./pages/HuffmanPage";
import TunstallPage from "./pages/TunstallPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sardinas-patterson" element={<SardinasPattersonPage />} />
        <Route path="/shannon-fano" element={<ShannonFanoPage />} />
        <Route path="/huffman" element={<HuffmanPage />} />
        <Route path="/tunstall" element={<TunstallPage />} />
      </Routes>
    </Router>
  );
}

export default App;
