// controllers/dailyAverageController.js
import prisma from "../prisma.js";

/**
 * Cron job / script para calcular los datos diarios (máximos, mínimos, etc.)
 * y guardarlos en la tabla `DailyAverage`.
 */
export const updateDailyData = async (req, res) => {
  try {
    console.log("Iniciando script de actualización diaria");

    // 1. Obtenemos todas las filas de WeatherRecord
    const data = await prisma.weatherRecord.findMany();

    if (!data || data.length === 0) {
      console.log("No se encontraron registros en la base de datos");
      return res.json({ message: "No se encontraron registros en la base de datos" });
    }

    // 2. Agrupamos por fecha (día). Usaremos un objeto { [fechaString]: { ... } }
    const arrayfechasjs = {};

    data.forEach((row) => {
      // row.createdAt es un Date (UTC). Si quieres ajustarlo a Argentina:
      const createdAt = new Date(row.createdAt);
      // Ajuste manual a UTC-3 (opcional)
      createdAt.setHours(createdAt.getHours() - 3);

      // Extraemos sólo el YYYY-MM-DD
      const dateKey = createdAt.toISOString().split("T")[0];

      if (!arrayfechasjs[dateKey]) {
        arrayfechasjs[dateKey] = {
          temperaturas: [],
          humedades: [],
          veletas: [],
          anemometros: [],
          pluviometros: [],
        };
      }

      // Convertimos a número
      arrayfechasjs[dateKey].temperaturas.push(Number(row.temperature));
      arrayfechasjs[dateKey].humedades.push(Number(row.humidity));
      arrayfechasjs[dateKey].veletas.push(row.veleta);
      arrayfechasjs[dateKey].anemometros.push(Number(row.anemometro));
      arrayfechasjs[dateKey].pluviometros.push(Number(row.pluviometro));
    });

    console.log("Datos agrupados por fecha:", arrayfechasjs);

    // Función auxiliar para calcular la moda (veleta más frecuente)
    const calcularModa = (valores) => {
      const frecuencia = {};
      valores.forEach((val) => {
        frecuencia[val] = (frecuencia[val] || 0) + 1;
      });
      // Ordena desc por frecuencia y toma el primero
      return Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0][0];
    };

    // 3. Recorremos cada fecha y calculamos los datos
    for (const [dateString, values] of Object.entries(arrayfechasjs)) {
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

      // Creamos un objeto Date en UTC a las 00:00:00
      // para esa fecha. Ej: "2025-02-26T00:00:00.000Z"
      const formattedDate = new Date(`${dateString}T00:00:00.000Z`);

      console.log("Fecha formateada:", formattedDate);

      // 4. Verificamos si ya existe un DailyAverage para esa fecha
      const recordExists = await prisma.dailyAverage.findFirst({
        where: {
          date: formattedDate,
        },
      });

      if (!recordExists) {
        // 5. Si no existe, creamos un nuevo registro
        console.log("No existe un registro para la fecha:", formattedDate);
        await prisma.dailyAverage.create({
          data: {
            date: formattedDate,
            maxTemp: max_temp,
            minTemp: min_temp,
            maxHumidity: max_humidity,
            minHumidity: min_humidity,
            modeVeleta: moda_veleta,
            avgAnemometro: Number(avg_anemometro),
            sumPluviometro: sum_pluviometro,
          },
        });
        console.log("Registro creado para la fecha:", formattedDate);
      } else {
        console.log("El registro ya existe para la fecha:", formattedDate);
      }
    }

    console.log("Script de actualización diaria completado con éxito");
    return res.json({ message: "Actualización diaria completada con éxito." });
  } catch (error) {
    console.error("Error durante la actualización diaria:", error);
    return res.status(500).json({ message: "Ocurrió un error", error: error.message });
  }
};
