#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>

const char* ssid = "Tplink4568";
const char* password = "delc@mpo4268";

const String currentVersion = "1.0.1";  // Cambia esto cada vez que subas un nuevo firmware
const char* serverUrl = "https://servidor-esp32.onrender.com:3000";  // Reemplaza con tu servidor

void setup() {
    Serial.begin(115200);
    Serial.println("Inicio del ESP32...");
    Serial.println("Versión actual del firmware: " + currentVersion);

    // Conectar a WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConectado al WiFi.");

    checkForUpdate();
}

void checkForUpdate() {
    Serial.println("Verificando actualización...");
    HTTPClient http;
    http.begin(String(serverUrl) + "/firmware/version");
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        Serial.println("Respuesta del servidor: " + payload);
        
        // Extraer la versión
        String serverVersion = payload.substring(payload.indexOf(":") + 2, payload.indexOf("}") - 1);

        if (serverVersion != currentVersion) {
            Serial.println("Nueva versión disponible: " + serverVersion);
            downloadAndUpdate();
        } else {
            Serial.println("Ya tienes la última versión.");
        }
    } else {
        Serial.println("Error al obtener la versión.");
    }
    http.end();
}

void downloadAndUpdate() {
    Serial.println("Descargando firmware...");
    HTTPClient http;
    http.begin(String(serverUrl) + "/firmware/latest");
    int httpCode = http.GET();

    if (httpCode == 200) {
        int contentLength = http.getSize();
        bool canBegin = Update.begin(contentLength);

        if (canBegin) {
            WiFiClient* stream = http.getStreamPtr();
            size_t written = Update.writeStream(*stream);

            if (written == contentLength) {
                Serial.println("Firmware descargado correctamente.");
                if (Update.end(true)) {
                    Serial.println("Actualización completa. Reiniciando...");
                    ESP.restart();
                } else {
                    Serial.println("Error en la actualización.");
                }
            }
        } else {
            Serial.println("No se pudo iniciar la actualización.");
        }
    } else {
        Serial.println("Error al descargar el firmware.");
    }
    http.end();
}

void loop() {
    delay(60000);  // Verifica cada minuto
}
