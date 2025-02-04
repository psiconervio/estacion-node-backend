import express from 'express';
import uvController from '../controllers/uvController.js';

const router = express.Router();

router.get('/uv', uvController.getUVData);

export default router;

// import express from 'express';
// import { getUVData, postUVData } from '../controllers/uvController.js';

// const router = express.Router();

// router.get('/', getUVData);
// router.post('/', postUVData); // Si deseas mantener el POST

// export default router;
