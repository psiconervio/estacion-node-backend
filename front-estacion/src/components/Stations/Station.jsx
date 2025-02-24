// frontend/src/components/Station.jsx
import React from "react";
import Weather from "./Weather";

const Station = ({ station }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", margin: "15px", borderRadius: "8px" }}>
      <h2>📍 {station.name}</h2>
      <p><strong>Ubicación:</strong> {station.location}</p>
      
      {/* Aquí se muestra el clima usando el componente Weather */}
      <Weather weatherData={station.weather} />
    </div>
  );
};

export default Station;
