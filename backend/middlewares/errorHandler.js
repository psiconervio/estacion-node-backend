export function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
  