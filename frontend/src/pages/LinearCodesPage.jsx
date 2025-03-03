import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const LinearCodesPage = () => {
  const [p, setP] = useState(2);
  const [n, setN] = useState(3);
  const [numCols, setNumCols] = useState(n); // Agregado
  const [generatorMatrix, setGeneratorMatrix] = useState([]);
  const [codes, setCodes] = useState([]);

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...generatorMatrix];
    newMatrix[row][col] = parseInt(value) || 0;
    setGeneratorMatrix(newMatrix);
  };

  const addRow = () => {
    setGeneratorMatrix([...generatorMatrix, new Array(numCols).fill(0)]);
  };

  const removeRow = () => {
    if (generatorMatrix.length > 1) {
      setGeneratorMatrix(generatorMatrix.slice(0, -1));
    }
  };

  const fetchCodes = async () => {
    try {
      const response = await axios.post("http://localhost:8000/linear-codes", {
        p,
        n,
        generator_matrix: generatorMatrix,
      });
      setCodes(response.data.codes);
    } catch (error) {
      console.error("Error fetching codes", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-40xl lg:max-w-5xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Códigos Lineales</h1>
        <p className="mb-4">
          Genera códigos lineales a partir de un campo finito <strong>GF(P^n)</strong> y una matriz generadora.
        </p>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">P</label>
            <input
              type="number"
              value={p === 0 ? "" : p}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") {
                  setP("");
                } else {
                  const parsed = parseFloat(newValue);
                  if (!isNaN(parsed) && parsed >= 2) {
                    setP(parsed);
                  }
                }
              }}
              min="2"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1">n</label>
            <input
              type="number"
              value={n === 0 ? "" : n}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") {
                  setN("");
                } else {
                  const parsed = parseFloat(newValue);
                  if (!isNaN(parsed) && parsed >= 1) {
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
        </div>

        <div className="mt-4">
          <label>Número de columnas:</label>
          <input
            type="number"
            min="1"
            value={numCols}
            onChange={(e) => {
              const newNumCols = parseInt(e.target.value, 10);
              if (!isNaN(newNumCols) && newNumCols > 0) {
                setNumCols(newNumCols);
                setGeneratorMatrix((prevMatrix) =>
                  prevMatrix.map((row) =>
                    row.length < newNumCols
                      ? [...row, ...new Array(newNumCols - row.length).fill(0)]
                      : row.slice(0, newNumCols)
                  )
                );
              }
            }}
            className="text-black w-16 px-2 py-1 rounded"
          />
        </div>

        <table className="border-collapse border border-white mt-4">
          <tbody>
            {generatorMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: numCols }).map((_, colIndex) => (
                  <td key={colIndex} className="border border-white p-2">
                    <input
                      type="number"
                      value={row[colIndex] === null ? "" : row[colIndex]} // Permite el campo vacío
                      onChange={(e) => {
                        let newValue = e.target.value;

                        if (newValue === "") {
                          handleMatrixChange(rowIndex, colIndex, null); // Permitir borrar
                          return;
                        }

                        let parsedValue = parseInt(newValue, 10);
                        let maxValue = Math.pow(p, n);

                        if (!isNaN(parsedValue)) {
                          parsedValue = Math.min(Math.max(parsedValue, 0), maxValue); // Limitar rango
                          handleMatrixChange(rowIndex, colIndex, parsedValue);
                        }
                      }}
                      onBlur={() => {
                        // Si el usuario deja el campo vacío, restablecer a 0
                        if (row[colIndex] === null) {
                          handleMatrixChange(rowIndex, colIndex, 0);
                        }
                      }}
                      className="text-black w-12 px-2 py-1 rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <button onClick={addRow} className="bg-green-500 px-4 py-2 rounded mr-2 font-bold">
            Añadir fila
          </button>
          <button onClick={removeRow} className="bg-red-500 px-4 py-2 rounded mr-2 font-bold">
            Eliminar fila
          </button>
          <button onClick={fetchCodes} className="bg-blue-500 px-4 py-2 rounded font-bold">
            Generar Códigos
          </button>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Códigos Generados</h2>
          <ul className="list-disc ml-6">
            {codes.map((code, index) => (
              <li key={index} className="mt-1">{code}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default LinearCodesPage;
