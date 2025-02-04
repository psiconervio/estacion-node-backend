import express from 'express';
import { updateDailyData } from '../controllers/updatediaController.js';

const router = express.Router();

router.post('/', updateDailyData);

export default router;
