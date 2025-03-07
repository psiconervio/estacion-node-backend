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
router.get("/:id", getStationById);
router.post("/",validateStation, createStation);

export default router;