// src/components/Stations/StationList.jsx
import React, { useEffect, useState } from 'react';
import StationCard from './StationCard';
import { getAllStations } from '../../services/stationService';
import { Link } from 'react-router-dom';

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStations() {
      try {
        const data = await getAllStations();
        setStations(data);
      } catch (err) {
        setError('Error al cargar las estaciones');
      } finally {
        setLoading(false);
      }
    }
    fetchStations();
  }, []);

  if (loading) {
    return <div>Cargando estaciones...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="station-list grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {stations.map((station) => (
        <Link to={`/stations/${station.id}`} key={station.id}>
          <StationCard station={station} />
        </Link>
      ))}
    </div>
  );
};

export default StationList;
