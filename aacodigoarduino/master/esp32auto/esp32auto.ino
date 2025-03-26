#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>  // Librería para OTA por HTTP

const char* ssid = "PB02"; // 🔹 Reemplaza con tu WiFi
const char* password = "12345678";

const char* firmware_url = "https://servidor-esp32.onrender.com/firmware.bin";  // 🔹 URL del firmware en tu servidor
const int check_interval = 60 * 1000;  // Chequea cada 60 segundos

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n🟢 Conectado a WiFi");
}

void loop() {
    checkForUpdates();
    delay(check_interval);  // Espera antes de volver a verificar
}

void checkForUpdates() {
    Serial.println("🔍 Buscando actualización...");

    HTTPClient http;
    http.begin(firmware_url);
    int httpCode = http.GET();
    
    if (httpCode == HTTP_CODE_OK) {
        Serial.println("📥 Descargando nueva versión...");
        updateFirmware(http);
    } else {
        Serial.printf("⚠️ No hay actualización disponible (Código: %d)\n", httpCode);
    }
    http.end();
}

void updateFirmware(HTTPClient& http) {
    int contentLength = http.getSize();
    bool canBegin = Update.begin(contentLength);

    if (canBegin) {
        WiFiClient* client = http.getStreamPtr();
        size_t written = Update.writeStream(*client);

        if (written == contentLength) {
            Serial.println("✅ Firmware descargado correctamente.");
        } else {
            Serial.println("❌ Error: No se descargó completamente.");
        }

        if (Update.end()) {
            Serial.println("🔄 Reiniciando para aplicar actualización...");
            ESP.restart();
        } else {
            Serial.println("⛔ Error al actualizar.");
        }
    } else {
        Serial.println("⚠️ No hay suficiente espacio para actualizar.");
    }
}