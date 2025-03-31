#include "ota_module.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <Update.h>
#include <WiFiClient.h>

// Definiciones de firmware y nombre del dispositivo (puedes definirlas en otro sitio si lo prefieres)
// #ifndef FIRMWARE_VERSION
  #define FIRMWARE_VERSION "1.0.0"
// #endif

// #ifndef DEVICE_NAME
  #define DEVICE_NAME "NODO"
// #endif

// Configuración para el broker OTA
const char* MQTT_FW_HOST = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
const int MQTT_FW_PORT = 8883;
const char* MQTT_FW_USER = "Augustodelcampo97";
const char* MQTT_FW_PASS = "Augustodelcampo97";

// Cliente MQTT seguro
WiFiClientSecure fwClient;
PubSubClient mqttClientFW(fwClient);
String globalDeviceMac;  // Se asignará en connectMQTTFW

// Variables para heartbeat
extern unsigned long lastHeartbeat = 0;
extern const unsigned long HEARTBEAT_INTERVAL = 60000; // 60 segundos

void doOTA(const String& url) {
  Serial.println("[OTA] Iniciando descarga: " + url);
  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 200) {
    int contentLength = http.getSize();
    WiFiClient* stream = http.getStreamPtr();
    if (contentLength > 0 && Update.begin(contentLength)) {
      size_t written = Update.writeStream(*stream);
      if (written == contentLength && Update.end(true)) {
        Serial.println("[OTA] Actualización exitosa. Reiniciando...");
        ESP.restart();
      } else {
        Serial.println("[OTA] Error al finalizar la actualización.");
      }
    } else {
      Serial.println("[OTA] No se pudo iniciar la actualización.");
    }
  } else {
    Serial.printf("[OTA] Error HTTP code: %d\n", httpCode);
  }
  http.end();
}

void mqttCallbackFW(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  // Se espera el formato: "<MAC>|<URL>" o "all|<URL>"
  int sepIndex = msg.indexOf('|');
  if (sepIndex < 0) return;
  String targetId = msg.substring(0, sepIndex);
  String firmwareUrl = msg.substring(sepIndex + 1);
  // Ejecuta OTA si el mensaje es para este dispositivo o para todos
  if ((targetId == globalDeviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
    Serial.println("[OTA] Comando recibido para actualizar firmware.");
    doOTA(firmwareUrl);
  }
}

void connectMQTTFW(const String& deviceMac) {
  globalDeviceMac = deviceMac;
  String willTopic = "esp32/status";
  // Se incluye name y version en el mensaje online
  String willMessage = String("{\"mac\":\"") + deviceMac + "\",\"name\":\"" + DEVICE_NAME + "\",\"status\":\"offline\",\"version\":\"" + FIRMWARE_VERSION + "\"}";
  String clientId = "ESP32-FW-" + deviceMac;
  fwClient.setInsecure();  // Para demo; en producción se debe validar el certificado
  mqttClientFW.setServer(MQTT_FW_HOST, MQTT_FW_PORT);
  mqttClientFW.setCallback(mqttCallbackFW);
  
  while (!mqttClientFW.connected()) {
    Serial.println("Conectando a MQTT (firmware)...");
    if (mqttClientFW.connect(clientId.c_str(), MQTT_FW_USER, MQTT_FW_PASS,
                             willTopic.c_str(), 0, false, willMessage.c_str())) {
      Serial.println("MQTT (firmware) conectado!");
      // Mensaje online con name y versión incluidos
      String onlineMsg = String("{\"mac\":\"") + deviceMac + "\",\"name\":\"" + DEVICE_NAME + "\",\"status\":\"online\",\"version\":\"" + FIRMWARE_VERSION + "\"}";
      mqttClientFW.publish("esp32/status", onlineMsg.c_str(), false);
      mqttClientFW.subscribe("esp32/update");
    } else {
      Serial.print("Error MQTT (firmware): ");
      Serial.println(mqttClientFW.state());
      delay(2000);
    }
  }
}

void otaLoop() {
  mqttClientFW.loop();
}

void otaHeartbeat() {
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    // Se incluye name y versión en el mensaje heartbeat
    String hbMsg = String("{\"mac\":\"") + globalDeviceMac + "\",\"name\":\"" + DEVICE_NAME + "\",\"status\":\"online\",\"version\":\"" + FIRMWARE_VERSION + "\",\"uptime\":" + millis() + "}";
    mqttClientFW.publish("esp32/heartbeat", hbMsg.c_str(), false);
    Serial.println("Heartbeat enviado: " + hbMsg);
  }
}

