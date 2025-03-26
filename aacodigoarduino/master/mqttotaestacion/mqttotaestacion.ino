#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <Update.h>
#include <Arduino_JSON.h>
#include "DHT.h"

// =====================
// CONFIGURACIONES
// =====================
#define FIRMWARE_VERSION "1.0.0"
#define DEVICE_NAME      "NODO"

// Credenciales WiFi (utilizadas para MQTT y envío de datos)
const char* WIFI_SSID     = "Auditorio Nodo";
const char* WIFI_PASSWORD = "auditorio.nodo";

// Broker MQTT (ej. HiveMQ Cloud)
const char* MQTT_HOST     = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
const int   MQTT_PORT     = 8883;
const char* MQTT_USER     = "Augustodelcampo97";
const char* MQTT_PASS     = "Augustodelcampo97";

// =====================
// VARIABLES GLOBALES
// =====================
WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

String deviceMac;
String deviceName = DEVICE_NAME;

unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 60000; // 60 seg

// =====================
// CONFIGURACIÓN DEL SENSOR DHT
// =====================
#define DHTPIN 23
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// =====================
// VARIABLES PARA ANEMÓMETRO Y PLUVIÓMETRO
// ---------------------
// Anemómetro
int lecturaAnemo = 0, vueltasAnemo = 0, contadorEstadoAnemoA = 0, tiempoAnemo = 0, acumuladorVueltas = 0, promedioAnemo = 0;
// Pluviometro
int lecturaPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0;
float acumuladorMmCaidos = 0;

// Intervalo de envío de datos (5 minutos)
const unsigned long INTERVALO_ENVIO = 300000;
unsigned long ultimoEnvio = 0;

TaskHandle_t tareaEnvioHandle = NULL;

// =====================
// FUNCIONES OTA (vía HTTP descargada mediante orden MQTT)
// =====================
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
        Serial.println("[OTA] Error al finalizar actualización.");
      }
    } else {
      Serial.println("[OTA] No se pudo iniciar la actualización.");
    }
  } else {
    Serial.printf("[OTA] Error HTTP code: %d\n", httpCode);
  }
  http.end();
}

// =====================
// CALLBACK MQTT
// =====================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  // Formato esperado: "<MAC>|<URL>" o "all|<URL>"
  int sepIndex = msg.indexOf('|');
  if (sepIndex < 0) return;
  
  String targetId = msg.substring(0, sepIndex);
  String firmwareUrl = msg.substring(sepIndex + 1);
  
  if ((targetId == deviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
    doOTA(firmwareUrl);
  }
}

// =====================
// CONEXIÓN WIFI
// =====================
void connectWiFi() {
  Serial.print("Conectando a WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado.");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nNo se pudo conectar. Reiniciando...");
    ESP.restart();
  }
}

// =====================
// CONEXIÓN MQTT
// =====================
void connectMQTT() {
  // LWT: publicará {"mac":"xx","name":"xx","status":"offline"} al desconectarse
  String willTopic = "esp32/status";
  String willMessage = String("{\"mac\":\"") + deviceMac +
                       "\",\"name\":\"" + deviceName +
                       "\",\"status\":\"offline\"}";
  // Client ID
  String clientId = "ESP32-" + deviceMac;
  while (!mqttClient.connected()) {
    Serial.println("Conectando a MQTT...");
    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS,
                           willTopic.c_str(), 0, false, willMessage.c_str())) {
      Serial.println("MQTT conectado!");
      // Publicar estado "online"
      String onlineMsg = String("{\"mac\":\"") + deviceMac +
                         "\",\"name\":\"" + deviceName +
                         "\",\"status\":\"online\",\"version\":\"" + FIRMWARE_VERSION + "\"}";
      mqttClient.publish("esp32/status", onlineMsg.c_str(), false);
      // Suscribirse al tópico de OTA
      mqttClient.subscribe("esp32/update");
    } else {
      Serial.print("Error MQTT: ");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }
}

// =====================
// FUNCIONES DE LOS SENSORES
// =====================

