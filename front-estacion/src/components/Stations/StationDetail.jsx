// src/components/Stations/StationDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WeatherCard from '../Weather/WeatherCard';
import { getStationData } from '../../services/stationService';

const StationDetail = () => {
  const { stationId } = useParams();
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStationData(stationId);
        setStationData(data);
      } catch (err) {
        setError('Error al cargar los datos de la estación');
      } finally {
        setLoading(false);
      }
    }
    if (stationId) fetchData();
  }, [stationId]);

  if (loading) {
    return <div>Cargando datos de la estación...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{stationData.name}</h2>
      <WeatherCard
        esp32Data={stationData.esp32Data}
        weatherData={stationData.weatherData}
        uvData={stationData.uvData}
      />
    </div>
  );
};

export default StationDetail;
