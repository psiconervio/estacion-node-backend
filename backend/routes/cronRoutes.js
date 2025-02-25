// routes/dailyRoutes.js
import express from "express";
import { updateDailyData } from "../controllers/dailyAverageController.js";

const router = express.Router();
router.get("/update-daily", updateDailyData);
export default router;