// #include "ota_module.h"
// #include <WiFiClientSecure.h>
// #include <PubSubClient.h>
// #include <HTTPClient.h>
// #include <Update.h>
// #include <WiFiClient.h>

// // Configuración para el broker OTA
// const char* MQTT_FW_HOST = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
// const int MQTT_FW_PORT = 8883;
// const char* MQTT_FW_USER = "Augustodelcampo97";
// const char* MQTT_FW_PASS = "Augustodelcampo97";

// // Cliente MQTT seguro
// WiFiClientSecure fwClient;
// PubSubClient mqttClientFW(fwClient);
// String globalDeviceMac;  // Para usar en el callback

// // Variables para heartbeat
// extern unsigned long lastHeartbeat = 0;
// const unsigned long HEARTBEAT_INTERVAL = 60000; // 60 segundos

// void doOTA(const String& url) {
//   Serial.println("[OTA] Iniciando descarga: " + url);
//   HTTPClient http;
//   http.begin(url);
//   int httpCode = http.GET();
//   if (httpCode == 200) {
//     int contentLength = http.getSize();
//     WiFiClient* stream = http.getStreamPtr();
//     if (contentLength > 0 && Update.begin(contentLength)) {
//       size_t written = Update.writeStream(*stream);
//       if (written == contentLength && Update.end(true)) {
//         Serial.println("[OTA] Actualización exitosa. Reiniciando...");
//         ESP.restart();
//       } else {
//         Serial.println("[OTA] Error al finalizar la actualización.");
//       }
//     } else {
//       Serial.println("[OTA] No se pudo iniciar la actualización.");
//     }
//   } else {
//     Serial.printf("[OTA] Error HTTP code: %d\n", httpCode);
//   }
//   http.end();
// }

// void mqttCallbackFW(char* topic, byte* payload, unsigned int length) {
//   String msg;
//   for (unsigned int i = 0; i < length; i++) {
//     msg += (char)payload[i];
//   }
//   // Se espera el formato: "<MAC>|<URL>" o "all|<URL>"
//   int sepIndex = msg.indexOf('|');
//   if (sepIndex < 0) return;
//   String targetId = msg.substring(0, sepIndex);
//   String firmwareUrl = msg.substring(sepIndex + 1);
//   // Ejecuta OTA si el mensaje es para este dispositivo o para todos
//   if ((targetId == globalDeviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
//     Serial.println("[OTA] Comando recibido para actualizar firmware.");
//     doOTA(firmwareUrl);
//   }
// }

// void connectMQTTFW(const String& deviceMac) {
//   globalDeviceMac = deviceMac;
//   String willTopic = "esp32/status";
//   String willMessage = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"offline\"}";
//   String clientId = "ESP32-FW-" + deviceMac;
//   fwClient.setInsecure();  // Para demo; en producción se debe validar el certificado
//   mqttClientFW.setServer(MQTT_FW_HOST, MQTT_FW_PORT);
//   mqttClientFW.setCallback(mqttCallbackFW);
  
//   while (!mqttClientFW.connected()) {
//     Serial.println("Conectando a MQTT (firmware)...");
//     if (mqttClientFW.connect(clientId.c_str(), MQTT_FW_USER, MQTT_FW_PASS,
//                              willTopic.c_str(), 0, false, willMessage.c_str())) {
//       Serial.println("MQTT (firmware) conectado!");
//       String onlineMsg = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"online\"}";
//       mqttClientFW.publish("esp32/status", onlineMsg.c_str(), false);
//       mqttClientFW.subscribe("esp32/update");
//     } else {
//       Serial.print("Error MQTT (firmware): ");
//       Serial.println(mqttClientFW.state());
//       delay(2000);
//     }
//   }
// }

// void otaLoop() {
//   mqttClientFW.loop();
// }

