import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const WeatherMap = ({ map, mapType }) => {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: false, // Disable default zoom control
        attributionControl: false // Disable default attribution control
      }).setView([-28.4680, -65.7797], 13);
      
      // Add zoom control to top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(mapRef.current);
      
      // Add attribution control to bottom-right with correct attribution text
      L.control.attribution({
        position: 'bottomright',
        prefix: false,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const data = map.map(station => {
      const value = mapType === 'temperature' ? station.temperature : station.humidity;
      const intensity = mapType === 'temperature' 
        ? (value - 15) / 15
        : value / 100;
      
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

    map.forEach(station => {
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
        <div class="p-2">
          <div class="font-bold mb-2">${station.name}</div>
          <div class="grid gap-1 text-sm">
            <div>Temperatura: ${station.temperature}°C</div>
            <div>Humedad: ${station.humidity}%</div>
            <div>Estado: ${station.status}</div>
            <div class="text-xs text-gray-500 mt-1">
              Última actualización:<br>${new Date(station.lastUpdate).toLocaleString()}
            </div>
          </div>
        </div>
      `, {
        className: 'rounded-lg shadow-lg'
      })
      .addTo(mapRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [map, mapType]);

  return <div id="map" className="w-full h-[300px] md:h-[600px]" />;
};

export default WeatherMap;