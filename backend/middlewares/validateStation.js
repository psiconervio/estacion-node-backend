import { body, validationResult } from "express-validator";

export const validateStation = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud no válida"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud no válida"),
  body("description")
    .optional()
    .isString()
    .withMessage("Descripción no válida"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