// Pluviometro: lectura en pin 36
float pluviometro() {
  lecturaPluv = analogRead(36);
  float factorMM = 0.277;
  if (lecturaPluv < 600) {
    contadorEstadoPluviometroB = 0;
    if (contadorEstadoPluviometroA == 0) {
      acumuladorMmCaidos += factorMM;
    }
    contadorEstadoPluviometroA++;
  } else {
    contadorEstadoPluviometroA = 0;
    if (contadorEstadoPluviometroB == 0) {
      acumuladorMmCaidos += factorMM;
    }
    contadorEstadoPluviometroB++;
  }
  return acumuladorMmCaidos;
}

// Anemómetro: lectura en pin 39
float anemometroV2() {
  lecturaAnemo = analogRead(39);
  promedioAnemo += lecturaAnemo;
  if (lecturaAnemo > 600) {
    if (contadorEstadoAnemoA == 0) {
      vueltasAnemo++;
    }
    contadorEstadoAnemoA++;
  } else {
    contadorEstadoAnemoA = 0;
  }
  
  tiempoAnemo += 10;
  if (tiempoAnemo >= 10000) {
    promedioAnemo /= 1000;
    if (promedioAnemo > 520) {
      acumuladorVueltas = 0;
    } else {
      acumuladorVueltas = vueltasAnemo;
    }
    promedioAnemo = 0;
    vueltasAnemo = 0;
    tiempoAnemo = 0;
  }
  return acumuladorVueltas;
}

