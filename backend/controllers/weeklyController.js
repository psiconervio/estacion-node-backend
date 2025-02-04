import prisma from '../config/prismaClient.js';

// 📌 Obtener la semana ISO y el año
const getISOWeek = (date) => {
  const tmpDate = new Date(date);
  tmpDate.setHours(0, 0, 0, 0);
  tmpDate.setDate(tmpDate.getDate() + 4 - (tmpDate.getDay() || 7));
  const yearStart = new Date(tmpDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tmpDate - yearStart) / 86400000) + 1) / 7);
  return [weekNo, tmpDate.getFullYear()];
};

// 📌 Obtener fechas de inicio y fin de la semana
const getStartAndEndDate = (week, year) => {
  const dto = new Date(year, 0, 1 + (week - 1) * 7);
  const diff = dto.getDate() - dto.getDay() + (dto.getDay() === 0 ? -6 : 1);
  const startDate = new Date(dto.setDate(diff)).toISOString().split('T')[0];
  const endDate = new Date(dto.setDate(dto.getDate() + 6)).toISOString().split('T')[0];
  return [startDate, endDate];
};

// 📌 Calcular moda
const calcularModa = (valores) => {
  const frecuencia = {};
  valores.forEach((val) => frecuencia[val] = (frecuencia[val] || 0) + 1);
  return Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0][0];
};

// 📌 Convertir a hora de Argentina (UTC-3)
const convertToArgentinaTime = (date) => {
  const argTimeOffset = -3;
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return new Date(utcDate.getTime() + argTimeOffset * 3600000);
};

// 📌 Controlador para procesar datos semanales
export const processWeeklyData = async (req, res) => {
  try {
    const data = await prisma.esp3201TableUpdatedia.findMany({ orderBy: [{ fecha: 'desc' }] });
    const weeks = {};

    data.forEach((row) => {
      const date = convertToArgentinaTime(new Date(row.fecha));
      const [week, year] = getISOWeek(date);
      const weekKey = `${year}-W${week}`;

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          max_temp: [], min_temp: [], max_humidity: [], min_humidity: [],
          moda_veleta: [], avg_anemometro: [], sum_pluviometro: 0
        };
      }

      weeks[weekKey]['max_temp'].push(row.max_temp);
      weeks[weekKey]['min_temp'].push(row.min_temp);
      weeks[weekKey]['max_humidity'].push(row.max_humidity);
      weeks[weekKey]['min_humidity'].push(row.min_humidity);
      weeks[weekKey]['moda_veleta'].push(row.moda_veleta);
      weeks[weekKey]['avg_anemometro'].push(row.avg_anemometro);
      weeks[weekKey]['sum_pluviometro'] += row.sum_pluviometro;
    });

    for (const [weekKey, values] of Object.entries(weeks)) {
      const [startDate, endDate] = getStartAndEndDate(
        parseInt(weekKey.split('-W')[1], 10), parseInt(weekKey.split('-W')[0], 10)
      );

      const recordExists = await prisma.esp3201TableRecordDiaSemanal.findFirst({ where: { semana: weekKey } });

      if (!recordExists) {
        await prisma.esp3201TableRecordDiaSemanal.create({
          data: {
            semana: weekKey,
            start_date: convertToArgentinaTime(new Date(startDate)),
            end_date: convertToArgentinaTime(new Date(endDate)),
            max_temp: Math.max(...values.max_temp),
            min_temp: Math.min(...values.min_temp),
            max_humidity: Math.max(...values.max_humidity),
            min_humidity: Math.min(...values.min_humidity),
            moda_veleta: calcularModa(values.moda_veleta),
            avg_anemometro: parseFloat((values.avg_anemometro.reduce((a, b) => a + b, 0) / values.avg_anemometro.length).toFixed(2)),
            sum_pluviometro: values.sum_pluviometro
          }
        });
      }
    }

    await prisma.$disconnect();
    res.status(200).json({ message: 'Datos semanales procesados y almacenados correctamente.' });
  } catch (error) {
    await prisma.$disconnect();
    res.status(500).json({ message: 'Ocurrió un error', error: error.message });
  }
};
