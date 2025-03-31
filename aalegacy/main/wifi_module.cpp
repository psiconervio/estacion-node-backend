#include <WiFi.h>
#include "wifi_module.h"

void connectWiFi(WiFiNetwork networks[], int count) {
  int networkIndex = 0;
  bool connected = false;
  while (!connected && networkIndex < count) {
    Serial.print("Conectando a WiFi: ");
    Serial.println(networks[networkIndex].ssid);
    WiFi.begin(networks[networkIndex].ssid, networks[networkIndex].password);
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 20) {
      delay(500);
      Serial.print(".");
      retries++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      connected = true;
      Serial.println("\nWiFi conectado.");
      Serial.print("IP: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("\nFallo al conectar a: " + String(networks[networkIndex].ssid));
      networkIndex++;
    }
  }
  if (!connected) {
    Serial.println("No se pudo conectar a ninguna red WiFi. Reiniciando...");
    ESP.restart();
  }
}
