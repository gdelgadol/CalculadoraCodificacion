import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Layout from "../components/Layout.jsx"; // Import the Layout component

function SardinasPattersonPage() {
  const [words, setWords] = useState(["", ""]); // Inicialmente dos campos vacíos
  const [result, setResult] = useState(null);

  const addWord = () => {
    setWords([...words, ""]);
  };

  const updateWord = (index, value) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const removeWord = (index) => {
    if (words.length > 2) {
      setWords(words.filter((_, i) => i !== index));
    }
  };

  const submitWords = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/sardinas-patterson", 
        words,
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  const resetWords = () => {
    setWords(["", ""]); // Reset to initial state (two empty fields)
    setResult(null); // Clear the result
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Teorema de Sardinas-Patterson</h1>
        <p className="text-gray-300 mb-4">
          El algoritmo, o teorema, de Sardinas-Patterson es un procedimiento para determinar si un conjunto de palabras código es libre de prefijos, o unívocamente decodificable.
          Se basa en construir iterativamente conjuntos de sufijos eliminando prefijos hasta detectar una intersección con el conjunto original,
          lo que indica que el código no es unívocamente decodificable. De lo contrario, se concluye que el código es libre de prefijos cuando se generen conjuntos de manera cíclica y,
          al hacer la intersección, el resultado es el conjunto vacío.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {words.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={word}
                onChange={(e) => updateWord(index, e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder={`Palabra código ${index + 1}`}
              />
              {words.length > 2 && (
                <button
                  onClick={() => removeWord(index)}
                  className="text-red-400"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 space-y-2 mt-4">
          <button onClick={addWord} className="bg-blue-500 px-4 py-2 rounded-md">Agregar palabra</button>
          <button onClick={submitWords} className="bg-green-500 px-4 py-2 rounded-md">Verificar</button>
          <button onClick={resetWords} className="bg-red-500 px-4 py-2 rounded-md">Resetear</button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md">
            <h2 className="text-xl font-semibold">Resultado:</h2>
            <p>{result.message}</p>
            <p><strong>C∞:</strong> {JSON.stringify(result.C_infinity)}</p>
            <p><strong>Conjuntos generados:</strong> {JSON.stringify(result.cs)}</p>
            <p><strong>C∞ ∩ C:</strong> {JSON.stringify(result["C_inf intersection C"])}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SardinasPattersonPage;
