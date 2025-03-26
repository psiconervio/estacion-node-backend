// mqtt/mqttClient.js
const mqtt = require('mqtt');

class MqttClient {
  constructor(brokerUrl, options = {}) {
    this.client = mqtt.connect(brokerUrl, options);

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
    });

    this.client.on('error', (error) => {
      console.error('Error en MQTT:', error);
    });
  }

  subscribe(topic) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error al subscribirse al tópico "${topic}":`, err);
      } else {
        console.log(`Subscribido al tópico: ${topic}`);
      }
    });
  }

  onMessage(callback) {
    this.client.on('message', callback);
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

module.exports = MqttClient;
