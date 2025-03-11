#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>
#include <EEPROM.h>
#include <Arduino_JSON.h>
#include "DHT.h"

// Configuración EEPROM
#define EEPROM_SIZE 10

// Configuración del WiFi
#define WIFI_SSID "Tplink4568"
#define WIFI_PASSWORD "delc@mpo4268"

// Configuración del servidor OTA
const char* serverUrl = "https://servidor-esp32.onrender.com:3000/update";
String currentVersion = "1.0.4";

// Configuración del sensor DHT
#define DHTPIN 23
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Variables de sensores
String puntoCardinal = "";
int lecturaAnemo, vueltasAnemo = 0, tiempoAnemo = 0, acumuladorVueltas = 0, promedioAnemo = 0;
int lecturaPluv = 0, contadorCiclosPluv = 0;
float acumuladorMmCaidos = 0;
const unsigned long INTERVALO_ENVIO = 300000;
unsigned long ultimoEnvio = 0;

void conectarWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConectado!");
}

void loadVersionFromEEPROM() {
  char storedVersion[EEPROM_SIZE];
  for (int i = 0; i < EEPROM_SIZE; i++) storedVersion[i] = EEPROM.read(i);
  currentVersion = String(storedVersion);
  Serial.println("Versión almacenada: " + currentVersion);
}

void saveVersionToEEPROM(String newVersion) {
  for (int i = 0; i < EEPROM_SIZE; i++) EEPROM.write(i, i < newVersion.length() ? newVersion[i] : 0);
  EEPROM.commit();
}

void checkForUpdate() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  JSONVar request;
  request["currentVersion"] = currentVersion;
  String jsonString = JSON.stringify(request);
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode == 200) {
    String response = http.getString();
    JSONVar jsonResponse = JSON.parse(response);
    String newVersion = (const char*)jsonResponse["version"];
    String firmwareUrl = (const char*)jsonResponse["firmware"];

    if (newVersion != currentVersion) {
      Serial.println("Nueva versión detectada! Actualizando a " + newVersion);
      updateFirmware(firmwareUrl, newVersion);
    }
  }
  http.end();
}

void updateFirmware(String firmwareUrl, String newVersion) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(firmwareUrl);
  int httpCode = http.GET();
  if (httpCode == 200) {
    int contentLength = http.getSize();
    WiFiClient* stream = http.getStreamPtr();
    if (contentLength > 0 && Update.begin(contentLength)) {
      size_t written = Update.writeStream(*stream);
      if (written == contentLength && Update.end()) {
        saveVersionToEEPROM(newVersion);
        Serial.println("Actualización completada. Reiniciando...");
        ESP.restart();
      }
    }
  }
  http.end();
}

float pluviometro() {
  lecturaPluv = analogRead(36);
  float factorMM = 0.277;
  if (lecturaPluv < 600) contadorCiclosPluv++;
  acumuladorMmCaidos = (contadorCiclosPluv - 1) * factorMM;
  return acumuladorMmCaidos;
}

float anemometroV2() {
  lecturaAnemo = analogRead(39);
  if (lecturaAnemo > 600) vueltasAnemo++;
  tiempoAnemo += 10;
  if (tiempoAnemo >= 10000) {
    acumuladorVueltas = vueltasAnemo;
    vueltasAnemo = 0;
    tiempoAnemo = 0;
  }
  return acumuladorVueltas;
}

void tareaSensores(void* parameter) {
  for (;;) {
    pluviometro();
    anemometroV2();
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void tareaEnvio(void* parameter) {
  for (;;) {
    if (millis() - ultimoEnvio >= INTERVALO_ENVIO) {
      ultimoEnvio = millis();
      float humedad = dht.readHumidity();
      float temperatura = dht.readTemperature();

      Serial.printf("Temp: %.2f°C, Humedad: %.2f%%, Viento: %.2f, Lluvia: %.2f\n",
                    temperatura, humedad, anemometroV2(), pluviometro());

      HTTPClient http;
      http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
      http.addHeader("Content-Type", "application/json");
      JSONVar jsonData;
      jsonData["board"] = "esp32_01";
      jsonData["temperature"] = String(temperatura);
      jsonData["humidity"] = String(humedad);
      jsonData["anemometro"] = String(anemometroV2());
      jsonData["pluviometro"] = String(pluviometro());
      String postData = JSON.stringify(jsonData);
      http.POST(postData);
      http.end();
    }
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);
  loadVersionFromEEPROM();
  conectarWiFi();
  dht.begin();
  delay(2000);

  Serial.println("Versión actual del firmwaree: " + currentVersion);

  xTaskCreatePinnedToCore(tareaSensores, "TareaSensores", 10000, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(tareaEnvio, "TareaEnvio", 10000, NULL, 1, NULL, 0);
  checkForUpdate();
}

void loop() {
  delay(30000);
  checkForUpdate();
}
