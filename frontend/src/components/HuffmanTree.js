import React, { useState } from "react";

const HuffmanTree = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Huffman Tree Visualization</h2>
      <div className="flex flex-col items-center mt-4 border p-4 rounded-lg">
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="border rounded p-2 bg-gray-200 mt-2">
              {step.new_node.symbols.join("")} ({step.new_node.probability.toFixed(4)})
            </div>
            <div className="flex gap-4 mt-1">
              {step.merged.map(([symbols, prob], idx) => (
                <div key={idx} className="border rounded p-2 bg-gray-100">
                  {symbols.join("")} ({prob.toFixed(4)})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={prevStep} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50" disabled={currentStep === 0}>
          Previous Step
        </button>
        <button onClick={nextStep} className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50" disabled={currentStep >= steps.length}>
          Next Step
        </button>
      </div>
    </div>
  );
};

export default HuffmanTree;
