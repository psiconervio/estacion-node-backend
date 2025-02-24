// LEGACY
import express from "express";
import { getStations, getStationById } from "../controllers/stationController.js";

const router = express.Router();

router.get("/", getStations);
router.get("/:id", getStationById);

export default router;
