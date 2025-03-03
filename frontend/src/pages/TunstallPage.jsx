import React, { useState } from "react";
import axios from "axios";
import TunstallTree from "../components/TunstallTree";
import Layout from "../components/Layout";

const TunstallPage = () => {
  const [inputs, setInputs] = useState([{ symbol: "", probability: "" }, {symbol: "", probability: ""}]);
  const [n, setN] = useState(2);
  const [length, setLength] = useState(3);
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

    if (!Number.isInteger(length) || length < 1) {
      return "La longitud del código debe ser un número entero mayor o igual a 1.";
    }
    if (n ** length < symbolsArray.length) {
      return "Los datos no son válidos. Dz^n debe ser mayor o igual al número de símbolos.";
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

      const response = await axios.post("http://localhost:8000/tunstall", {
        symbols: symbolsArray,
        probabilities: probabilitiesArray,
        n: n,
        length: length,
      });

      setTreeData(response.data);
      console.log("Tree Data:", response.data); // Debugging
      setCurrentStep(0); // Reset to the first step
    } catch (err) {
      setError(err.message || "Error procesando la codificación de Tunstall.");
    }
  };

  const handleNextStep = () => {
    console.log("Next Step:", currentStep + 1); // Debugging
    if (treeData && currentStep < treeData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    console.log("Previous Step:", currentStep - 1); // Debugging
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setInputs([{ symbol: "", probability: "" },{symbol: "", probability: ""}]); // Reset to one empty input
    setN(2); // Reset arity to default value
    setLength(3); // Reset code length to default value
    setTreeData(null); // Clear tree data
    setError(""); // Clear any errors
    setCurrentStep(0); // Reset step counter
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Codificación de Tunstall</h2>
        <p className="text-gray-300 mb-4">
          El algoritmo de Tunstall es un método de compresión sin pérdida que genera códigos de longitud fija a partir de una fuente de longitud variable.
          Se basa en la construcción de un árbol en el que los símbolos más probables se expanden iterativamente hasta alcanzar el número máximo de nodos permitido.
          A diferencia de Huffman, Tunstall permite una decodificación más rápida, ya que todos los códigos generados tienen la misma longitud.
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
          <button type="button" onClick={addInput} className="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold">
            + Añadir símbolo
          </button>
          <div>
            <label className="block mb-1">Aridad del árbol (Dz)</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              min="2"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Longitud del código (n)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              min="1"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="w-1/2 p-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
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
            <h2 className="text-lg font-semibold mt-4">Árbol de Tunstall:</h2>
            <div style={{ width: "100%", height: "500px" }}>
              <TunstallTree data={treeData.steps} currentStep={currentStep} /> {/* Pass currentStep */}
            </div>
            <p className="mt-4 text-gray-400">
              {treeData.steps[currentStep].description}
            </p>
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
                {treeData.encoding.map((item, index) => (
                  <li key={index} className="text-white">
                    <strong>{item.Word}:</strong> <span className="font-mono text-yellow-300">{item.Code}</span>
                  </li>
                ))}
              </ul>
            </div>
            <h2 className="text-lg font-semibold mt-4">Métricas:</h2>
            <p><strong>Entropía:</strong> {treeData.entropy ? (treeData.entropy).toFixed(4) + " bits" : "N/A"}</p>
            <p><strong>Longitud Promedio:</strong> {treeData.average_length ? (treeData.average_length).toFixed(4) + " bits/símbolo" : "N/A"}</p>
            <p><strong>Eficiencia:</strong> {treeData.efficiency ? (treeData.efficiency * 100).toFixed(2) + "%" : "N/A"}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TunstallPage;