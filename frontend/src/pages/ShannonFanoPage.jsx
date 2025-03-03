import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout.jsx"; // Import the Layout component

function ShannonFanoPage() {
  const [symbols, setSymbols] = useState(["", ""]); // Start with at least two symbols
  const [probabilities, setProbabilities] = useState(["", ""]); // Start with at least two probabilities
  const [result, setResult] = useState(null);
  const [error, setError] = useState(""); // State for error messages

  const addSymbol = () => {
    setSymbols([...symbols, ""]);
    setProbabilities([...probabilities, ""]);
  };

  const updateSymbol = (index, value) => {
    const newSymbols = [...symbols];
    newSymbols[index] = value;
    setSymbols(newSymbols);
  };

  const updateProbability = (index, value) => {
    const newProbabilities = [...probabilities];
    newProbabilities[index] = value;
    setProbabilities(newProbabilities);
  };

  const removeSymbol = (index) => {
    if (symbols.length > 2) {
      setSymbols(symbols.filter((_, i) => i !== index));
      setProbabilities(probabilities.filter((_, i) => i !== index));
    } else {
      setError("Debe haber al menos dos símbolos.");
    }
  };

  const validateProbabilities = () => {
    const totalProbability = probabilities
      .map((p) => parseFloat(p))
      .reduce((sum, p) => sum + p, 0);
    return Math.abs(totalProbability - 1) < 0.00001; // Account for floating-point precision
  };

  const submitData = async () => {
    setError(""); // Clear previous errors

    // Validate at least two symbols
    if (symbols.length < 2) {
      setError("Debe haber al menos dos símbolos.");
      return;
    }

    // Validate probabilities sum to 1
    if (!validateProbabilities()) {
      setError("Las probabilidades deben sumar 1.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/shannon-fano",
        {
          symbols,
          probabilities: probabilities.map(Number),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
      setError("Error al enviar los datos. Inténtelo de nuevo.");
    }
  };

  const resetAllValues = () => {
    setSymbols(["", ""]); // Reset to at least two symbols
    setProbabilities(["", ""]); // Reset to at least two probabilities
    setResult(null);
    setError("");
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Shannon-Fano</h1>
        <p className="text-gray-300 mb-4">
          El algoritmo de Shannon-Fano es un método de compresión sin pérdida que asigna códigos de longitud variable a los símbolos de una fuente.
          Se basa en dividir recursivamente el conjunto de símbolos en dos grupos de probabilidades similares, asignando 0 y 1 a cada partición.
          Este proceso continúa hasta que cada símbolo recibe un código único, permitiendo una codificación eficiente.
        </p>

        {/* Error Message */}
        {error && (
          <div className="text-red-400">
            {error}
          </div>
        )}

        {/* Symbol and Probability Inputs */}
        {symbols.map((symbol, index) => (
          <div key={index} className="flex space-x-4 items-center space-y-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => updateSymbol(index, e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder={"Símbolo"}
            />
            <input
              type="number"
              step="any"
              value={probabilities[index]}
              onChange={(e) => updateProbability(index, e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              placeholder={"Probabilidad"}
            />
            <button
              onClick={() => removeSymbol(index)}
              className="text-red-400 mt-4"
              disabled={symbols.length <= 2} // Disable remove button if only two symbols
            >
              ×
            </button>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <button
            onClick={addSymbol}
            className="bg-blue-500 px-4 py-2 rounded-md font-bold"
          >
            Añadir símbolo
          </button>
          <button
            onClick={submitData}
            className="bg-green-500 px-4 py-2 rounded-md font-bold"
          >
            Codificar
          </button>
          <button
            onClick={resetAllValues}
            className="bg-red-500 px-4 py-2 rounded-md font-bold"
          >
            Reiniciar
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md">
            <h2 className="text-xl font-semibold">Codificación:</h2>
            <ul>
              {symbols
                .map((symbol, index) => ({ symbol, probability: probabilities[index] }))
                .sort((a, b) => b.probability - a.probability) // Sort by probability
                .map(({ symbol, probability }) => (
                  <li key={symbol}>
                    {symbol} (<span className="text-yellow-300">{probability}</span>):
                    <span className="font-mono text-yellow-300"> {result.encoding[symbol]}</span>
                  </li>
                ))}
            </ul>

            {/* Steps Table */}
            {result.steps && result.steps.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-4">Pasos:</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 p-2">Iteración</th>
                        <th className="border border-gray-600 p-2">Partición Superior (0)</th>
                        <th className="border border-gray-600 p-2">Partición Inferior (1)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.steps.map((step, index) => (
                        <tr key={index} className="border border-gray-700">
                          <td className="border border-gray-600 p-2 text-center">{step.depth}</td>
                          <td className="border border-gray-600 p-2">{JSON.stringify(step.left)}</td>
                          <td className="border border-gray-600 p-2">{JSON.stringify(step.right)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Metrics */}
            <h2 className="text-lg font-semibold mt-4">Métricas:</h2>
            <p><strong>Entropía:</strong> {result.entropy ? (result.entropy).toFixed(4) + " bits" : "N/A"}</p>
            <p><strong>Longitud Promedio:</strong> {result.average_length ? (result.average_length).toFixed(4) + " bits/símbolo" : "N/A"}</p>
            <p><strong>Eficiencia:</strong> {result.efficiency ? (result.efficiency * 100).toFixed(2) + "%" : "N/A"}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ShannonFanoPage;