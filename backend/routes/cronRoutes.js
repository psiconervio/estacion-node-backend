import express from 'express';
import { runUpdates } from '../controllers/cronController.js';

const router = express.Router();

router.post('/runUpdates', runUpdates);

export default router;
