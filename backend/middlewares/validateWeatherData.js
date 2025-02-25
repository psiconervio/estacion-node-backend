// middlewares/validateWeatherData.js

import { body, param, validationResult } from "express-validator";

/**
 * Validaciones con express-validator:
 * - stationId debe ser un número
 * - temperature, humidity, anemometro son obligatorios y numéricos
 * - pluviometro opcional, pero si está, debe ser numérico y <= 1000
 * - veleta opcional (podrías agregar validaciones adicionales)
 */
export const validateWeatherData = [
  // Validar el param stationId
  param("stationId")
    .isInt()
    .withMessage("stationId debe ser un número entero"),

  // temperature requerido y numérico
  body("temperature")
    .notEmpty()
    .withMessage("El campo 'temperature' es obligatorio")
    .isNumeric()
    .withMessage("'temperature' debe ser numérico"),

  // humidity requerido y numérico
  body("humidity")
    .notEmpty()
    .withMessage("El campo 'humidity' es obligatorio")
    .isNumeric()
    .withMessage("'humidity' debe ser numérico"),

  // anemometro requerido y numérico
  body("anemometro")
    .notEmpty()
    .withMessage("El campo 'anemometro' es obligatorio")
    .isNumeric()
    .withMessage("'anemometro' debe ser numérico"),

  // pluviometro opcional, pero si existe, debe ser numérico y <= 1000
  body("pluviometro")
    .optional()
    .isNumeric()
    .withMessage("'pluviometro' debe ser numérico")
    .custom((value) => {
      if (value > 1000) {
        throw new Error("El pluviometro no puede superar 1000");
      }
      return true;
    }),

  // veleta opcional, podrías agregar validaciones extra si lo deseas
  body("veleta")
    .optional()
    .isString()
    .withMessage("'veleta' debe ser un string"),

  // Middleware final para manejar errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Retorna errores y NO llama al siguiente controlador
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
