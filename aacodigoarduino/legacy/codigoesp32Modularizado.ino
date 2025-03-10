#include <WiFi.h> // Librería para Wi-Fi.
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "DHT.h" // Librería para el sensor de humedad y temperatura.

#define WIFI_SSID "Auditorio Nodo" // Nombre de la red Wi-Fi.
#define WIFI_PASSWORD "auditorio.nodo" // Contraseña del Wi-Fi.

#define DHTPIN 23 // Pin del sensor de humedad y temperatura.
#define DHTTYPE DHT11 // Tipo de sensor de humedad y temperatura.

DHT dht(DHTPIN, DHTTYPE); // Inicialización del sensor DHT.

unsigned long lastSendTime = 0;     // Tiempo del último envío.
const unsigned long interval = 1800000; // Intervalo de 30 minutos (30 * 60 * 1000 ms).

// Variables globales
String puntoCardinal = ""; // Dirección del viento.
int acumuladorVueltas = 0; // Velocidad del viento.
float acumuladorMmCaidos = 0; // Lluvia acumulada en mm.

void conectarWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConexión establecida con IP: " + WiFi.localIP().toString());
}

float leerPluviometro() {
  int lecturaPluv = analogRead(36);
  float factorMM = 3.4; // Factor de conversión.
  static int contadorEstadoA = 0, contadorEstadoB = 0, contadorCiclos = 0;

  if (lecturaPluv < 600) {
    contadorEstadoB = 0;
    if (contadorEstadoA == 0) {
      contadorCiclos++;
      acumuladorMmCaidos = (contadorCiclos - 1) * factorMM;
    }
    contadorEstadoA++;
  } else {
    contadorEstadoA = 0;
    if (contadorEstadoB == 0) {
      contadorCiclos++;
      acumuladorMmCaidos = (contadorCiclos - 1) * factorMM;
    }
    contadorEstadoB++;
  }

  return acumuladorMmCaidos;
}

float leerAnemometro() {
  int lecturaAnemo = analogRead(39);
  static int promedioAnemo = 0, vueltas = 0, contadorEstado = 0, tiempo = 0;

  promedioAnemo += lecturaAnemo;

  if (lecturaAnemo > 600) {
    if (contadorEstado == 0) {
      vueltas++;
    }
    contadorEstado++;
  } else {
    contadorEstado = 0;
  }

  tiempo += 10; // Incrementa el tiempo en cada iteración.

  if (tiempo >= 10000) { // Cada 10 segundos calcula la velocidad.
    promedioAnemo /= 1000;
    acumuladorVueltas = (promedioAnemo > 520) ? 0 : vueltas;
    promedioAnemo = 0;
    vueltas = 0;
    tiempo = 0;
  }

  return acumuladorVueltas;
}

String leerVeleta() {
  // Código original de la veleta. (Refactorizar aquí si es necesario)
  return puntoCardinal;
}

void enviarDatos(float temperatura, float humedad, String direccionViento, float velocidadViento, float lluvia) {
  HTTPClient http;
  JSONVar jsonData;

  // Formato JSON de los datos.
  jsonData["board"] = "esp32_01";
  jsonData["temperature"] = String(temperatura);
  jsonData["humidity"] = String(humedad);
  jsonData["veleta"] = direccionViento;
  jsonData["anemometro"] = String(velocidadViento);
  jsonData["pluviometro"] = String(lluvia);

  String postData = JSON.stringify(jsonData);

  Serial.println("\nEnviando datos al servidor...");
  Serial.println(postData);

  // Configuración de la solicitud HTTP.
  http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(postData); // Enviar los datos.
  String payload = http.getString();

  // Mostrar respuesta del servidor.
  Serial.print("HTTP Code: ");
  Serial.println(httpCode);
  Serial.print("Respuesta: ");
  Serial.println(payload);

  http.end(); // Finalizar la conexión.
}

void setup() {
  Serial.begin(9600);
  conectarWiFi();
  dht.begin();
  analogReadResolution(10); // Configurar la resolución de lectura analógica.
}

void loop() {
  // Verificar si ha transcurrido el intervalo de 30 minutos.
  if (millis() - lastSendTime >= interval) {
    lastSendTime = millis(); // Actualizar el tiempo del último envío.

    // Leer sensores.
    float temperatura = dht.readTemperature();
    float humedad = dht.readHumidity();
    float lluvia = leerPluviometro();
    float velocidadViento = leerAnemometro();
    String direccionViento = leerVeleta();

    // Mostrar datos en el monitor serial.
    Serial.println("=== Datos de la estación meteorológica ===");
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println("°C");

    Serial.print("Humedad: ");
    Serial.print(humedad);
    Serial.println("%");

    Serial.print("Velocidad del viento: ");
    Serial.println(velocidadViento);

    Serial.print("Dirección del viento: ");
    Serial.println(direccionViento);

    Serial.print("Lluvia acumulada: ");
    Serial.print(lluvia);
    Serial.println(" mm");

    // Enviar datos al servidor.
    enviarDatos(temperatura, humedad, direccionViento, velocidadViento, lluvia);

    Serial.println("-----------------------------------------");
  }

  delay(100); // Reducir el uso del CPU.
}