import axios from 'axios';

const baseURL = `https://next-prisma-nextauth-eight.vercel.app`;

// 📌 Ejecutar las actualizaciones diarias, semanales y mensuales
export const runUpdates = async (req, res) => {
  try {
    console.log('Iniciando actualización diaria...');
    const diaResponse = await axios.post(`${baseURL}/api/cronjobs/updatedia`);
    console.log('Actualización diaria completada:', diaResponse.data);

    console.log('Iniciando actualización semanal...');
    const semanaResponse = await axios.post(`${baseURL}/api/cronjobs/updatesemana`);
    console.log('Actualización semanal completada:', semanaResponse.data);

    console.log('Iniciando actualización mensual...');
    const mesResponse = await axios.post(`${baseURL}/api/cronjobs/updatemensual`);
    console.log('Actualización mensual completada:', mesResponse.data);

    res.status(200).json({ message: 'Todas las actualizaciones completadas con éxito.' });
  } catch (error) {
    console.error('Error al ejecutar las actualizaciones:', error.message);
    console.error('Detalles del error:', error.response?.data || error);

    res.status(500).json({ message: 'Error al ejecutar las actualizaciones', error: error.message });
  }
};
