// src/components/Stations/StationCard.jsx
import React from "react";

const StationCard = ({ station }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        margin: "10px 0",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <h2>{station.name}</h2>
      <p>Ubicación: {station.location || "Desconocida"}</p>
      <p>Descripción: {station.description || "Sin descripción"}</p>
      <p>Latitud: {station.location.latitude || "sin latitud"} </p>
      <p>Longitud: {station.location.longitude || "sub longitud"}</p>
    </div>
  );
};

export default StationCard;


// // frontend/src/components/Station.jsx
// import React from "react";
// import Weather from "./Weather";

// const Station = ({ station }) => {
//   return (
//     <div style={{ border: "1px solid #ddd", padding: "15px", margin: "15px", borderRadius: "8px" }}>
//       <h2>📍 {station.name}</h2>
//       <p><strong>Ubicación:</strong> {station.location}</p>
      
//       {/* Aquí se muestra el clima usando el componente Weather */}
//       <Weather weatherData={station.weather} />
//     </div>
//   );
// };

// export default Station;