// void otaHeartbeat() {
//   if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
//     lastHeartbeat = millis();
//     String hbMsg = String("{\"mac\":\"") + globalDeviceMac + "\",\"status\":\"online\",\"uptime\":" + millis() + "}";
//     mqttClientFW.publish("esp32/heartbeat", hbMsg.c_str(), false);
//     Serial.println("Heartbeat enviado: " + hbMsg);
//   }
// }

// // #include "ota_module.h"
// // #include <WiFiClientSecure.h>
// // #include <PubSubClient.h>
// // #include <HTTPClient.h>
// // #include <Update.h>
// // #include <WiFiClient.h>


// // // Configuración para el broker OTA
// // const char* MQTT_FW_HOST = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
// // const int MQTT_FW_PORT = 8883;
// // const char* MQTT_FW_USER = "Augustodelcampo97";
// // const char* MQTT_FW_PASS = "Augustodelcampo97";

// // // Cliente MQTT seguro
// // WiFiClientSecure fwClient;
// // PubSubClient mqttClientFW(fwClient);
// // String globalDeviceMac;  // Para usar en el callback

// // void doOTA(const String& url) {
// //   Serial.println("[OTA] Iniciando descarga: " + url);
// //   HTTPClient http;
// //   http.begin(url);
// //   int httpCode = http.GET();
// //   if (httpCode == 200) {
// //     int contentLength = http.getSize();
// //     WiFiClient* stream = http.getStreamPtr();
// //     if (contentLength > 0 && Update.begin(contentLength)) {
// //       size_t written = Update.writeStream(*stream);
// //       if (written == contentLength && Update.end(true)) {
// //         Serial.println("[OTA] Actualización exitosa. Reiniciando...");
// //         ESP.restart();
// //       } else {
// //         Serial.println("[OTA] Error al finalizar la actualización.");
// //       }
// //     } else {
// //       Serial.println("[OTA] No se pudo iniciar la actualización.");
// //     }
// //   } else {
// //     Serial.printf("[OTA] Error HTTP code: %d\n", httpCode);
// //   }
// //   http.end();
// // }

// // void mqttCallbackFW(char* topic, byte* payload, unsigned int length) {
// //   String msg;
// //   for (unsigned int i = 0; i < length; i++) {
// //     msg += (char)payload[i];
// //   }
// //   // Se espera el formato: "<MAC>|<URL>" o "all|<URL>"
// //   int sepIndex = msg.indexOf('|');
// //   if (sepIndex < 0) return;
// //   String targetId = msg.substring(0, sepIndex);
// //   String firmwareUrl = msg.substring(sepIndex + 1);
// //   // Ejecuta OTA si el mensaje es para este dispositivo o para todos
// //   if ((targetId == globalDeviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
// //     Serial.println("[OTA] Comando recibido para actualizar firmware.");
// //     doOTA(firmwareUrl);
// //   }
// // }

// // void connectMQTTFW(const String& deviceMac) {
// //   globalDeviceMac = deviceMac;
// //   String willTopic = "esp32/status";
// //   String willMessage = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"offline\"}";
// //   String clientId = "ESP32-FW-" + deviceMac;
// //   fwClient.setInsecure();  // Para demo; en producción se debe validar el certificado
// //   mqttClientFW.setServer(MQTT_FW_HOST, MQTT_FW_PORT);
// //   mqttClientFW.setCallback(mqttCallbackFW);
  
// //   while (!mqttClientFW.connected()) {
// //     Serial.println("Conectando a MQTT (firmware)...");
// //     if (mqttClientFW.connect(clientId.c_str(), MQTT_FW_USER, MQTT_FW_PASS,
// //                              willTopic.c_str(), 0, false, willMessage.c_str())) {
// //       Serial.println("MQTT (firmware) conectado!");
// //       String onlineMsg = String("{\"mac\":\"") + deviceMac + "\",\"status\":\"online\"}";
// //       mqttClientFW.publish("esp32/status", onlineMsg.c_str(), false);
// //       mqttClientFW.subscribe("esp32/update");
// //     } else {
// //       Serial.print("Error MQTT (firmware): ");
// //       Serial.println(mqttClientFW.state());
// //       delay(2000);
// //     }
// //   }
// // }

// // void otaLoop() {
// //   mqttClientFW.loop();
// // }
