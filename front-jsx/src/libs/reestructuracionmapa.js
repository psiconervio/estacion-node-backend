
//codigo con algunos errores
async function fetchmap() {
  try {
    const response = await fetch('http://localhost:5000/api/stations/alll');
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();

    const transformedStations = data.map((station) => {
      const record = station.weatherRecords[0]; // Tomamos el primer registro de clima

      const idParts = station.name.split(' ');
      const id = idParts[idParts.length - 1].toLowerCase();

      // Se usan directamente las coordenadas que trae la API
      const latitude = station.latitude;
      const longitude = station.longitude;

      let temperature = Number(record.temperature.toFixed(1));
      let humidity = record.humidity;

      // Lógica de ajustes, si es necesario (puedes quitarla si no la requieres)
      // Ejemplo: para la estación "norte", se sobrescriben valores:
      // if (id === 'norte') {
      //   temperature = 22.1;
      //   humidity = 58;
      // }

      // Determinamos el status basándonos en la humedad (>70 offline)
      const status = humidity > 70 ? 'offline' : 'online';

      // Convertimos la fecha al formato deseado
      const lastUpdate = new Date(record.recordedAt).toISOString().slice(0, 19);

      return {
        id,
        name: station.name,
        location: station.description || 'Ubicada en zona céntrica',
        latitude,
        longitude,
        temperature,
        humidity,
        status,
        lastUpdate
      };
    });

    console.log(transformedStations);
    return transformedStations;
  } catch (error) {
    console.error('Error al obtener las estaciones meteorológicas:', error);
    return [];
  }
}

export default fetchmap;

// async function fetchmap() {
//     try {
//       const response = await fetch('http://localhost:5000/api/stations/all');
//       if (!response.ok) {
//         throw new Error('Error en la respuesta del servidor');
//       }
//       const data = await response.json();
  
//       // Mapeo de coordenadas según la estación (con los valores esperados)
//       const coordinateMapping = {
//         'estación sudeste': { latitude: -34.6037, longitude: -58.3816 },
//         'estación norte': { latitude: -34.5875, longitude: -58.3819 },
//         'estación sur':   { latitude: -34.6157, longitude: -58.3815 },
//         'estación este':  { latitude: -34.6037, longitude: -58.3716 }
//       };
  
//       // Valores estáticos esperados para cada estación
//       const overrides = {
//         'estación sudeste': { temperature: 21.6, humidity: 60, status: 'online',  lastUpdate: '2025-02-28T17:19:30' },
//         'estación norte':   { temperature: 22.1, humidity: 58, status: 'offline', lastUpdate: '2025-03-06T15:41:44' },
//         'estación sur':     { temperature: 21.8, humidity: 62, status: 'offline', lastUpdate: '2025-03-06T15:41:44' },
//         'estación este':    { temperature: 21.9, humidity: 59, status: 'offline', lastUpdate: '2025-03-06T15:41:44' }
//       };
  
//       const transformedStations = data.map((station) => {
//         // Se asume que siempre existe al menos un registro de clima
//         const record = station.weatherRecords[0];
  
//         // Creamos una llave a partir del nombre en minúsculas
//         const stationKey = station.name.toLowerCase();
//         const override = overrides[stationKey];
  
//         // Generamos el id a partir de la última palabra del nombre (en minúsculas)
//         const idParts = station.name.split(' ');
//         const id = idParts[idParts.length - 1].toLowerCase();
  
//         // Obtenemos las coordenadas transformadas o usamos las originales
//         const coords = coordinateMapping[stationKey] || {
//           latitude: station.latitude,
//           longitude: station.longitude
//         };
  
//         // Si existe un override, usamos sus valores; sino usamos los del registro de la API
//         const temperature = override ? override.temperature : Number(record.temperature.toFixed(1));
//         const humidity    = override ? override.humidity : record.humidity;
//         const status      = override ? override.status : (humidity > 70 ? 'offline' : 'online');
//         const lastUpdate  = override ? override.lastUpdate : new Date(record.recordedAt).toISOString().slice(0, 19);
  
//         return {
//           id,
//           name: station.name,
//           location: station.description || 'Ubicada en zona céntrica',
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           temperature,
//           humidity,
//           status,
//           lastUpdate
//         };
//       });
  
//       console.log(transformedStations);
//       return transformedStations;
//     } catch (error) {
//       console.error('Error al obtener las estaciones meteorológicas:', error);
//       return [];
//     }
//   }
  
//   export default fetchmap;
  
  
// async function fetchmap() {
//     try {
//         const response = await fetch('http://localhost:5000/api/stations/all');
//         if (!response.ok) {
//             throw new Error('Error en la respuesta del servidor');
//         }
//         const data = await response.json();

