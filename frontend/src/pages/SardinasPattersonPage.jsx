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
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Algoritmo de Sardinas-Patterson</h1>
        
        {words.map((word, index) => (
          <input
            key={index}
            type="text"
            value={word}
            onChange={(e) => updateWord(index, e.target.value)}
            className="block w-full bg-gray-800 p-2 rounded-md text-white my-2"
            placeholder={`Palabra código ${index + 1}`}
          />
        ))}

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
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