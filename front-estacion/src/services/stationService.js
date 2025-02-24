// src/services/stationService.js
export async function getAllStations() {
    try {
      const response = await fetch('/api/stations', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Error al obtener la lista de estaciones');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function getStationData(stationId) {
    try {
      const response = await fetch(`/api/stations/${stationId}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Error al obtener datos de la estación');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  