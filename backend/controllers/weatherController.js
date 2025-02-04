import fetch from 'node-fetch';

const apiUrl =
  'https://api.openweathermap.org/data/2.5/weather?lat=-28.46957&lon=-65.78524&appid=2c290850870ebbba2a0d95586f2aa709';

export const getWeatherData = async (req, res) => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al llamar a la API de clima' });
  }
};
