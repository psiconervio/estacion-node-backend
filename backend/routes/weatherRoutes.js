import express from "express";
import { getWeatherByStation } from "../controllers/weatherController.js";

const router = express.Router();
//ruta api/weather/:stationId
router.get("/:stationId", getWeatherByStation);

export default router;

// import express from 'express';
// import { getWeatherData } from '../controllers/weatherController.js';

// const router = express.Router();

// router.post('/', getWeatherData);

// export default router;
