const API_URL = "http://localhost:5000/api/stations";

export const fetchStations = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const fetchStationById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};
