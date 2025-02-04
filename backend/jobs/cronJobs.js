import cron from 'node-cron';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/cronjobs';

cron.schedule('0 0 * * *', async () => {  // Ejecuta todos los días a medianoche
  console.log('Ejecutando actualización diaria...');
  await axios.post(`${baseURL}/update-daily`);
});

cron.schedule('0 0 * * 1', async () => {  // Todos los lunes a medianoche
  console.log('Ejecutando actualización semanal...');
  await axios.post(`${baseURL}/update-weekly`);
});

cron.schedule('0 0 1 * *', async () => {  // Cada 1° del mes a medianoche
  console.log('Ejecutando actualización mensual...');
  await axios.post(`${baseURL}/update-monthly`);
});
