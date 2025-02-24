import React from "react";

const StationCard = ({ station }) => {
  const { location } = station; // Aseguramos que location está definido

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
      <p>Ubicación: {location ? `${location.latitude}, ${location.longitude}` : "Desconocida"}</p>
      <p>Descripción: {station.description || "Sin descripción"}</p>
    </div>
  );
};

export default StationCard;
// // src/components/Stations/StationCard.jsx
// import React from "react";

// const StationCard = ({ station }) => {
//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         margin: "10px 0",
//         padding: "10px",
//         borderRadius: "8px",
//       }}
//     >
//       <h2>{station.name}</h2>
//       <p>Ubicación: {station.location || "Desconocida"}</p>
//       <p>Descripción: {station.description || "Sin descripción"}</p>
//       <p>Latitud: {station.location.latitude || "sin latitud"} </p>
//       <p>Longitud: {station.location.longitude || "sub longitud"}</p>
//     </div>
//   );
// };

// export default StationCard;
