import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recordRoutes from './routes/recordRoutes.js';
import stationRoutes from "./routes/stationRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import  cronRoutes  from "./routes/cronRoutes.js";
import MqttClient from './mqtt/mqttClient';
import dataController from './controllers/dataController';

const brokerUrl = 'mqtt://localhost:1883'; // Cambia la URL según tu configuración
const topic = 'esp32/data'; // Tópico al que se enviarán los datos desde el ESP32

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
//envio de datos mqtt
// Instanciar el cliente MQTT
const mqttClient = new MqttClient(brokerUrl);

// Suscribirse al tópico definido
mqttClient.subscribe(topic);

// Manejar los mensajes recibidos
mqttClient.onMessage((topic, message) => {
  console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
  dataController.saveData(topic, message);
});

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
