// src/routes/stationRoutes.js
import express from "express";
import {
  getStations,
  getStationById,
  createStation,
  getStationsAll,
  getStationsWithWeatherRecords,
} from "../controllers/stationController.js";
import { validateStation } from "../middlewares/validateStation.js";

const router = express.Router();

// Rutas para estaciones
router.get("/", getStations);
router.get("/all", getStationsWithWeatherRecords);//ruta para obtener todas las estaciones con sus registros meteorologicos
router.get("/alll", getStationsAll);//ruta para obtener todas las estaciones con sus registros meteorologicos
router.get("/:id", getStationById);
router.post("/",validateStation, createStation);

export default router;