//         const coordinateMapping = {
//             'estación sudeste': { latitude: -34.6037, longitude: -58.3816 },
//             'estación norte': { latitude: -34.5875, longitude: -58.3819 },
//             'estación sur': { latitude: -34.6, longitude: -58.3 },
//             'estación este': { latitude: -34.6, longitude: -58.3 }
//         };

//         const transformedStations = data.map((station) => {
//             const record = station.weatherRecords[0]; // Tomamos el primer registro de clima

//             const idParts = station.name.split(' ');
//             const id = idParts[idParts.length - 1].toLowerCase();

//             const coords = coordinateMapping[station.name.toLowerCase()] || {
//                 latitude: station.latitude,
//                 longitude: station.longitude
//             };

//             let temperature = Number(record.temperature.toFixed(1));
//             let humidity = record.humidity;

//             // Aplicamos ajustes según la estación si es necesario
//             if (id === 'norte') {
//                 temperature = 22.1;
//                 humidity = 58;
//             }

//             // Ajustamos el estado de la estación
//             const status = humidity > 70 ? 'offline' : 'online';

//             // Convertimos la fecha al formato esperado (sin milisegundos y ajustando zona horaria)
//             const lastUpdate = new Date(record.recordedAt).toISOString().slice(0, 19);

//             return {
//                 id,
//                 name: station.name,
//                 location: station.description || 'Ubicada en zona céntrica',
//                 latitude: coords.latitude,
//                 longitude: coords.longitude,
//                 temperature,
//                 humidity,
//                 status,
//                 lastUpdate
//             };
//         });
//         console.log(transformedStations);
//         return transformedStations;
//     } catch (error) {
//         console.error('Error al obtener las estaciones meteorológicas:', error);
//         return [];
//     }
// }
// fetchmap()

// export default fetchmap;

//CODIGO ANDANDO BIEN 
// async function weatherStations() {
//     try {
//       // Reemplaza la URL por el endpoint real
//       const response = await fetch('http://localhost:5000/api/stations/alll');
//       if (!response.ok) {
//         throw new Error('Error en la respuesta del servidor');
//       }
//       const data = await response.json();
  
//       // Mapeo de coordenadas (ejemplo, según nombre de la estación)
//       const coordinateMapping = {
//         'estación sudeste': { latitude: -34.6037, longitude: -58.3816 },
//         'estación norte': { latitude: -34.5875, longitude: -58.3819 }
//       };
  
//       const transformedStations = data.map((station) => {
//         // Se asume que siempre se tiene al menos un registro en weatherRecords
//         const record = station.weatherRecords[0];
  
//         // Convertir el id a string basado en el último elemento del nombre en minúsculas
//         // Por ejemplo: "Estación Sudeste" -> "sudeste"
//         const idParts = station.name.split(' ');
//         const id = idParts[idParts.length - 1].toLowerCase();
  
//         // Obtener las coordenadas transformadas, si existe un mapeo, sino se usan las originales
//         const coords = coordinateMapping[station.name.toLowerCase()] || {
//           latitude: station.latitude,
//           longitude: station.longitude
//         };
  
//         // Ejemplo de transformación de temperatura y humedad
//         // Se redondea la temperatura a un decimal
//         let temperature = Number(record.temperature.toFixed(1));
//         let humidity = record.humidity;
  
//         // Si deseas aplicar ajustes según la estación (como en el ejemplo de "norte")
//         if (id === 'norte') {
//           temperature = 22.1; // valor ajustado
//           humidity = 58;      // valor ajustado
//         }
  
//         // Definir el status; por ejemplo, si la humedad es mayor a 70, se marca como offline
//         // (esta lógica es solo un ejemplo y puedes ajustarla según tus criterios)
//         const status = humidity > 70 ? 'offline' : 'online';
  
//         // Convertir el recordedAt a un formato sin milisegundos
//         // Nota: podrías aplicar además alguna transformación de zona horaria si es necesario
//         const lastUpdate = new Date(record.recordedAt).toISOString().slice(0, 19);
  
//         return {
//           id,
//           name: station.name,
//           location: station.description,
//           latitude: coords.latitude,
//           longitude: coords.longitude,
//           temperature,
//           humidity,
//           status,
//           lastUpdate
//         };
//       });
  
//       // Puedes exportarlo o retornarlo según necesites
//       return transformedStations;
//     } catch (error) {
//       console.error('Error al obtener las estaciones meteorológicas:', error);
//       return [];
//     }
//   }

//     weatherStations().then((stations) => {
//     console.log('Estaciones transformadas:', stations);
//   });
// export default weatherStations;
  
//   // Ejemplo de uso:
