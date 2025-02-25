// src/controllers/stationController.js
// import prisma from "../prisma.js";
import prisma from "../config/db.js";

/**
 * GET /api/stations
 * Retorna la lista de todas las estaciones
 */
export const getStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany();
    res.json(stations);
  } catch (error) {
    console.error("Error al obtener estaciones:", error);
    res.status(500).json({ error: "Error al obtener estaciones" });
  }
};

/**
 * GET /api/stations/:id
 * Retorna una estación por su ID, con sus lecturas o promedios si se desea
 */
export const getStationById = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await prisma.station.findUnique({
      where: { id: Number(id) },
      include: {
        // Ejemplo: incluir lecturas o promedios
        weatherRecords: true,
        dailyAverages: true,
        weeklyAverages: true,
        monthlyAverages: true,
      },
    });
    if (!station) {
      return res.status(404).json({ error: "Estación no encontrada" });
    }
    res.json(station);
  } catch (error) {
    console.error("Error al obtener la estación:", error);
    res.status(500).json({ error: "Error al obtener la estación" });
  }
};

/**
 * POST /api/stations
 * Crea una nueva estación
 */
export const createStation = async (req, res) => {
  const { name, latitude, longitude, description } = req.body;
  try {
    const newStation = await prisma.station.create({
      data: {
        name,
        latitude,
        longitude,
        description,
      },
    });
    res.status(201).json(newStation);
  } catch (error) {
    console.error("Error al crear la estación:", error);
    res.status(500).json({ error: "Error al crear la estación" });
  }
};

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

// import fs from "fs";

// // Cargar estaciones desde el archivo JSON
// const stations = JSON.parse(fs.readFileSync("data/stations.json", "utf-8"));

// // Obtener todas las estaciones
// export const getStations = (req, res) => {
//   res.json(stations);
// };

// // Obtener una estación por ID
// export const getStationById = (req, res) => {
//   const station = stations.find((s) => s.id === req.params.id);
//   if (!station) return res.status(404).json({ message: "Estación no encontrada" });
//   res.json(station);
// };
