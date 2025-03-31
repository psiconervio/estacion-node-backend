#ifndef OTA_MODULE_H
#define OTA_MODULE_H

#include <Arduino.h>

/// Inicia la actualización OTA a partir de la URL proporcionada
void doOTA(const String& url);

/// Callback para procesar mensajes MQTT recibidos para OTA
void mqttCallbackFW(char* topic, byte* payload, unsigned int length);

/// Conecta al broker MQTT para gestionar OTA
void connectMQTTFW(const String& deviceMac);

/// Ejecuta el loop del cliente MQTT (para invocarlo en el loop() principal)
void otaLoop();

/// Función para enviar un heartbeat cada 60 segundos
void otaHeartbeat();

#endif

// #ifndef OTA_MODULE_H
// #define OTA_MODULE_H

// #include <Arduino.h>

// /// Inicia la actualización OTA a partir de la URL proporcionada
// void doOTA(const String& url);

// /// Callback para procesar mensajes MQTT recibidos para OTA
// void mqttCallbackFW(char* topic, byte* payload, unsigned int length);

// /// Conecta al broker MQTT para gestionar OTA
// void connectMQTTFW(const String& deviceMac);

// /// Ejecuta el loop del cliente MQTT (para invocarlo en el loop() principal)
// void otaLoop();

// /// Función para enviar un heartbeat cada 60 segundos
// void otaHeartbeat();

// #endif
