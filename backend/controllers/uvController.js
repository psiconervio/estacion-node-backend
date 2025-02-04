import uvService from '../services/uvService.js';

const getUVData = async (req, res) => {
  try {
    const data = await uvService.fetchUVData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los datos UV' });
  }
};

export default { getUVData };

// import fetch from 'node-fetch';

// const API_URL = 'https://api.openuv.io/api/v1/uv?lat=-28.51&lng=-65.82&alt=100';
// const API_KEY = 'openuv-3pu1yrlq6sxl37-io'; // ⚠️ Reemplaza con tu clave válida

// const fetchUVData = async () => {
//   const headers = {
//     'x-access-token': API_KEY,
//     'Content-Type': 'application/json',
//   };

//   try {
//     const url = `${API_URL}&dt=${new Date().toISOString()}`;
//     const response = await fetch(url, { method: 'GET', headers });
//     return await response.json();
//   } catch (error) {
//     console.error('Error al obtener datos UV:', error);
//     throw new Error('Error al obtener los datos UV');
//   }
// };

// // 📌 Método GET
// export const getUVData = async (req, res) => {
//   try {
//     const data = await fetchUVData();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // 📌 Método POST (opcional si necesitas ambas opciones)
// export const postUVData = async (req, res) => {
//   try {
//     const data = await fetchUVData();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
