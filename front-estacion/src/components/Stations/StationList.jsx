import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStations } from "../../services/api";
import StationCard from "./StationCard";

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations()
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando lista de estaciones...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Estaciones</h1>
      {stations.map((station) => (
        <Link
          key={station.id}
          to={`/station/${station.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <StationCard station={station} />
        </Link>
      ))}
    </div>
  );
};

export default StationList;


// // src/components/Stations/StationList.jsx
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchStations } from "../../services/api";
// import StationCard from "./StationCard";

// const StationList = () => {
  
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   console.log(stations);
//   useEffect(() => {
//     fetchStations()
//       .then((data) => {
//         setStations(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching stations:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Cargando lista de estaciones...</div>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Lista de Estaciones</h1>
//       {stations.map((station) => (
//         <Link
//           key={station.id}
//           to={`/station/${station.id}`}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <StationCard station={station} />
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default StationList;

// // src/components/Stations/StationList.jsx
// import React, { useEffect, useState } from 'react';
// import StationCard from './StationCard';
// import { getAllStations } from '../../services/stationService';
// import { Link } from 'react-router-dom';

// const StationList = () => {
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchStations() {
//       try {
//         const data = await getAllStations();
//         setStations(data);
//       } catch (err) {
//         setError('Error al cargar las estaciones');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStations();
//   }, []);

//   if (loading) {
//     return <div>Cargando estaciones...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="station-list grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//       {stations.map((station) => (
//         <Link to={`/stations/${station.id}`} key={station.id}>
//           <StationCard station={station} />
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default StationList;
