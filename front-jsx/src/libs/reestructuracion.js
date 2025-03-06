const fetchAndTransformStationsData = async () => {
    try {
      // Obtener las URLs desde variables de entorno
      const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;
      const READINGS_API_URL = import.meta.env.VITE_READINGS_API_URL;
  
      if (!STATIONS_API_URL || !READINGS_API_URL) {
        throw new Error("Las URLs de las APIs no están definidas en las variables de entorno.");
      }
  
      // Fetch en paralelo
      const [stationsResponse, readingsResponse] = await Promise.all([
        fetch(STATIONS_API_URL).then((res) => res.json()),
        fetch(READINGS_API_URL).then((res) => res.json()),
      ]);
  
      // Procesamiento de datos...
      const latestReadings = readingsResponse.reduce((acc, reading) => {
        if (
          !acc[reading.stationId] || 
          new Date(reading.recordedAt) > new Date(acc[reading.stationId].recordedAt)
        ) {
          acc[reading.stationId] = reading;
        }
        return acc;
      }, {});
  
      const structuredData = stationsResponse.map((station) => {
        const reading = latestReadings[station.id];
  
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
            pressure: 1013, // Valor por defecto
            windSpeed: reading?.anemometro || null,
            windDirection: reading?.veleta || null,
            precipitation: reading?.pluviometro || null,
          },
          history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            temperature: (reading?.temperature || 20) + Math.random() * 2,
            humidity: (reading?.humidity || 50) + Math.random() * 5,
          })),
          alerts: [],
          maintenance: {
            lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
            nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
            status: "Operativa",
          },
        };
      });
  
      console.log(JSON.stringify(structuredData, null, 2)); // Imprime el JSON estructurado
      return structuredData;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return [];
    }
  };
  export default fetchAndTransformStationsData;

// const fetchAndTransformStationsData = async () => {
//     try {
//       // URLs de las APIs (reemplázalas con las correctas)
//       const STATIONS_API_URL = "http://localhost:5000/api/stations";
//       const READINGS_API_URL = "http://localhost:5000/api/weather/1";

//       // Fetch en paralelo
//       const [stationsResponse, readingsResponse] = await Promise.all([
//         fetch(STATIONS_API_URL).then((res) => res.json()),
//         fetch(READINGS_API_URL).then((res) => res.json()),
//       ]);

//       // Reestructuración de los datos
//       const structuredData = stationsResponse.map((station) => {
//         const reading = readingsResponse.find((r) => r.stationId === station.id);

//         return {
//           id: station.id.toString(),
//           name: station.name,
//           location: station.description,
//           status: reading ? "online" : "offline",
//           lastUpdate: reading?.recordedAt || new Date().toISOString(),
//           coordinates: {
//             latitude: station.latitude,
//             longitude: station.longitude,
//           },
//           readings: {
//             temperature: reading?.temperature || null,
//             humidity: reading?.humidity || null,
//             pressure: 1013, // Valor por defecto
//             windSpeed: reading?.anemometro || null,
//             windDirection: reading?.veleta || null,
//             precipitation: reading?.pluviometro || null,
//           },
//           history: Array.from({ length: 24 }, (_, i) => ({
//             timestamp: new Date(Date.now() - i * 3600000).toISOString(),
//             temperature: (reading?.temperature || 20) + Math.random() * 2,
//             humidity: (reading?.humidity || 50) + Math.random() * 5,
//           })),
//           alerts: [],
//           maintenance: {
//             lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
//             nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
//             status: "Operativa",
//           },
//         };
//       });

//       console.log(JSON.stringify(structuredData, null, 2)); // Imprime el JSON estructurado
//       return structuredData;
//     } catch (error) {
//       console.error("Error al obtener los datos:", error);
//       return [];
//     }
//   };

//   // Llamada a la función
//   fetchAndTransformStationsData();
//   export default fetchAndTransformStationsData;
