import { createRecord } from '../models/recordModel.js';

export const postRecord = async (req, res) => {
  try {
    const data = req.body;

    // Obtener la fecha y hora actual en Argentina
    const argentinaTimeZone = 'America/Argentina/Buenos_Aires';
    const now = new Date();
    const createdAt = new Intl.DateTimeFormat('en-US', {
      timeZone: argentinaTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);

    const newData = await createRecord({
      id: data.id,
      board: data.board || 'default_board',
      temperature: data.temperature || '404',
      humidity: data.humidity || '404',
      veleta: data.veleta || 'error',
      anemometro: data.anemometro || '404',
      pluviometro: data.pluviometro || '404',
      createdAt: new Date(createdAt),
    });

    res.json({ message: 'Datos recibidos y guardados', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error guardando datos', error: error.message });
  }
};

export const getRecord = (req, res) => {
  res.status(405).json({ message: 'Método no permitido' });
};
