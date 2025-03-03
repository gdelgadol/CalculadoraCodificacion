import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const LinearCodesPage = () => {
  const [p, setP] = useState(2);
  const [n, setN] = useState(3);
  const [matrixInput, setMatrixInput] = useState("");
  const [codes, setCodes] = useState([]);
  const [minWeight, setMinWeight] = useState(null);
  const [maxDetect, setMaxDetect] = useState(null);
  const [maxCorrect, setMaxCorrect] = useState(null);
  const [sisMatrix, setSisMatrix] = useState([]);
  const [hMatrix, setHMatrix] = useState([]);
  const [showCodes, setShowCodes] = useState(false);

  const handleMatrixChange = (e) => {
    setMatrixInput(e.target.value);
  };

  const parseMatrix = () => {
    return matrixInput
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .split(" ")
          .map((num) => parseInt(num, 10) || 0)
      );
  };

  const fetchCodes = async () => {
    const generatorMatrix = parseMatrix();
    try {
      const response = await axios.post("http://localhost:8000/linear-codes", {
        p: parseInt(p, 10),
        n: parseInt(n, 10),
        generator_matrix: generatorMatrix,
      });

      const data = response.data;

      setCodes(data.codes || []);
      setMinWeight(data.min_weight || null);
      setMaxDetect(data.max_detect || null);
      setMaxCorrect(data.max_correct || null);
      setSisMatrix(data.sis_matrix || []);
      setHMatrix(data.H_matrix || []);
    } catch (error) {
      console.error("Error fetching codes", error);
    }
  };

  // Función para reiniciar todos los valores
  const handleReset = () => {
    setP(2);
    setN(3);
    setMatrixInput("");
    setCodes([]);
    setMinWeight(null);
    setMaxDetect(null);
    setMaxCorrect(null);
    setSisMatrix([]);
    setHMatrix([]);
    setShowCodes(false);
  };

  const renderMatrix = (matrix) => {
    return (
      <table className="border-collapse border border-gray-600 w-full text-center text-sm">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-500 p-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Códigos Lineales</h1>
        {/* Campos de entrada */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1">P</label>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(Math.max(2, parseInt(e.target.value, 10) || 2))}
              min="2"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">n</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              step="1"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <label className="block mb-2">
          Matriz Generadora (separar números con espacio, nueva línea para otro vector)
        </label>
        <textarea
          value={matrixInput}
          onChange={handleMatrixChange}
          className="w-full p-2 rounded bg-gray-700 text-white h-32"
          placeholder="1 0 1\n0 1 0\n1 1 0"
        />

        <div className="mt-4 flex gap-2">
          <button onClick={fetchCodes} className="bg-blue-500 px-4 py-2 rounded font-bold">
            Generar Códigos
          </button>
          <button onClick={handleReset} className="bg-red-500 px-4 py-2 rounded font-bold">
            Reiniciar
          </button>
        </div>

        {/* Sección colapsable */}
        <div className="p-6 bg-gray-900 text-white mt-6 rounded-lg">
          <button
            onClick={() => setShowCodes(!showCodes)}
            className="bg-gray-700 px-4 py-2 rounded font-bold w-full text-left"
          >
            {showCodes ? "Ocultar códigos generados" : "Mostrar códigos generados"}
          </button>

          {showCodes && (
            <ul className="mt-2 space-y-2">
              {codes.length > 0 ? (
                codes.map((code, index) => (
                  <li key={index} className="bg-gray-800 p-2 rounded-lg">
                    <strong>z:</strong> {code.z_con},{" "}
                    <strong>zG:</strong> {code.codeword},{" "}
                    <strong>Peso:</strong> {code.weight}
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No hay códigos generados.</p>
              )}
            </ul>
          )}
        </div>

        {/* Sección de métricas */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <p>
            <strong>Peso mínimo:</strong> {minWeight !== null ? minWeight : "N/A"}
          </p>
          <p>
            <strong>Máx. detección de errores:</strong> {maxDetect !== null ? maxDetect : "N/A"}
          </p>
          <p>
            <strong>Máx. corrección de errores:</strong> {maxCorrect !== null ? maxCorrect : "N/A"}
          </p>

          <div className="mt-4">
            <p className="font-semibold">Matriz generadora (SIS):</p>
            {sisMatrix.length > 0 ? renderMatrix(sisMatrix) : <p>N/A</p>}
          </div>

          <div className="mt-4">
            <p className="font-semibold">Matriz de paridad (H):</p>
            {hMatrix.length > 0 ? renderMatrix(hMatrix) : <p>N/A</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LinearCodesPage;