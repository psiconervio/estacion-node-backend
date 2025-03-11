#include <WiFi.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

// Configuración WiFi
const char* ssid = "PB02";
const char* password = "12345678";

// Servidor de actualizaciones
const char* updateServer = "https://servidor-esp32.onrender.com:3000";
String firmwareVersionURL = "/firmware/version";
String firmwareImageURL = "/firmware/image";

// Versión actual del firmware
const String FW_VERSION = "1.0.0";

// Intervalo para verificar actualizaciones (en ms)
const long checkInterval = 6000; 
unsigned long lastCheck = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando...");
  
  // Conexión WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
  
  // Configurar OTA Arduino
  ArduinoOTA.setHostname("esp32-ota");
  ArduinoOTA.setPassword("admin");
  
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_SPIFFS
      type = "filesystem";
    }
    Serial.println("Iniciando actualización " + type);
  });
  
  ArduinoOTA.onEnd([]() {
    Serial.println("\nActualización finalizada");
  });
  
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progreso: %u%%\r", (progress / (total / 100)));
  });
  
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Autenticación fallida");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Inicio fallido");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Conexión fallida");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Recepción fallida");
    else if (error == OTA_END_ERROR) Serial.println("Finalización fallida");
  });
  
  ArduinoOTA.begin();
  Serial.println("OTA listo");
  
  // Verificar actualización HTTP al inicio
  checkForUpdates();
}

void loop() {
  // Manejar OTA Arduino
  ArduinoOTA.handle();
  
  // Verificar actualizaciones HTTP periódicamente
  unsigned long currentMillis = millis();
  if (currentMillis - lastCheck >= checkInterval) {
    lastCheck = currentMillis;
    checkForUpdates();
  }
  
  // Tu código principal aquí
  delay(10);
}

void checkForUpdates() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  Serial.println("Verificando actualizaciones...");
  
  HTTPClient http;
  http.begin(String(updateServer) + firmwareVersionURL);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String newFWVersion = http.getString();
    Serial.println("Versión actual: " + FW_VERSION);
    Serial.println("Versión disponible: " + newFWVersion);
    
    if (newFWVersion != FW_VERSION) {
      Serial.println("Nueva versión disponible");
      updateFirmware();
    } else {
      Serial.println("Firmware actualizado");
    }
  } else {
    Serial.println("Error al verificar versión: " + String(httpCode));
  }
  
  http.end();
}

void updateFirmware() {
  Serial.println("Iniciando actualización HTTP...");
  
  WiFiClient client;
  t_httpUpdate_return ret = httpUpdate.update(client, String(updateServer) + firmwareImageURL);
  
  switch (ret) {
    case HTTP_UPDATE_FAILED:
      Serial.printf("Actualización HTTP fallida: Error (%d): %s\n", httpUpdate.getLastError(), httpUpdate.getLastErrorString().c_str());
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("HTTP no hay actualizaciones");
      break;
    case HTTP_UPDATE_OK:
      Serial.println("HTTP actualización exitosa");
      break;
  }
}