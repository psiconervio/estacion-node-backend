import { useState, useEffect } from 'react';

const useWeatherStation = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherStation = async () => {
      try {
        // Reemplaza la URL con la del endpoint real
        const response = await fetch('http://localhost:5000/api/weather/1');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const stationData = await response.json();

        // Tomar la última lectura de weatherRecords
        const weatherRecords = stationData.weatherRecords || [];
        const lastRecord = weatherRecords.length > 0
          ? weatherRecords[weatherRecords.length - 1]
          : {};

        // Reestructurar los datos según la estructura requerida
        const transformedData = {
          id: stationData.id.toString(),
          name: `Estación ${stationData.id}`, // Ejemplo: "Estación 1"
          location: "Sierra Nevada", // Valor fijo, se puede ajustar según la necesidad
          status: "online",
          lastUpdate: new Date().toISOString(),
          coordinates: {
            latitude: stationData.latitude,
            longitude: stationData.longitude,
          },
          readings: {
            temperature: lastRecord.temperature || 0,
            humidity: lastRecord.humidity || 0,
            pressure: 1013,
            windSpeed: 12,
            windDirection: "NO",
            precipitation: 0.5,
          },
          history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            temperature: 15 + Math.random() * 5,
            humidity: 45 + Math.random() * 10,
          })),
          alerts: [
            {
              id: "1",
              type: "warning",
              message: "Velocidad del viento alta detectada",
              timestamp: new Date().toISOString(),
            },
          ],
          maintenance: {
            lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
            nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
            status: "Operativa",
          },
        };

        setWeatherData(transformedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherStation();
  }, []);

  return { weatherData, loading, error };
};

export default useWeatherStation;
