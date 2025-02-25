import React, { useState } from 'react';
import ShannonFanoTable from '../components/ShannonFanoTable';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function ShannonFanoPage() {
  const [symbols, setSymbols] = useState('');
  const [probabilities, setProbabilities] = useState('');
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const symbolsArray = symbols.split(',').map((s) => s.trim());
    const probabilitiesArray = probabilities
      .split(',')
      .map((p) => parseFloat(p.trim()));

    if (symbolsArray.length !== probabilitiesArray.length) {
      setErrorMessage('Symbols and probabilities must have the same length.');
      return;
    }

    if (probabilitiesArray.some(isNaN)) {
      setErrorMessage('Probabilities must be valid numbers.');
      return;
    }

    const requestBody = {
      symbols: symbolsArray,
      probabilities: probabilitiesArray,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/shannon-fano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shannon-Fano Encoding</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Symbols (comma-separated):</label>
          <input
            type="text"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Probabilities (comma-separated):</label>
          <input
            type="text"
            value={probabilities}
            onChange={(e) => setProbabilities(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Shannon-Fano Table</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {data ? (
        <>
          <ShannonFanoTable encodingData={data.encoding} />
          <div>
            <ReactMarkdown rehypePlugins={[rehypeKatex]}>
              {`
                Entropy (H(𝓕)): ${data.entropy}
                
                Average Length (L(C)): ${data.average_length}
                
                Efficiency (η): ${data.efficiency}
              `}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <p>Enter data and submit to generate the Shannon-Fano table.</p>
      )}
    </div>
  );
}

export default ShannonFanoPage;