#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>

const char* ssid = "Tplink4568";
const char* password = "delc@mpo4268";
const char* firmware_url = "https://servidor-esp32.onrender.com/firmware.bin";  // Cambia por la URL real

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    Serial.print("Conectando a WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConectado a WiFi!");

    checkForUpdate();
}

void loop() {
    // El ESP32 no hace polling, solo actualizará cuando reciba el POST
    delay(10000);  
}

void checkForUpdate() {
    Serial.println("Buscando actualización...");
    HTTPClient http;
    http.begin(firmware_url);
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
        Serial.println("Nueva actualización disponible. Iniciando...");
        size_t contentLength = http.getSize();
        WiFiClient* stream = http.getStreamPtr();
        
        if (!Update.begin(contentLength)) {
            Serial.println("Error al iniciar la actualización");
            return;
        }

        size_t written = Update.writeStream(*stream);
        if (written == contentLength) {
            Serial.println("Actualización completada, reiniciando...");
            if (Update.end(true)) {
                ESP.restart();
            } else {
                Serial.println("Error al finalizar la actualización");
            }
        } else {
            Serial.println("Error en la escritura del firmware");
        }
    } else {
        Serial.println("No hay nuevas actualizaciones");
    }

    http.end();
}
