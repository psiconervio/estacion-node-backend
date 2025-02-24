// frontend/src/components/Weather.jsx
import React from "react";

const Weather = ({ weatherData }) => {
  // Si no hay datos, muestra un mensaje de carga
  if (!weatherData) return <p>Cargando clima...</p>;

  return (
    <div style={{ borderTop: "1px solid #ccc", paddingTop: "10px", marginTop: "10px" }}>
      <p>🌡️ Temperatura: {weatherData.temperature}°C</p>
      <p>💧 Humedad: {weatherData.humidity}%</p>
      <p>🌬️ Viento: {weatherData.windSpeed} km/h</p>
    </div>
  );
};

export default Weather;
