import React from 'react';
import { 
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Navigation,
  CloudRain,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function StationCard({ station, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'En Línea';
      case 'offline': return 'Fuera de Línea';
      case 'maintenance': return 'En Mantenimiento';
      default: return status;
    }
  };

  const hasActiveAlerts = station.alerts.some(
    alert => new Date(alert.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{station.name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{station.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveAlerts && (
            <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          )}
          <span className={`h-3 w-3 rounded-full ${getStatusColor(station.status)}`}></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{getStatusText(station.status)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Thermometer className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Temperatura</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.temperature.toFixed(1)}°C</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humedad</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.humidity.toFixed(1)}%</p>
          </div>
        </div>
        
        {/* <div className="flex items-center">
          <Gauge className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Presión</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.pressure.toFixed(1)} hPa</p>
          </div>
        </div> */}
        
        {/* <div className="flex items-center">
          <Wind className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Velocidad del Viento</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.windSpeed.toFixed(1)} km/h</p>
          </div>
        </div> */}
        
        {/* <div className="flex items-center">
          <Navigation className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dirección del Viento</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.windDirection}</p>
          </div>
        </div> */}
        
        {/* <div className="flex items-center">
          <CloudRain className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precipitación</p>
            <p className="font-semibold text-gray-900 dark:text-white">{station.readings.precipitation.toFixed(1)} mm</p>
          </div>
        </div> */}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Última actualización: {new Date(station.lastUpdate).toLocaleString()}
        </span>
        <button
          onClick={() => onViewDetails(station)}
          className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
        >
          Ver Detalles
          <ExternalLink className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}