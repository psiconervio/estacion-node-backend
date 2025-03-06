#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// Configuración del sensor DHT11
#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Configuración de WiFi
const char* ssid = "PB02";
const char* password = "12345678";
//Incrementar ultimo numero para agregar la estacion con el mismo numero (id) 
const char* serverUrl = "https://estacion-node-backend-1.onrender.com/api/weather/1";  // URL del endpoint

void setup() {
    Serial.begin(115200);
    dht.begin();
    
    Serial.println("Conectando a WiFi...");
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConectado a WiFi");
}

void loop() {
    float humedad = dht.readHumidity();
    float temperatura = dht.readTemperature();
    
    if (isnan(humedad) || isnan(temperatura)) {
        Serial.println("Error al leer el sensor DHT11");
    } else {
        Serial.print("Temperatura: ");
        Serial.print(temperatura);
        Serial.print("°C  |  Humedad: ");
        Serial.print(humedad);
        Serial.println("%");
        enviarDatos(temperatura, humedad);
    }
    
    delay(900000);  // Espera de 15 minutos (900,000 ms)
}

void enviarDatos(float temp, float hum) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        JSONVar json;
        json["temperatura"] = temp;
        json["humedad"] = hum;
        
        String jsonString = JSON.stringify(json);
        int httpResponseCode = http.POST(jsonString);
        
        if (httpResponseCode > 0) {
            Serial.print("Datos enviados con éxito. Código: ");
            Serial.println(httpResponseCode);
        } else {
            Serial.print("Error en el envío: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    } else {
        Serial.println("Error: No conectado a WiFi");
    }
}
