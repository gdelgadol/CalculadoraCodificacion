import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import HuffmanTree from "../components/HuffmanTree"; // Import the D3 tree component

const HuffmanPage = () => {
  const [inputs, setInputs] = useState([{ symbol: "", probability: "" }]);
  const [n, setN] = useState(2);
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // Track the current step

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

  const validateInputs = () => {
    const symbolsArray = inputs.map((input) => input.symbol.trim());
    const probabilitiesArray = inputs.map((input) => parseFloat(input.probability));

    if (symbolsArray.includes("") || probabilitiesArray.some(isNaN)) {
      return "Todos los símbolos y probabilidades deben estar llenos correctamente.";
    }

    if (probabilitiesArray.some((p) => p <= 0 || p >= 1)) {
      return "Las probabilidades deben ser valores decimales entre 0 y 1 (excluyendo 0 y 1).";
    }

    const totalProbability = probabilitiesArray.reduce((sum, p) => sum + p, 0);
    if (Math.abs(totalProbability - 1) > 1e-6) {
      return `La suma de las probabilidades debe ser 1. Actualmente es ${totalProbability.toFixed(6)}.`;
    }

    if (!Number.isInteger(n) || n < 2) {
      return "El valor de aridad (n) debe ser un número entero mayor o igual a 2.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const symbolsArray = inputs.map((input) => input.symbol.trim());
      const probabilitiesArray = inputs.map((input) => parseFloat(input.probability));

      const response = await axios.post("http://localhost:8000/huffman", {
        symbols: symbolsArray,
        probabilities: probabilitiesArray,
        n: n,
      });

      setTreeData(response.data);
      setCurrentStep(0); // Reset to the first step
    } catch (err) {
      setError(err.message || "Error procesando la codificación de Huffman.");
    }
  };

  const handleNextStep = () => {
    if (treeData && currentStep < treeData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset function
  const handleReset = () => {
    setInputs([{ symbol: "", probability: "" }]); // Reset to one empty input
    setN(2); // Reset arity to default value
    setTreeData(null); // Clear tree data
    setError(""); // Clear any errors
    setCurrentStep(0); // Reset step counter
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Codificación de Huffman</h2>
        <p className="text-gray-300 mb-4">
          El algoritmo de Huffman es un método de compresión sin pérdida que asigna códigos binarios de longitud variable a los símbolos de una fuente,
          de manera que los símbolos más frecuentes tengan códigos más cortos. Se construye un árbol de Huffman fusionando los símbolos de menor probabilidad
          en cada iteración hasta formar una única estructura jerárquica. Este algoritmo es ampliamente utilizado en la compresión de datos y transmisión eficiente.
        </p>
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
                step="0.1"
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
              value={n === 0 ? "" : n}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") {
                  setN("");
                } else {
                  const parsed = parseFloat(newValue);
                  if (!isNaN(parsed) && parsed >= 2) {
                    setN(parsed);
                  }
                }
              }}
              min="2"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="w-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
            >
              Codificar
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-1/2 p-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold"
            >
              Reiniciar
            </button>
          </div>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
        {treeData && (
          <div>
            <h2 className="text-lg font-semibold mt-4">Árbol de Huffman:</h2>
            <div style={{ width: "100%", height: "500px" }}>
              <HuffmanTree data={treeData.steps[currentStep].tree} />
            </div>
            <p className="mt-4 text-gray-400">{treeData.steps[currentStep].description}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep === treeData.steps.length - 1}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <h2 className="text-lg font-semibold mt-4">Codificación:</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <ul>
                {Object.entries(treeData.encoding).map(([symbol, code]) => (
                  <li key={symbol} className="text-white">
                    <strong>{symbol}:</strong> <span className="font-mono text-yellow-300">{code}</span>
                  </li>
                ))}
              </ul>
            </div>
            <h2 className="text-lg font-semibold mt-4">Métricas:</h2>
            <p><strong>Entropía:</strong> {treeData.entropy ? treeData.entropy + " bits" : "N/A"}</p>
            <p><strong>Longitud Promedio:</strong> {treeData.average_length ? treeData.average_length + " bits/símbolo" : "N/A"}</p>
            <p><strong>Eficiencia:</strong> {treeData.efficiency ? (treeData.efficiency).toFixed(2) + "%" : "N/A"}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HuffmanPage;