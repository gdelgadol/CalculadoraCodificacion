import React from "react";
import Layout from "../components/Layout.jsx"; // Import the Layout component

const LandingPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Calculadora de Algoritmos de Codificación</h2>
        <p className="text-base md:text-lg text-gray-400 mt-4 px-4 md:px-0">Explora diferentes algoritmos y comprende su funcionamiento.</p>
        
        {/* Insert the image here */}
        <img
          src="/src/LandingPic.jpg" // Replace with your image path or URL
          alt="Tres tesos y la sardina :)"
          className="mt-6 w-full max-w-3xl rounded-lg shadow-lg"
        />
      </div>
    </Layout>
  );
};

export default LandingPage;