import React, { useState } from "react";
import HuffmanTree from "../components/HuffmanTree";

function HuffmanPage() {
  const [symbols, setSymbols] = useState("");
  const [probabilities, setProbabilities] = useState("");
  const [n, setN] = useState(2);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // New state for errors

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset errors before submitting

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
      setData(json);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Huffman Encoding</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
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

      {/* Display Huffman Tree */}
      {data ? <HuffmanTree steps={data.steps} /> : <p>Enter data and submit.</p>}
    </div>
  );
}

export default HuffmanPage;
