Crear primero las estaciones en el endpoint 
http://localhost:5000/api/stations con los datos:
ejemplo
{
  "name": "Estación Sudeste",
  "latitude": -34.6,
  "longitude": -58.3,
  "description": "Ubicada en zona céntrica"
}
y despues enviarlas a el enpoint api/weather/:id indicado con el cuerpo:


{
  "temperature": 22.5,
  "humidity": 75,
  "windSpeed": 10.2
}

CREAR LOS CRONJOBS DE DIA SEMANA MES CON LAS REFERENCIAS DE LOS CONTROLADORES ANTERIORES