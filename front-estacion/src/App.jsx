// src/App.jsx
import React from "react";
import {  Routes, Route } from "react-router-dom";
import StationList from "./components/Stations/StationList";
import StationDetail from "./components/Stations/StationDetail";

function App() {
  return (

      <Routes>
        {/* Lista de estaciones */}
        <Route path="/" element={<StationList />} />
        {/* Detalle de una estación */}
        <Route path="/station/:id" element={<StationDetail />} />
      </Routes>

  );
}

export default App;

// import { useEffect, useState } from "react";
// import { fetchStations } from "./services/api";

// function App() {
//   const [stations, setStations] = useState([]);

//   useEffect(() => {
//     fetchStations().then(setStations);
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>🌤 Estaciones Meteorológicas</h1>
//       <ul>
//         {stations.length === 0 ? (
//           <p>Cargando datos...</p>
//         ) : (
//           stations.map((station) => (
//             <li key={station.id}>
//               <strong>{station.name}</strong>: {station.temperature}°C, Humedad: {station.humidity}%
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import { fetchStations } from "./services/api";

// function App() {
//   const [stations, setStations] = useState([]);

//   useEffect(() => {
//     fetchStations().then(setStations);
//   }, []);

//   return (
//     <div>
//       <h1>Estaciones Meteorológicas</h1>
//       <ul>
//         {stations.map((station) => (
//           <li key={station.id}>
//             {station.name}: {station.temperature}°C
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

// // src/App.jsx
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import StationList from './components/Stations/StationList';
// import StationDetail from './components/Stations/StationDetail';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<StationList />} />
//       <Route path="/stations/:stationId" element={<StationDetail />} />
//     </Routes>
//   );
// }

// export default App;



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
