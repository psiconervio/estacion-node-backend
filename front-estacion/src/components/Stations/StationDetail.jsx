import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStationById } from "../../services/api";
import WeatherCard from "../Weather/WeatherCard";

const StationDetail = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStationById(id)
      .then((data) => {
        setStation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching station detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Cargando detalle de la estación...</div>;
  }

  if (!station) {
    return <div>No se encontró la estación.</div>;
  }

  const { location = {}, name, esp32Data, weatherData, uvData } = station; // Desestructuración segura
  const { latitude = "Sin latitud", longitude = "Sin longitud" } = location;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">← Volver a la lista</Link>
      <h1>{name || "Nombre desconocido"}</h1>
      <p>Ubicación: {latitude}, {longitude}</p>
      <p>ID: {station.id}</p>

      {/* Muestra el componente de clima, pasándole los datos necesarios */}
      <WeatherCard
        esp32Data={esp32Data}
        weatherData={weatherData}
        uvData={uvData}
      />
    </div>
  );
};

export default StationDetail;

// // src/components/Stations/StationDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import WeatherCard from '../Weather/WeatherCard';
// import { getStationData } from '../../services/stationService';

// const StationDetail = () => {
//   const { stationId } = useParams();
//   const [stationData, setStationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await getStationData(stationId);
//         setStationData(data);
//       } catch (err) {
//         setError('Error al cargar los datos de la estación');
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (stationId) fetchData();
//   }, [stationId]);

//   if (loading) {
//     return <div>Cargando datos de la estación...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">{stationData.name}</h2>
//       <WeatherCard
//         esp32Data={stationData.esp32Data}
//         weatherData={stationData.weatherData}
//         uvData={stationData.uvData}
//       />
//     </div>
//   );
// };

// export default StationDetail;
