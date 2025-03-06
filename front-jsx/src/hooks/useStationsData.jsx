import { useState, useEffect } from "react";
import axios from "axios";

const useStationsData = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamadas a las APIs en paralelo
        const [stationsResponse, readingsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/stations"), // Reemplaza con la URL real
          axios.get("http://localhost:5000/api/weather"),      // Reemplaza con la URL real
        ]);

        const stationsData = stationsResponse.data;
        const readingsData = readingsResponse.data;

        // Función para estructurar los datos
        const structuredData = stationsData.map((station) => {
          const reading = readingsData.find((r) => r.stationId === station.id);

          return {
            id: station.id.toString(),
            name: station.name,
            location: station.description,
            status: reading ? "online" : "offline",
            lastUpdate: reading?.recordedAt || new Date().toISOString(),
            coordinates: {
              latitude: station.latitude,
              longitude: station.longitude,
            },
            readings: {
              temperature: reading?.temperature || null,
              humidity: reading?.humidity || null,
              pressure: 1013, // Puedes obtener esto de otra API si lo necesitas
              windSpeed: reading?.anemometro || null,
              windDirection: reading?.veleta || null,
              precipitation: reading?.pluviometro || null,
            },
            history: Array.from({ length: 24 }, (_, i) => ({
              timestamp: new Date(Date.now() - i * 3600000).toISOString(),
              temperature: (reading?.temperature || 20) + Math.random() * 2,
              humidity: (reading?.humidity || 50) + Math.random() * 5,
            })),
            alerts: [], // Aquí puedes añadir lógica para alertas si lo necesitas
            maintenance: {
              lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
              nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
              status: "Operativa",
            },
          };
        });

        setStations(structuredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stations, loading, error };
};

export default useStationsData;
