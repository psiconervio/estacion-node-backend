// src/services/api.js
const API_URL = "http://localhost:5000/api/stations"; // o "/api/stations" si usas proxy
const API_URL_WEATHER = "http://localhost:5000/api/weather"; // o "/api/stations" si usas proxy

export const fetchStations = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener la lista de estaciones");
  }
  return response.json();
};

export const fetchStationById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener la estación");
  }
  return response.json();
};

export const fetchWeatherById = async (id) => {
  const response = await fetch(`${API_URL_WEATHER}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener la estación");
  }
  return response.json();
};

// const API_URL = "http://localhost:5000/api/stations";

// export const fetchStations = async () => {
//   const response = await fetch(API_URL);
//   return response.json();
// };

// export const fetchStationById = async (id) => {
//   const response = await fetch(`${API_URL}/${id}`);
//   return response.json();
// };
