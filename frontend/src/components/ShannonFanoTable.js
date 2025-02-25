import React from 'react';

const ShannonFanoTable = ({ encodingData }) => {
  if (!encodingData || !encodingData.steps) {
    return <p>No encoding data available.</p>;
  }

  const { steps } = encodingData;

  // Extract all unique symbols
  const symbols = Array.from(
    new Set(steps.flatMap((step) => [...step.left, ...step.right]))
  );

  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Symbol</th>
          {steps.map((step, index) => (
            <th key={index}>Step {index + 1}</th>
          ))}
          <th>Final Code</th>
        </tr>
      </thead>
      <tbody>
        {symbols.map((symbol) => (
          <tr key={symbol}>
            <td>{symbol}</td>
            {steps.map((step, index) => (
              <td key={index}>
                {step.codes[symbol] !== undefined ? step.codes[symbol] : '-'}
              </td>
            ))}
            <td>{encodingData.encoding[symbol]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShannonFanoTable;
