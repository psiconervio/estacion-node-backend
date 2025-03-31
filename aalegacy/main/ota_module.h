#ifndef OTA_MODULE_H
#define OTA_MODULE_H

#include <Arduino.h>

/// Inicia el proceso OTA a partir de la URL
void doOTA(const String& url);

/// Callback para mensajes MQTT del broker de firmware
void mqttCallbackFW(char* topic, byte* payload, unsigned int length);

/// Conecta al broker MQTT para actualizaciones OTA
void connectMQTTFW(const String& deviceMac);

/// Llama al loop del cliente MQTT (para invocarlo en el loop() principal)
void otaLoop();

#endif
