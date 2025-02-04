export function calcularModa(valores) {
    const frecuencia = {};
    valores.forEach((val) => frecuencia[val] = (frecuencia[val] || 0) + 1);
    return Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0][0];
  }
  