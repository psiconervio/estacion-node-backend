import express from 'express';
import cors from 'cors';
import recordRoutes from './routes/recordRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/records', recordRoutes);
// Rutas
app.use('/api/updatedia', updatediaRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/uv', uvRoutes);
app.use('/api/weekly', weeklyRoutes);
app.use('/api/cronjobs', cronRoutes);
app.use('/api/cronjobs', monthlyRoutes);



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
