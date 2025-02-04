import { getAllRecords, findRecordByDate, createUpdatedRecord } from '../models/updatediaModel.js';

export const updateDailyData = async (req, res) => {
  try {
    console.log('Iniciando script de actualización diaria');

    const data = await getAllRecords();

    if (!data || data.length === 0) {
      console.log('No se encontraron registros en la base de datos');
      return res.json({ message: 'No se encontraron registros en la base de datos' });
    }

    const arrayfechasjs = {};

    data.forEach((row) => {
      const createdAt = new Date(row.createdAt);
      createdAt.setHours(createdAt.getHours() - 3); // Ajuste a UTC-3 (Argentina)
      const date = createdAt.toISOString().split('T')[0];

      if (!arrayfechasjs[date]) {
        arrayfechasjs[date] = {
          temperaturas: [],
          humedades: [],
          veletas: [],
          anemometros: [],
          pluviometros: [],
        };
      }

      arrayfechasjs[date].temperaturas.push(parseFloat(row.temperature));
      arrayfechasjs[date].humedades.push(parseFloat(row.humidity));
      arrayfechasjs[date].veletas.push(row.veleta);
      arrayfechasjs[date].anemometros.push(parseFloat(row.anemometro));
      arrayfechasjs[date].pluviometros.push(parseFloat(row.pluviometro));
    });

    console.log('Datos agrupados por fecha:', arrayfechasjs);

    const calcularModa = (valores) => {
      const frecuencia = {};
      valores.forEach((val) => {
        frecuencia[val] = (frecuencia[val] || 0) + 1;
      });
      return Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0][0];
    };

    for (const [date, values] of Object.entries(arrayfechasjs)) {
      const max_temp = Math.max(...values.temperaturas);
      const min_temp = Math.min(...values.temperaturas);
      const max_humidity = Math.max(...values.humedades);
      const min_humidity = Math.min(...values.humedades);
      const moda_veleta = calcularModa(values.veletas);
      const max_anemometro = Math.max(...values.anemometros);
      const min_anemometro = Math.min(...values.anemometros);
      const avg_anemometro = (
        values.anemometros.reduce((a, b) => a + b, 0) / values.anemometros.length
      ).toFixed(2);
      const sum_pluviometro = values.pluviometros.reduce((a, b) => a + b, 0);

      const formattedDate = new Date(`${date}T00:00:00.000Z`);

      console.log('Fecha formateada:', formattedDate);

      const recordExists = await findRecordByDate(formattedDate);

      if (!recordExists) {
        console.log('No existe un registro para la fecha:', formattedDate);
        await createUpdatedRecord({
          fecha: formattedDate,
          max_temp,
          min_temp,
          max_humidity,
          min_humidity,
          moda_veleta,
          avg_anemometro: parseFloat(avg_anemometro),
          sum_pluviometro,
        });
        console.log('Registro creado para la fecha:', formattedDate);
      } else {
        console.log('El registro ya existe para la fecha:', formattedDate);
      }
    }

    console.log('Script de actualización diaria completado con éxito');
    return res.json({ message: 'Actualización diaria completada con éxito.' });
  } catch (error) {
    console.error('Error durante la actualización diaria:', error);
    return res.status(500).json({ message: 'Ocurrió un error', error: error.message });
  }
};
