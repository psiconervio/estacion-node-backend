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
import type { StationCard } from '../types';

export default function StationCard({ station, onViewDetails }: StationCard) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const hasActiveAlerts = station.alerts.some(
    alert => new Date(alert.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{station.name}</h3>
          <p className="text-gray-600">{station.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveAlerts && (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          <span className={`h-3 w-3 rounded-full ${getStatusColor(station.status)}`}></span>
          <span className="text-sm text-gray-600 capitalize">{station.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Thermometer className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="font-semibold">{station.readings.temperature}°C</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Droplets className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-semibold">{station.readings.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Gauge className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Pressure</p>
            <p className="font-semibold">{station.readings.pressure} hPa</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Wind className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="font-semibold">{station.readings.windSpeed} km/h</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Navigation className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Wind Direction</p>
            <p className="font-semibold">{station.readings.windDirection}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <CloudRain className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Precipitation</p>
            <p className="font-semibold">{station.readings.precipitation} mm</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Last update: {new Date(station.lastUpdate).toLocaleString()}
        </span>
        <button
          onClick={() => onViewDetails(station)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          View Details
          <ExternalLink className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}