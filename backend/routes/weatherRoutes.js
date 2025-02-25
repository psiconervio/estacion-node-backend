// src/routes/weatherRoutes.js
import express from "express";
import {
  getWeatherByStation,
  addWeatherData,
} from "../controllers/weatherController.js";
import { validateWeatherData } from "../middlewares/validateWeatherData.js";
const router = express.Router();

// Rutas para datos meteorológicos
router.get("/:stationId", getWeatherByStation);
router.post("/:stationId",validateWeatherData, addWeatherData);

export default router;
