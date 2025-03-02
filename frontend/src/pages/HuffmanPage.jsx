import React, { useState } from "react";
import HuffmanTree from "../components/HuffmanTree";
import Layout from "../components/Layout";
import axios from "axios";

const HuffmanPage = () => {
  const [inputs, setInputs] = useState([{ symbol: "", probability: "" }]);
  const [n, setN] = useState(2);
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, { symbol: "", probability: "" }]);
  };

  const removeInput = (index) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const symbolsArray = inputs.map((input) => input.symbol.trim());
      const probabilitiesArray = inputs.map((input) => parseFloat(input.probability));

      if (symbolsArray.includes("") || probabilitiesArray.some(isNaN)) {
        throw new Error("All symbols and probabilities must be filled correctly.");
      }

      const response = await axios.post("http://localhost:8000/huffman", {
        symbols: symbolsArray,
        probabilities: probabilitiesArray,
        n: n,
      });

      setTreeData(response);
      console.log(response.data);
      console.log(treeData.data.encoding);
    } catch (err) {
      setError(err.message || "Error processing Huffman encoding.");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Codificación de Huffman</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputs.map((input, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={input.symbol}
                onChange={(e) => handleChange(index, "symbol", e.target.value)}
                className="w-1/2 p-2 rounded bg-gray-700 text-white"
                placeholder="Símbolo"
                required
              />
              <input
                type="number"
                value={input.probability}
                onChange={(e) => handleChange(index, "probability", e.target.value)}
                className="w-1/2 p-2 rounded bg-gray-700 text-white"
                placeholder="Probabilidad"
                required
              />
              <button type="button" onClick={() => removeInput(index)} className="text-red-400">×</button>
            </div>
          ))}
          <button type="button" onClick={addInput} className="w-full p-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold">
            + Añadir símbolo
          </button>
          <div>
            <label className="block mb-1">Aridad del árbol</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              min="2"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
          >
            Codificar
          </button>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
        {treeData && <HuffmanTree data={treeData.data.steps} />}
        <h2 className="text-lg font-semibold mt-4">Métricas:</h2>
        <p><strong>Entropía:</strong> {treeData.data.entropy ? treeData.data.entropy + " bits" : "N/A"}</p>
        <p><strong>Longitud Promedio:</strong> {treeData.data.average_length ? treeData.data.average_length + " bits/símbolo" : "N/A"}</p>
        <p><strong>Eficiencia:</strong> {treeData.data.efficiency ? (treeData.data.efficiency * 100).toFixed(2) + "%" : "N/A"}</p>
      </div>
    </Layout>
  );
};

export default HuffmanPage;
