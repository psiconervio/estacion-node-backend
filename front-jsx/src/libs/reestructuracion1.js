async function reestructuracionone() {
    try {
      // Reemplaza la URL con la del endpoint real
      const response = await fetch('http://localhost:5000/api/stations');
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
        name: `Estación ${stationData.id}`,
        location: "Sierra Nevada", // Valor fijo, ajustar según necesidad
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
   console.log(transformedData);
      return transformedData;
    } catch (error) {
      console.error("Error fetching weather station data:", error);
      throw error;
    }
  }
  reestructuracionone();

  export default reestructuracionone;
  