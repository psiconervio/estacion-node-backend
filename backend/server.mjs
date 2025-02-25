import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recordRoutes from './routes/recordRoutes.js';
import stationRoutes from "./routes/stationRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import  cronRoutes  from "./routes/cronRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
// Rutas para datos meteorológicos
app.use("/api/stations", stationRoutes);
app.use("/api/weather", weatherRoutes);
//cronjobs
app.use("/api/cronjobs", cronRoutes);
//CONFIGURACION ESTACION DE CLIMA
// mongoose.connect("mongodb://localhost/weatherDB", { useNewUrlParser: true, useUnifiedTopology: true });
// app.use("/api/stations", stationRoutes);
// app.use("/api/weather", weatherRoutes);
//HASTA ACA CONFIGURACION ESTACION DE CLIMA
// app.use("/api/stations", stationRoutes);
// Rutas
app.use('/api/records', recordRoutes);
// Rutas
// app.use('/api/updatedia', updatediaRoutes);
// app.use('/api/weather', weatherRoutes);
// app.use('/api/uv', uvRoutes);
// app.use('/api/weekly', weeklyRoutes);
// app.use('/api/cronjobs', cronRoutes);
// app.use('/api/cronjobs', monthlyRoutes);
// app.use('/api', uvRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
