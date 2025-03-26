// services/dataService.js
const prisma = require('../models/prismaClient');

exports.createData = async (data) => {
  // Asegúrate de ajustar los campos según tu esquema y los datos que recibas.
  return await prisma.data.create({
    data: {
      value: data.value,
      timestamp: new Date() // o usa data.timestamp si el ESP32 envía la fecha
    }
  });
};
