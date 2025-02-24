// import { Station } from "../models/Station.js";

// // Obtener todas las estaciones
// export const getStations = async (req, res) => {
//   const stations = await Station.find();
//   res.json(stations);
// };

// // Obtener una estación por ID
// export const getStationById = async (req, res) => {
//   const station = await Station.findById(req.params.id);
//   if (!station) return res.status(404).json({ message: "Estación no encontrada" });
//   res.json(station);
// };

// // legacy

import fs from "fs";

// Cargar estaciones desde el archivo JSON
const stations = JSON.parse(fs.readFileSync("data/stations.json", "utf-8"));

// Obtener todas las estaciones
export const getStations = (req, res) => {
  res.json(stations);
};

// Obtener una estación por ID
export const getStationById = (req, res) => {
  const station = stations.find((s) => s.id === req.params.id);
  if (!station) return res.status(404).json({ message: "Estación no encontrada" });
  res.json(station);
};
