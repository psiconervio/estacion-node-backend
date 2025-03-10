#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>
#include "esp_ota_ops.h"

// 🔹 Configuración WiFi
const char* ssid = "PB02";
const char* password = "12345678";

// 🔹 URL del firmware nuevo
const char* firmware_url = "https://servidor-esp32.onrender.com/firmware.bin";

// Tiempo máximo para confirmar el firmware nuevo (30 seg)
#define ROLLBACK_TIMEOUT 30000

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Conectando a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a WiFi");

  // 🔹 Si el firmware nuevo no se confirmó, vuelve al anterior
  checkRollback();

  // 🔹 Intentar actualizar OTA
  updateFirmware();
}

void updateFirmware() {
  Serial.println("🔄 Descargando firmware...");
  HTTPClient http;
  http.begin(firmware_url);

  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    Serial.println("✅ Descargando y actualizando...");
    
    int contentLength = http.getSize();
    WiFiClient* stream = http.getStreamPtr();

    if (!Update.begin(contentLength)) {
      Serial.println("❌ Error al iniciar la actualización");
      return;
    }

    size_t written = Update.writeStream(*stream);
    if (written == contentLength) {
      Serial.println("✅ Actualización exitosa, marcando como pendiente...");
      Update.end(true);

      // 🔹 Marcar firmware como "pendiente" hasta confirmarlo
      esp_ota_mark_app_invalid();

      // Reiniciar para probar el nuevo firmware
      Serial.println("🔄 Reiniciando con el nuevo firmware...");
      delay(1000);
      ESP.restart();
    } else {
      Serial.println("❌ Falló la actualización, manteniendo el firmware anterior.");
    }
  } else {
    Serial.println("❌ No se pudo descargar el firmware");
  }

  http.end();
}

// 🔄 **Verificar si se debe hacer rollback**
void checkRollback() {
  esp_ota_img_states_t ota_state;
  esp_err_t err = esp_ota_get_state_partition(esp_ota_get_running_partition(), &ota_state);

  if (err == ESP_OK && ota_state == ESP_OTA_IMG_PENDING_VERIFY) {
    Serial.println("⚠️ Firmware NO confirmado, esperando 30s...");
    delay(ROLLBACK_TIMEOUT);

    // 🔹 Si no se confirmó en 30s, volver al firmware anterior
    Serial.println("⏪ Rollback automático al firmware anterior...");
    esp_ota_mark_app_invalid();
    ESP.restart();
  } else {
    Serial.println("✅ Firmware confirmado, ejecutándose normalmente.");
  }
}

void loop() {
  delay(1000);
}
