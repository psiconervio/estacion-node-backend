const fetchAndTransformStationsData = async () => {
  try {
    // Obtén la URL del endpoint que trae todas las estaciones con sus registros de clima.
    const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;
    
    if (!STATIONS_API_URL) {
      throw new Error("La URL de la API de estaciones no está definida en las variables de entorno.");
    }
    
    // Fetch de la información de las estaciones
    const stationsResponse = await fetch(STATIONS_API_URL);
    const stationsData = await stationsResponse.json();
    
    // Transformamos los datos a la estructura que necesita el frontend
    const structuredData = stationsData.map((station) => {
      // Ordenar los registros por fecha (descendente)
      const sortedRecords = station.weatherRecords.sort(
        (a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)
      );
      
      // El registro más reciente (si existe)
      const latestReading = sortedRecords[0] || null;
      
      // Construir el history utilizando hasta 24 registros
      const history = sortedRecords.slice(0, 24).map((record) => ({
        timestamp: record.recordedAt,
        temperature: record.temperature,
        humidity: record.humidity,
      }));
      
      return {
        id: station.id.toString(),
        name: station.name,
        location: station.description,
        status: latestReading ? "online" : "offline",
        lastUpdate: latestReading ? latestReading.recordedAt : new Date().toISOString(),
        coordinates: {
          latitude: station.latitude,
          longitude: station.longitude,
        },
        readings: {
          temperature: latestReading ? latestReading.temperature : null,
          humidity: latestReading ? latestReading.humidity : null,
          pressure: 1013, // Valor por defecto
          windSpeed: latestReading ? latestReading.anemometro : null,
          windDirection: latestReading ? latestReading.veleta : null,
          precipitation: latestReading ? latestReading.pluviometro : null,
        },
        history,
        alerts: [],
        maintenance: {
          lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
          nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
          status: "Operativa",
        },
      };
    });
    
    // console.log(JSON.stringify(structuredData, null, 2)); // Para verificar el resultado en consola
    return structuredData;
  } catch (error) {
    console.error("Error al obtener y transformar los datos:", error);
    return [];
  }
};

export default fetchAndTransformStationsData;

// const fetchAndTransformStationsData = async () => {
//   try {
//     // Obtener las URLs base desde variables de entorno
//     const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;
//     // Asegúrate de que VITE_READINGS_API_URL sea la URL base sin el ID de la estación, por ejemplo:
//     // http://localhost:5000/api/weather
//     const READINGS_BASE_URL = import.meta.env.VITE_READINGS_API_URL;

//     if (!STATIONS_API_URL || !READINGS_BASE_URL) {
//       throw new Error("Las URLs de las APIs no están definidas en las variables de entorno.");
//     }

//     // Fetch de todas las estaciones
//     const stationsResponse = await fetch(STATIONS_API_URL).then((res) => res.json());

//     // Para cada estación, hacer fetch de sus lecturas
//     const readingsPromises = stationsResponse.map((station) => {
//       // Construir la URL para la lectura de esta estación
//       const readingUrl = `${READINGS_BASE_URL}/${station.id}`;
//       console.log(readingUrl)
//       return fetch(readingUrl)
//         .then((res) => res.json())
//         .catch((error) => {
//           console.error("Error al obtener la lectura para la estación", station.id, error);
//           return null; // Si falla, retorna null para esa estación
//         });
//     });

//     // Esperar a que todas las lecturas se obtengan
//     const readingsResponses = await Promise.all(readingsPromises);

//     // Combinar la información de la estación con sus lecturas
//     const structuredData = stationsResponse.map((station, index) => {
//       const reading = readingsResponses[index];

//       return {
//         id: station.id.toString(),
//         name: station.name,
//         location: station.description,
//         status: reading ? "online" : "offline",
//         lastUpdate: reading?.recordedAt || new Date().toISOString(),
//         coordinates: {
//           latitude: station.latitude,
//           longitude: station.longitude,
//         },
//         readings: {
//           temperature: reading?.temperature || null,
//           humidity: reading?.humidity || null,
//           pressure: 1013, // Valor por defecto
//           windSpeed: reading?.anemometro || null,
//           windDirection: reading?.veleta || null,
//           precipitation: reading?.pluviometro || null,
//         },
//         history: Array.from({ length: 24 }, (_, i) => ({
//           timestamp: new Date(Date.now() - i * 3600000).toISOString(),
//           temperature: (reading?.temperature || 20) + Math.random() * 2,
//           humidity: (reading?.humidity || 50) + Math.random() * 5,
//         })),
//         alerts: [],
//         maintenance: {
//           lastCheck: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
//           nextScheduled: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
//           status: "Operativa",
//         },
//       };
//     });

//     console.log(JSON.stringify(structuredData, null, 2)); // Para verificar el JSON estructurado
//     return structuredData;
//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//     return [];
//   }
// };

// export default fetchAndTransformStationsData;

// const fetchAndTransformStationsData = async () => {
//     try {
//       // Obtener las URLs desde variables de entorno
//       const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;
//       const READINGS_API_URL = import.meta.env.VITE_READINGS_API_URL;
  
//       if (!STATIONS_API_URL || !READINGS_API_URL) {
//         throw new Error("Las URLs de las APIs no están definidas en las variables de entorno.");
//       }
  
//       // Fetch en paralelo
//       const [stationsResponse, readingsResponse] = await Promise.all([
//         fetch(STATIONS_API_URL).then((res) => res.json()),
//         fetch(READINGS_API_URL).then((res) => res.json()),
//       ]);
  
//       // Procesamiento de datos...
//       const latestReadings = readingsResponse.reduce((acc, reading) => {
//         if (
//           !acc[reading.stationId] || 
//           new Date(reading.recordedAt) > new Date(acc[reading.stationId].recordedAt)
//         ) {
//           acc[reading.stationId] = reading;
//         }
//         return acc;
//       }, {});
  
//       const structuredData = stationsResponse.map((station) => {
//         const reading = latestReadings[station.id];
  
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
//   export default fetchAndTransformStationsData;

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
