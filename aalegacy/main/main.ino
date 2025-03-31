#include <Arduino.h>
#include <WiFi.h>
#include "wifi_module.h"
#include "ota_module.h"
#include <DHT.h>
#include <Arduino_JSON.h>
#include <HTTPClient.h>

// -------------------------
// CONFIGURACIONES GENERALES
// -------------------------
#define FIRMWARE_VERSION "1.0.0"
#define DEVICE_NAME "NODO"

// -------------------------
// Configuración de redes WiFi (lista de respaldo)
// -------------------------
WiFiNetwork networks[] = {
  {"Tplink4568", "delc@mpo4268"},
  {"Auditorio Nodo", "auditorio.nodo"}  // Red secundaria de respaldo
};
const int numNetworks = sizeof(networks) / sizeof(WiFiNetwork);

// -------------------------
// CONFIGURACIÓN DEL SENSOR DHT (se usa en el pin 15, DHT11)
// -------------------------
#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// -------------------------
// CONFIGURACIÓN DEL SERVIDOR HTTP PARA ENVÍO DE DATOS
// -------------------------
const char* HTTP_SERVER_URL = "https://estacion-node-backend-1.onrender.com/api/weather/4";

// Intervalo para envío de datos vía HTTP (ej. 5 minutos)
const unsigned long INTERVALO_ENVIO = 300000;
unsigned long ultimoEnvio = 0;

// Variable para almacenar la MAC del dispositivo
String deviceMac;

// -------------------------

// SETUP
// -------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Conectar a WiFi usando el módulo creado (intenta la primera red; si falla, pasa a la siguiente)
  connectWiFi(networks, numNetworks);
  
  // Inicializar el sensor DHT
  dht.begin();
  
  // Obtener la MAC del dispositivo y mostrarla
  deviceMac = WiFi.macAddress();
  Serial.print("MAC: ");
  Serial.println(deviceMac);
  
  // Conectar al broker MQTT para OTA
  connectMQTTFW(deviceMac);
}

// -------------------------
// Loop Principal
// -------------------------
void loop() {
  // Ejecutar loop del módulo OTA para procesar mensajes MQTT
  otaLoop();
    // Publicar heartbeat cada 1 minuto
    deviceMac = WiFi.macAddress();

    otaHeartbeat(); // Envía el heartbeat cada 60 segundos

  // Verificar conexión WiFi en cada iteración
  if (WiFi.status() != WL_CONNECTED) {
    // Si se pierde, intentar reconectar
    connectWiFi(networks, numNetworks);
  }
  
  // Enviar datos vía HTTP cada INTERVALO_ENVIO
  unsigned long tiempoActual = millis();
  if (tiempoActual - ultimoEnvio >= INTERVALO_ENVIO) {
    ultimoEnvio = tiempoActual;
    
    // Leer sensores
    float temperatura = dht.readTemperature();
    float humedad = dht.readHumidity();
    
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println("°C");
    
    Serial.print("Humedad: ");
    Serial.print(humedad);
    Serial.println("%");
    
    // Enviar datos vía HTTP
    HTTPClient http;
    http.begin(HTTP_SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    
    JSONVar jsonData;
    jsonData["temperature"] = temperatura;
    jsonData["humidity"] = humedad;
    
    String postData = JSON.stringify(jsonData);
    int httpCode = http.POST(postData);
    Serial.print("HTTP Code: ");
    Serial.println(httpCode);
    http.end();
  }
  
  delay(1000);
}
