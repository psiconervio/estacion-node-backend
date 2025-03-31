#ifndef WIFI_MODULE_H
#define WIFI_MODULE_H

struct WiFiNetwork {
  const char* ssid;
  const char* password;
};

/// Conecta a la primera red disponible de la lista
void connectWiFi(WiFiNetwork networks[], int count);

#endif
