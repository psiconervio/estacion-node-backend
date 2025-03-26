// index.js
const MqttClient = require('./mqtt/mqttClient');
const dataController = require('./controllers/dataController');

const brokerUrl = 'mqtt://localhost:1883'; // Cambia la URL según tu configuración
const topic = 'esp32/data'; // Tópico al que se enviarán los datos desde el ESP32

// Instanciar el cliente MQTT
const mqttClient = new MqttClient(brokerUrl);

// Suscribirse al tópico definido
mqttClient.subscribe(topic);

// Manejar los mensajes recibidos
mqttClient.onMessage((topic, message) => {
  console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
  dataController.saveData(topic, message);
});
