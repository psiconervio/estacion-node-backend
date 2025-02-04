import express from 'express';
import { processMonthlyData } from '../controllers/monthlyController.js';

const router = express.Router();

router.post('/update-monthly', processMonthlyData);

export default router;
