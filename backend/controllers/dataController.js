// controllers/dataController.js
const dataService = require('../services/dataService');

exports.saveData = async (topic, message) => {
  try {
    // Convertimos el mensaje (buffer) a cadena y luego a objeto JSON
    const data = JSON.parse(message.toString());
    await dataService.createData(data);
    console.log('Datos insertados en la base de datos');
  } catch (error) {
    console.error('Error al guardar datos:', error);
  }
};
