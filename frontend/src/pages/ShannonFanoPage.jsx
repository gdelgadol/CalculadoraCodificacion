import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout.jsx"; // Import the Layout component

function ShannonFanoPage() {
  const [symbols, setSymbols] = useState([""]);
  const [probabilities, setProbabilities] = useState([""]);
  const [result, setResult] = useState(null);

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

  const submitData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/shannon-fano", {
        symbols,
        probabilities: probabilities.map(Number),
      }, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(response.data);
      console.log(response.data);
      console.log(response.data.encoding);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const resetAllValues = () => {
    setSymbols([""]);
    setProbabilities([""]);
    setResult(null);
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Shannon-Fano</h1>

        {symbols.map((symbol, index) => (
          <div key={index} className="flex flex-col md:flex-row md:space-x-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => updateSymbol(index, e.target.value)}
              className="w-full md:w-1/2 bg-gray-800 p-2 rounded-md text-white my-2"
              placeholder={`Símbolo ${index + 1}`}
            />
            <input
              type="number"
              step="any"
              value={probabilities[index]}
              onChange={(e) => updateProbability(index, e.target.value)}
              className="w-full md:w-1/2 bg-gray-800 p-2 rounded-md text-white my-2"
              placeholder={`Probabilidad ${index + 1}`}
            />
          </div>
        ))}

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <button onClick={addSymbol} className="bg-blue-500 px-4 py-2 rounded-md">Añadir símbolo</button>
          <button onClick={submitData} className="bg-green-500 px-4 py-2 rounded-md">Codificar</button>
          <button onClick={resetAllValues} className="bg-red-500 px-4 py-2 rounded-md">Resetear</button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md">
            <h2 className="text-xl font-semibold">Codificación:</h2>
            <ul>
              {symbols
                  .map((symbol, index) => ({ symbol, probability: probabilities[index] }))
                  .sort((a, b) => b.probability - a.probability) // Orden descendente por probabilidad
                  .map(({ symbol, probability }) => (
                  <li key={symbol}>
                      {symbol} (<span className="text-yellow-300">{probability}</span>): 
                      <span className="font-mono text-yellow-300"> {result.encoding[symbol]}</span>
                  </li>
                  ))}
             </ul>

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