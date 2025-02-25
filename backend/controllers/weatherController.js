// src/controllers/weatherController.js
// import prisma from "../prisma.js";
import prisma from "../config/db.js";
import moment from "moment-timezone";


/**
 * GET /api/weather/:stationId
 * Retorna las lecturas recientes de la estación
 */
export const getWeatherByStation = async (req, res) => {
  const { stationId } = req.params;
  try {
    const records = await prisma.weatherRecord.findMany({
      where: { stationId: Number(stationId) },
      orderBy: { recordedAt: "desc" },
      take: 50, // Ejemplo: últimas 50 lecturas
    });
    res.json(records);
  } catch (error) {
    console.error("Error al obtener datos de clima:", error);
    res.status(500).json({ error: "Error al obtener datos de clima" });
  }
};
/**
 * Devuelve la hora local de Argentina como un objeto Date
 */
function getArgentinaDate() {
  // Esto obtiene la fecha/hora formateada en el huso horario de Argentina
  const dateArgString = new Date().toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  // Lo convertimos a objeto Date (almacena el tiempo local)
  return new Date(dateArgString);
}

export const addWeatherData = async (req, res) => {
  const { stationId } = req.params;
  const { temperature, humidity, anemometro, pluviometro, veleta } = req.body;

  if (temperature == null || humidity == null || anemometro == null) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const newRecord = await prisma.weatherRecord.create({
      data: {
        stationId: Number(stationId),
        temperature,
        humidity,
        anemometro,
        pluviometro,
        veleta,
        // Guardamos la fecha local de Argentina
      },
    });
    return res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error al guardar datos de clima:", error);
    return res.status(500).json({ error: "Error al guardar datos de clima" });
  }
};
/**
 * POST /api/weather/:stationId
 * Recibe nuevos datos meteorológicos de la estación
 */
// export const addWeatherData = async (req, res) => {
//   const { stationId } = req.params;
//   const { temperature, humidity, anemometro, pluviometro, veleta } = req.body;

//   if (temperature == null || humidity == null || anemometro == null) {
//     return res.status(400).json({ error: "Datos incompletos" });
//   }

//   try {
//     const newRecord = await prisma.weatherRecord.create({
//       data: {
//         stationId: Number(stationId),
//         temperature,
//         humidity,
//         anemometro,
//         pluviometro,
//         veleta,
//         recordedAt: new Date(),
//       },
//     });
//     res.status(201).json(newRecord);
//   } catch (error) {
//     console.error("Error al guardar datos de clima:", error);
//     res.status(500).json({ error: "Error al guardar datos de clima" });
//   }
// };

/**
 * EJEMPLO: Cálculo de promedios diarios (lógica orientativa)
 * Podrías llamar a esta función con un cron job
 */
export const calculateDailyAverages = async () => {
  try {
    // 1. Obtener todas las estaciones
    const stations = await prisma.station.findMany();

    // 2. Para cada estación, calcular promedios del día anterior
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const dayStart = new Date(yesterday.setHours(0, 0, 0, 0));
    const dayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

    for (const station of stations) {
      const records = await prisma.weatherRecord.findMany({
        where: {
          stationId: station.id,
          recordedAt: { gte: dayStart, lte: dayEnd },
        },
      });

      if (records.length > 0) {
        const avgTemp = records.reduce((sum, r) => sum + r.temperature, 0) / records.length;
        const avgHum = records.reduce((sum, r) => sum + r.humidity, 0) / records.length;
        const avgWind = records.reduce((sum, r) => sum + r.windSpeed, 0) / records.length;

        await prisma.dailyAverage.create({
          data: {
            stationId: station.id,
            date: dayStart,
            averageTemp: avgTemp,
            averageHumidity: avgHum,
            averageWindSpeed: avgWind,
          },
        });
      }
    }
    console.log("Promedios diarios calculados correctamente");
  } catch (error) {
    console.error("Error al calcular promedios diarios:", error);
  }
};

// import fs from "fs";

// // Cargar datos meteorológicos desde el archivo JSON
// const weatherData = JSON.parse(fs.readFileSync("data/weather.json", "utf-8"));

// // Obtener datos meteorológicos de una estación
// // Obtener datos meteorológicos de una estación
// export const getWeatherByStation = (req, res) => {
//   const stationId = req.params.stationId;
//   const data = weatherData[stationId];
//   if (data) {
//     res.json(data);
//   } else {
//     res.status(404).json({ error: 'Estación no encontrada' });
//   }}
// export const getWeatherByStation = (req, res) => {
//   const stationId = req.params.stationId;
//   const data = weatherData[stationId] || [];
//   res.json(data);
// };

// import { WeatherData } from "../models/WeatherData.js";

// // Obtener datos meteorológicos de una estación
// export const getWeatherByStation = async (req, res) => {
//   const weatherData = await WeatherData.find({ station: req.params.stationId }).sort({ recordedAt: -1 }).limit(10);
//   res.json(weatherData);
// };

//api de clima
// import fetch from 'node-fetch';

// const apiUrl =
//   'https://api.openweathermap.org/data/2.5/weather?lat=-28.46957&lon=-65.78524&appid=2c290850870ebbba2a0d95586f2aa709';

// export const getWeatherData = async (req, res) => {
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al llamar a la API de clima' });
//   }
// };
