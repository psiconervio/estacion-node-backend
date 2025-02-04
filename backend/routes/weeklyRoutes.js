import express from 'express';
import { processWeeklyData } from '../controllers/weeklyController.js';

const router = express.Router();

router.post('/', processWeeklyData);

export default router;
