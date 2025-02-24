import fs from "fs";

// Cargar datos meteorológicos desde el archivo JSON
const weatherData = JSON.parse(fs.readFileSync("data/weather.json", "utf-8"));

// Obtener datos meteorológicos de una estación
export const getWeatherByStation = (req, res) => {
  const stationId = req.params.stationId;
  const data = weatherData[stationId] || [];
  res.json(data);
};

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
