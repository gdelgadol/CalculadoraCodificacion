import React, { useState } from "react";
import HuffmanTree from "../components/HuffmanTree";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function HuffmanPage() {
  const [symbols, setSymbols] = useState("");
  const [probabilities, setProbabilities] = useState("");
  const [n, setN] = useState(2);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const symbolsArray = symbols.split(",").map((s) => s.trim());
    const probabilitiesArray = probabilities.split(",").map(Number);

    if (symbolsArray.length !== probabilitiesArray.length) {
      setErrorMessage("Symbols and probabilities must have the same length.");
      return;
    }

    if (probabilitiesArray.some(isNaN)) {
      setErrorMessage("Probabilities must be valid numbers.");
      return;
    }

    const requestBody = {
      symbols: symbolsArray,
      probabilities: probabilitiesArray,
      n: parseInt(n, 10),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/huffman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      {/* Left Side - Input Form */}
      <div style={{ width: "40%" }}>
        <h1>Huffman Encoding</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>Symbols (comma-separated):</label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            required
          />

          <label>Probabilities (comma-separated):</label>
          <input
            type="text"
            value={probabilities}
            onChange={(e) => setProbabilities(e.target.value)}
            required
          />

          <label>N-ary value:</label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            min="2"
            required
          />

          <button type="submit">Generate Huffman Tree</button>
        </form>

        {/* Error Message */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Display Encoding */}
        {data && data.encoding && (
          <div>
            <h2>Encoding:</h2>
            <ul>
              {Object.entries(data.encoding).map(([symbol, code]) => (
                <li key={symbol}>
                  {symbol}: {code}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Side - Huffman Tree & Results */}
      <div style={{ width: "50%", textAlign: "center" }}>
        {data ? (
          <>
            <HuffmanTree steps={data.steps} n={n} />
            <div>
              <ReactMarkdown rehypePlugins={[rehypeKatex]}>
                {`
                  Entropy H(𝓕): ${data.entropy}
                  
                  Average Length L(C): ${data.average_length}
                  
                  Efficiency (η): ${data.efficiency}
                `}
              </ReactMarkdown>
            </div>
          </>
        ) : (
          <p>Enter data and submit.</p>
        )}
      </div>
    </div>
  );
}

export default HuffmanPage;