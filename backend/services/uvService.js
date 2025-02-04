import fetch from 'node-fetch';

const fetchUVData = async () => {
  const API_KEY = 'openuv-3pu1yrlq6sxl37-io'; // Usa variables de entorno en producción
  const url = `https://api.openuv.io/api/v1/uv?lat=-28.51&lng=-65.82&alt=100&dt=${new Date().toISOString()}`;

  const headers = {
    'x-access-token': API_KEY,
    'Content-Type': 'application/json'
  };

  const requestOptions = {
    method: 'GET',
    headers,
    cache: 'no-store'
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error('Error al obtener los datos UV');
  }
  return await response.json();
};

export default { fetchUVData };
