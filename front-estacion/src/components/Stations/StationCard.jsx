// src/components/Stations/StationCard.jsx
import React from 'react';

const StationCard = ({ station }) => {
  return (
    <div className="station-card p-4 border rounded shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold">{station.name}</h3>
      <p className="text-sm">{station.description || 'Sin descripción disponible.'}</p>
    </div>
  );
};

export default StationCard;