// Tarea que lee continuamente los sensores (pluviometro y anemómetro)
void tareaSensores(void * parameter) {
  for (;;) {
    pluviometro();
    anemometroV2();
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

// Tarea encargada de enviar los datos de sensores vía HTTP
void tareaEnvio(void * parameter) {
  for (;;) {
    unsigned long tiempoActual = millis();
    if (tiempoActual - ultimoEnvio >= INTERVALO_ENVIO) {
      ultimoEnvio = tiempoActual;
      
      // Verificar conexión WiFi
      if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
      }

      float humedad = dht.readHumidity();
      float temperatura = dht.readTemperature();

      Serial.print("Temperatura: ");
      Serial.print(temperatura);
      Serial.println("°C");
      
      Serial.print("Humedad: ");
      Serial.print(humedad);
      Serial.println("%");

      Serial.print("Velocidad del viento (vueltas): ");
      Serial.println(acumuladorVueltas);

      Serial.print("mm de lluvia caída: ");
      Serial.println(acumuladorMmCaidos);

      HTTPClient http;
      http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
      http.addHeader("Content-Type", "application/json");

      JSONVar jsonData;
      jsonData["mac"] = deviceMac;  // Se envía la MAC correctamente
      jsonData["board"] = "esp32_01";
      jsonData["temperature"] = String(temperatura);
      jsonData["humidity"] = String(humedad);
      jsonData["anemometro"] = String(acumuladorVueltas);
      jsonData["pluviometro"] = String(acumuladorMmCaidos);

      String postData = JSON.stringify(jsonData);
      int httpCode = http.POST(postData);

      Serial.print("httpCode: ");
      Serial.println(httpCode);
      Serial.println("--------------");

      http.end();
      // Reiniciar acumulador de lluvia después del envío
      acumuladorMmCaidos = 0;
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

// =====================
// SETUP Y LOOP
// =====================
void setup() {
  Serial.begin(115200);
  delay(1000);

  // Conectar a WiFi
  connectWiFi();
  
  // Obtener la MAC del dispositivo
  deviceMac = WiFi.macAddress();
  Serial.print("MAC: ");
  Serial.println(deviceMac);
  
  // Configurar MQTT
  espClient.setInsecure();  // Para demo (en producción, valida el certificado raíz)
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  connectMQTT();
  
  // Inicializar el sensor DHT
  dht.begin();
  
  // Configurar la resolución de las lecturas analógicas
  analogReadResolution(10);
  
  // Crear tarea para lectura continua de sensores en core 1
  xTaskCreatePinnedToCore(tareaSensores, "TareaSensores", 10000, NULL, 1, NULL, 1);
  // Crear tarea para envío de datos en core 0
  xTaskCreatePinnedToCore(tareaEnvio, "TareaEnvio", 10000, NULL, 1, &tareaEnvioHandle, 0);
}

void loop() {
  mqttClient.loop();

  // Reconectar WiFi y MQTT si se pierde la conexión
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    connectMQTT();
  }
  
  // Enviar heartbeat MQTT cada HEARTBEAT_INTERVAL
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    String hbMsg = String("{\"mac\":\"") + deviceMac +
                   "\",\"name\":\"" + deviceName +
                   "\",\"uptime\":" + millis() + "}";
    mqttClient.publish("esp32/heartbeat", hbMsg.c_str(), false);
  }
  
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}

// #include <WiFi.h>
// #include <WiFiClientSecure.h>
// #include <PubSubClient.h>
// #include <HTTPClient.h>
// #include <Update.h>
// #include <Arduino_JSON.h>
// #include "DHT.h"

// // =====================
// // CONFIGURACIONES
// // =====================
// #define FIRMWARE_VERSION "1.0.0"
// #define DEVICE_NAME      "NODO"

// // Credenciales WiFi (utilizadas para MQTT y envío de datos)
// const char* WIFI_SSID     = "Auditorio Nodo";
// const char* WIFI_PASSWORD = "auditorio.nodo";

// // Broker MQTT (ej. HiveMQ Cloud)
// const char* MQTT_HOST     = "ad11f935a9c74146a4d2e647921bf024.s1.eu.hivemq.cloud";
// const int   MQTT_PORT     = 8883;
// const char* MQTT_USER     = "Augustodelcampo97";
// const char* MQTT_PASS     = "Augustodelcampo97";

// // =====================
// // VARIABLES GLOBALES
// // =====================
// WiFiClientSecure espClient;
// PubSubClient mqttClient(espClient);

// String deviceMac;
// String deviceName = DEVICE_NAME;

// unsigned long lastHeartbeat = 0;
// const unsigned long HEARTBEAT_INTERVAL = 60000; // 60 seg

// // =====================
// // CONFIGURACIÓN DEL SENSOR DHT
// // =====================
// #define DHTPIN 23
// #define DHTTYPE DHT11
// DHT dht(DHTPIN, DHTTYPE);

// // =====================
// // VARIABLES PARA ANEMÓMETRO Y PLUVIÓMETRO
// // ---------------------
// // Anemómetro
// int lecturaAnemo = 0, vueltasAnemo = 0, contadorEstadoAnemoA = 0, tiempoAnemo = 0, acumuladorVueltas = 0, promedioAnemo = 0;
// // Pluviometro
// int lecturaPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0;
// float acumuladorMmCaidos = 0;

// // Intervalo de envío de datos (5 minutos)
// const unsigned long INTERVALO_ENVIO = 300000;
// unsigned long ultimoEnvio = 0;

// TaskHandle_t tareaEnvioHandle = NULL;

// // =====================
// // FUNCIONES OTA (vía HTTP descargada mediante orden MQTT)
// // =====================
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
//         Serial.println("[OTA] Error al finalizar actualización.");
//       }
//     } else {
//       Serial.println("[OTA] No se pudo iniciar la actualización.");
//     }
//   } else {
//     Serial.printf("[OTA] Error HTTP code: %d\n", httpCode);
//   }
//   http.end();
// }

// // =====================
// // CALLBACK MQTT
// // =====================
// void mqttCallback(char* topic, byte* payload, unsigned int length) {
//   String msg;
//   for (unsigned int i = 0; i < length; i++) {
//     msg += (char)payload[i];
//   }
//   // Formato esperado: "<MAC>|<URL>" o "all|<URL>"
//   int sepIndex = msg.indexOf('|');
//   if (sepIndex < 0) return;
  
//   String targetId = msg.substring(0, sepIndex);
//   String firmwareUrl = msg.substring(sepIndex + 1);
  
//   if ((targetId == deviceMac || targetId == "all") && firmwareUrl.startsWith("http")) {
//     doOTA(firmwareUrl);
//   }
// }

// // =====================
// // CONEXIÓN WIFI
// // =====================
// void connectWiFi() {
//   Serial.print("Conectando a WiFi...");
//   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//   int retries = 0;
//   while (WiFi.status() != WL_CONNECTED && retries < 20) {
//     delay(500);
//     Serial.print(".");
//     retries++;
//   }
//   if (WiFi.status() == WL_CONNECTED) {
//     Serial.println("\nWiFi conectado.");
//     Serial.print("IP: ");
//     Serial.println(WiFi.localIP());
//   } else {
//     Serial.println("\nNo se pudo conectar. Reiniciando...");
//     ESP.restart();
//   }
// }

// // =====================
// // CONEXIÓN MQTT
// // =====================
// void connectMQTT() {
//   // LWT: publicará {"mac":"xx","name":"xx","status":"offline"} al desconectarse
//   String willTopic = "esp32/status";
//   String willMessage = String("{\"mac\":\"") + deviceMac +
//                        "\",\"name\":\"" + deviceName +
//                        "\",\"status\":\"offline\"}";
//   // Client ID
//   String clientId = "ESP32-" + deviceMac;
//   while (!mqttClient.connected()) {
//     Serial.println("Conectando a MQTT...");
//     if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS,
//                            willTopic.c_str(), 0, false, willMessage.c_str())) {
//       Serial.println("MQTT conectado!");
//       // Publicar estado "online"
//       String onlineMsg = String("{\"mac\":\"") + deviceMac +
//                          "\",\"name\":\"" + deviceName +
//                          "\",\"status\":\"online\",\"version\":\"" + FIRMWARE_VERSION + "\"}";
//       mqttClient.publish("esp32/status", onlineMsg.c_str(), false);
//       // Suscribirse al tópico de OTA
//       mqttClient.subscribe("esp32/update");
//     } else {
//       Serial.print("Error MQTT: ");
//       Serial.println(mqttClient.state());
//       delay(2000);
//     }
//   }
// }

// // =====================
// // FUNCIONES DE LOS SENSORES
// // =====================

// // Pluviometro: lectura en pin 36
// float pluviometro() {
//   lecturaPluv = analogRead(36);
//   float factorMM = 0.277;
//   if (lecturaPluv < 600) {
//     contadorEstadoPluviometroB = 0;
//     if (contadorEstadoPluviometroA == 0) {
//       acumuladorMmCaidos += factorMM;
//     }
//     contadorEstadoPluviometroA++;
//   } else {
//     contadorEstadoPluviometroA = 0;
//     if (contadorEstadoPluviometroB == 0) {
//       acumuladorMmCaidos += factorMM;
//     }
//     contadorEstadoPluviometroB++;
//   }
//   return acumuladorMmCaidos;
// }

// // Anemómetro: lectura en pin 39
// float anemometroV2() {
//   lecturaAnemo = analogRead(39);
//   promedioAnemo += lecturaAnemo;
//   if (lecturaAnemo > 600) {
//     if (contadorEstadoAnemoA == 0) {
//       vueltasAnemo++;
//     }
//     contadorEstadoAnemoA++;
//   } else {
//     contadorEstadoAnemoA = 0;
//   }
  
//   tiempoAnemo += 10;
//   if (tiempoAnemo >= 10000) {
//     promedioAnemo /= 1000;
//     if (promedioAnemo > 520) {
//       acumuladorVueltas = 0;
//     } else {
//       acumuladorVueltas = vueltasAnemo;
//     }
//     promedioAnemo = 0;
//     vueltasAnemo = 0;
//     tiempoAnemo = 0;
//   }
//   return acumuladorVueltas;
// }

// // Tarea que lee continuamente los sensores (pluviometro y anemómetro)
// void tareaSensores(void * parameter) {
//   for (;;) {
//     pluviometro();
//     anemometroV2();
//     vTaskDelay(10 / portTICK_PERIOD_MS);
//   }
// }

// // Tarea encargada de enviar los datos de sensores vía HTTP
// void tareaEnvio(void * parameter) {
//   for (;;) {
//     unsigned long tiempoActual = millis();
//     if (tiempoActual - ultimoEnvio >= INTERVALO_ENVIO) {
//       ultimoEnvio = tiempoActual;
      
//       // Verificar conexión WiFi
//       if (WiFi.status() != WL_CONNECTED) {
//         connectWiFi();
//       }

//       float humedad = dht.readHumidity();
//       float temperatura = dht.readTemperature();

//       Serial.print("Temperatura: ");
//       Serial.print(temperatura);
//       Serial.println("°C");
      
//       Serial.print("Humedad: ");
//       Serial.print(humedad);
//       Serial.println("%");

//       Serial.print("Velocidad del viento (vueltas): ");
//       Serial.println(acumuladorVueltas);

//       Serial.print("mm de lluvia caída: ");
//       Serial.println(acumuladorMmCaidos);

//       HTTPClient http;
//       http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
//       http.addHeader("Content-Type", "application/json");

//       JSONVar jsonData;
//       jsonData["mac"] = deviceMac;  // Se envía la MAC correctamente
//       jsonData["board"] = "esp32_01";
//       jsonData["temperature"] = String(temperatura);
//       jsonData["humidity"] = String(humedad);
//       jsonData["anemometro"] = String(acumuladorVueltas);
//       jsonData["pluviometro"] = String(acumuladorMmCaidos);

//       String postData = JSON.stringify(jsonData);
//       int httpCode = http.POST(postData);

//       Serial.print("httpCode: ");
//       Serial.println(httpCode);
//       Serial.println("--------------");

//       http.end();
//       // Reiniciar acumulador de lluvia después del envío
//       acumuladorMmCaidos = 0;
//     }
//     vTaskDelay(1000 / portTICK_PERIOD_MS);
//   }
// }

// // =====================
// // SETUP Y LOOP
// // =====================
// void setup() {
//   Serial.begin(115200);
//   delay(1000);

//   // Conectar a WiFi
//   connectWiFi();
  
//   // Obtener la MAC del dispositivo
//   deviceMac = WiFi.macAddress();
//   Serial.print("MAC: ");
//   Serial.println(deviceMac);
  
//   // Configurar MQTT
//   espClient.setInsecure();  // Para demo (en producción, valida el certificado raíz)
//   mqttClient.setServer(MQTT_HOST, MQTT_PORT);
//   mqttClient.setCallback(mqttCallback);
//   connectMQTT();
  
//   // Inicializar el sensor DHT
//   dht.begin();
  
//   // Configurar la resolución de las lecturas analógicas
//   analogReadResolution(10);
  
//   // Crear tarea para lectura continua de sensores en core 1
//   xTaskCreatePinnedToCore(tareaSensores, "TareaSensores", 10000, NULL, 1, NULL, 1);
//   // Crear tarea para envío de datos en core 0
//   xTaskCreatePinnedToCore(tareaEnvio, "TareaEnvio", 10000, NULL, 1, &tareaEnvioHandle, 0);
// }

// void loop() {
//   mqttClient.loop();

//   // Reconectar WiFi y MQTT si se pierde la conexión
//   if (WiFi.status() != WL_CONNECTED) {
//     connectWiFi();
//     connectMQTT();
//   }
  
//   // Enviar heartbeat MQTT cada HEARTBEAT_INTERVAL
//   if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
//     lastHeartbeat = millis();
//     String hbMsg = String("{\"mac\":\"") + deviceMac +
//                    "\",\"name\":\"" + deviceName +
//                    "\",\"uptime\":" + millis() + "}";
//     mqttClient.publish("esp32/heartbeat", hbMsg.c_str(), false);
//   }
  
//   vTaskDelay(1000 / portTICK_PERIOD_MS);
// }
