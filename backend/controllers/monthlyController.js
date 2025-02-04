import prisma from '../config/prismaClient.js';

// 📌 Función para calcular la moda
const calcularModa = (valores) => {
  const frecuencia = {};
  valores.forEach((val) => {
    frecuencia[val] = (frecuencia[val] || 0) + 1;
  });
  return Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0][0];
};

// 📌 Procesa los datos mensuales y los almacena en la BD
export const processMonthlyData = async (req, res) => {
  try {
    const data = await prisma.esp3201TableUpdatedia.findMany({
      orderBy: [{ fecha: 'desc' }]
    });

    const months = {};

    data.forEach((row) => {
      const date = new Date(row.fecha);
      const month = date.toISOString().slice(0, 7); // Formato 'YYYY-MM'

      if (!months[month]) {
        months[month] = {
          max_temp: [],
          min_temp: [],
          max_humidity: [],
          min_humidity: [],
          moda_veleta: [],
          avg_anemometro: [],
          sum_pluviometro: 0
        };
      }

      months[month].max_temp.push(row.max_temp);
      months[month].min_temp.push(row.min_temp);
      months[month].max_humidity.push(row.max_humidity);
      months[month].min_humidity.push(row.min_humidity);
      months[month].moda_veleta.push(row.moda_veleta);
      months[month].avg_anemometro.push(row.avg_anemometro);
      months[month].sum_pluviometro += row.sum_pluviometro;
    });

    for (const [month, values] of Object.entries(months)) {
      const recordExists = await prisma.esp3201TableRecordDiaMensual.findFirst({
        where: { mes: month }
      });

      if (!recordExists) {
        const avg_max_temp = parseFloat((values.max_temp.reduce((a, b) => a + b, 0) / values.max_temp.length).toFixed(2));
        const avg_min_temp = parseFloat((values.min_temp.reduce((a, b) => a + b, 0) / values.min_temp.length).toFixed(2));
        const avg_max_humidity = parseFloat((values.max_humidity.reduce((a, b) => a + b, 0) / values.max_humidity.length).toFixed(2));
        const avg_min_humidity = parseFloat((values.min_humidity.reduce((a, b) => a + b, 0) / values.min_humidity.length).toFixed(2));
        const moda_veleta = calcularModa(values.moda_veleta);
        const avg_anemometro = parseFloat((values.avg_anemometro.reduce((a, b) => a + b, 0) / values.avg_anemometro.length).toFixed(2));
        const sum_pluviometro = values.sum_pluviometro;

        await prisma.esp3201TableRecordDiaMensual.create({
          data: {
            mes: month,
            avg_max_temp,
            avg_min_temp,
            avg_max_humidity,
            avg_min_humidity,
            moda_veleta,
            avg_anemometro,
            sum_pluviometro
          }
        });
      }
    }

    await prisma.$disconnect();
    res.status(200).json({ message: 'Datos mensuales procesados y almacenados correctamente.' });
  } catch (error) {
    console.error("Error procesando los datos:", error);
    await prisma.$disconnect();
    res.status(500).json({ message: 'Ocurrió un error', error: error.message });
  }
};
