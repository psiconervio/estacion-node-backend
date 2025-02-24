// src/components/Weather/WeatherStats.jsx
import React from 'react';
import Uv from '../UV/Uv';

const WeatherStats = ({ visibilidad, pressure, allClouds, esp32Data, ozono }) => {
  return (
    <div className="weather-stats grid grid-cols-3 gap-4 mt-4">
      <div className="text-center">
        <p>Visibilidad</p>
        <p>{visibilidad.toFixed(1)} Km</p>
      </div>
      <div className="text-center">
        <p>Índice UV</p>
        <p>
          <Uv />
        </p>
      </div>
      <div className="text-center">
        <p>Nubosidad</p>
        <p>{allClouds}%</p>
      </div>
      <div className="text-center">
        <p>Presión</p>
        <p>{pressure} hPA</p>
      </div>
      <div className="text-center">
        <p>Humedad</p>
        <p>{esp32Data.humidity}%</p>
      </div>
      <div className="text-center">
        <p>Viento</p>
        <p>{esp32Data.anemometro} km/h</p>
      </div>
      <div className="text-center">
        <p>Dirección</p>
        <p>{esp32Data.veleta}</p>
      </div>
      <div className="text-center">
        <p>Pluviometro</p>
        <p>{esp32Data.pluviometro} ml</p>
      </div>
      <div className="text-center">
        <p>Ozono</p>
        <p>{ozono} ml</p>
      </div>
    </div>
  );
};

export default WeatherStats;
