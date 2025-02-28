#include <Adafruit_Sensor.h>
#include <DHT.h>

// Definir el pin del DHT11
#define DHTPIN 15  // Cambia este número según el pin al que conectaste el sensor

// Definir el tipo de sensor DHT
#define DHTTYPE DHT11

// Crear objeto DHT
DHT dht(DHTPIN, DHTTYPE);

// Variables para almacenar los valores de temperatura y humedad
float temperatura = 0.0;
float humedad = 0.0;

void setup() {
    Serial.begin(115200);  // Iniciar comunicación serie
    dht.begin();           // Iniciar el sensor DHT11
    Serial.println("Sensor DHT11 inicializado");
}

void loop() {
    // Leer humedad y temperatura
    humedad = dht.readHumidity();
    temperatura = dht.readTemperature(); // En grados Celsius

    // Verificar si la lectura es válida
    if (isnan(humedad) || isnan(temperatura)) {
        Serial.println("Error al leer el sensor DHT11");
    } else {
        Serial.print("Temperatura: ");
        Serial.print(temperatura);
        Serial.print("°C  |  Humedad: ");
        Serial.print(humedad);
        Serial.println("%");
    }

    delay(2000);  // Esperar 2 segundos antes de la próxima lectura
}
