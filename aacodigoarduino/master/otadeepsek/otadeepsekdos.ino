#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <Update.h>

// =====================
// CONFIGURACIONES
// =====================
#define FIRMWARE_VERSION "1.0.0"

// Credenciales WiFi
const char* WIFI_SSID     = "PB02";
const char* WIFI_PASSWORD = "12345678";

// Broker MQTT (ej. HiveMQ Cloud)
const char* MQTT_HOST     = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
const int   MQTT_PORT     = 8883;  // TLS
const char* MQTT_USER     = "Augustodelcampo97";
const char* MQTT_PASS     = "Augustodelcampo97";

// =====================
// GLOBALES
// =====================
WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

String deviceMac; // Guardará la MAC, ej: "AA:BB:CC:11:22:33"

// =====================
// Función OTA
// =====================
void doOTA(const String& url) {
  HTTPClient http;
  http.begin(url); 
  int httpCode = http.GET();
  if (httpCode == 200) {
    int contentLength = http.getSize();
    WiFiClient * stream = http.getStreamPtr();
    if (contentLength > 0 && Update.begin(contentLength)) {
      size_t written = Update.writeStream(*stream);
      if (written == contentLength && Update.end(true)) {
        ESP.restart();
      }
    }
  }
  http.end();
}

// =====================
// Callback MQTT
// =====================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  // Formato: "<MAC>|<URL>" o "all|<URL>"
  int sepIndex = msg.indexOf('|');
  if (sepIndex < 0) return;

  String targetId = msg.substring(0, sepIndex);
  String firmwareUrl = msg.substring(sepIndex + 1);

  if ((targetId == deviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
    doOTA(firmwareUrl);
  }
}

// =====================
// Conexión WiFi
// =====================
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

// =====================
// Conexión MQTT
// =====================
void connectMQTT() {
  // Preparamos el Last Will & Testament
  // Al desconectarse inesperadamente, el broker publicará este JSON en "esp32/status"
  String willTopic = "esp32/status";
  String willMessage = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"offline\"}";

  // Usamos el MAC como Client ID
  String clientId = String("ESP32-") + deviceMac;

  // Intentamos conectar en bucle
  while (!mqttClient.connected()) {
    mqttClient.connect(
      clientId.c_str(),
      MQTT_USER,
      MQTT_PASS,
      willTopic.c_str(),
      0,    // QoS
      false, // Retain
      willMessage.c_str()
    );
    delay(500);
  }

  // Al conectar, publicamos "online"
  String onlineMsg = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"online\",\"version\":\"" + FIRMWARE_VERSION + "\"}";
  mqttClient.publish("esp32/status", onlineMsg.c_str(), false);

  // Suscribirse al tópico de OTA
  mqttClient.subscribe("esp32/update");
}

// =====================
// SETUP
// =====================
void setup() {
  Serial.begin(115200);

  // Obtener MAC
  deviceMac = WiFi.macAddress(); // Devuelve ej: "AA:BB:CC:11:22:33"

  connectWiFi();

  // TLS inseguro (demo). En producción: setCACert(...)
  espClient.setInsecure();

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  connectMQTT();
}

// =====================
// LOOP
// =====================
void loop() {
  mqttClient.loop();
}
