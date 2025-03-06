import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherStation } from '../types';

// @ts-ignore
import 'leaflet.heat';

interface WeatherMapProps {
  stations: WeatherStation[];
  mapType: 'temperature' | 'humidity';
}

const WeatherMap = ({ stations, mapType }: WeatherMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([-34.6037, -58.3816], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const data = stations.map(station => {
      const value = mapType === 'temperature' ? station.temperature : station.humidity;
      // Normalize values for the heat map
      const intensity = mapType === 'temperature' 
        ? (value - 15) / 15 // Assuming temperature range 15-30°C
        : value / 100; // Humidity is already 0-100
      
      return [
        station.latitude,
        station.longitude,
        intensity
      ];
    });

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    heatLayerRef.current = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: mapType === 'temperature' 
        ? { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
        : { 0.4: 'yellow', 0.6: 'lime', 0.8: 'blue', 1: 'purple' }
    }).addTo(mapRef.current);

    // Add markers for each station
    stations.forEach(station => {
      const color = station.status === 'online' ? 'green' : 
                   station.status === 'offline' ? 'red' : 'orange';
      
      L.circleMarker([station.latitude, station.longitude], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
      .bindPopup(`
        <b>${station.name}</b><br>
        Temperatura: ${station.temperature}°C<br>
        Humedad: ${station.humidity}%<br>
        Estado: ${station.status}<br>
        Última actualización: ${new Date(station.lastUpdate).toLocaleString()}
      `)
      .addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stations, mapType]);

  return <div id="map" className="w-full h-[600px] rounded-lg shadow-lg" />;
};

export default WeatherMap;