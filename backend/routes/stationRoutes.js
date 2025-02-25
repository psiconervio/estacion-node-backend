// src/routes/stationRoutes.js
import express from "express";
import {
  getStations,
  getStationById,
  createStation,
} from "../controllers/stationController.js";

const router = express.Router();

// Rutas para estaciones
router.get("/", getStations);
router.get("/:id", getStationById);
router.post("/", createStation);

export default router;