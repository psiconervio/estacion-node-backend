//Laboratorio de Innovación Social del Nodo Tecnológico de la Municipalidad de San Fernando del Valle de Catamarca.
//Proyecto: Estación Metereológica.
//Desarrolladores del código y hardware: Emmanuel Ludueña y Augusto Del Campo.
//Jefe de proyecto: Esteban Colombo.

//Director: Emilio Ramaci.

#include <WiFi.h> //Libreria para el wifi.
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "DHT.h" //Libreria para el sensor de humedad y temperatura.

#define WIFI_SSID "Auditorio Nodo" //Red de wifi.
#define WIFI_PASSWORD "auditorio.nodo" //Clave de wifi.

#define DHTPIN 23 //Pin del sensor de humedad y temperatura
#define DHTTYPE DHT11 //Tipo de Sensor de humedad y temperatura

DHT dht(DHTPIN, DHTTYPE); //Declaración del sensor de humedad y temperatura

String puntoCardinal = ""; //Variable de Dirección del Viento

int lecturaAnemo, vueltasAnemo = 0, contadorEstadoAnemoA = 0, tiempoAnemo = 0, acumuladorVueltas = 0, promedioAnemo; //Variables anemómetro

int lecturaPluv = 0, contadorCiclosPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0; //variables auxiliares del Pluviometro.
float acumuladorMmCaidos = 0; //acumulador de mm caidos detectados por el pluviometro.

// Nueva constante para el intervalo de envío de datos (en milisegundos)
// const unsigned long INTERVALO_ENVIO = 1200000; // 20 minutos
const unsigned long INTERVALO_ENVIO = 900000; // 15 minutos
unsigned long ultimoEnvio = 0; // Almacena el tiempo del último envío

// Conexión WiFi
void conectarWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Conectado con IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

// Variables para datos de solicitud HTTP POST
String postData = "";
String payload = "";

// Lectura del pluviómetro
float pluviometro() {
  lecturaPluv = analogRead(36);
  float factorMM = 3.4;
  if (lecturaPluv < 600) {
    contadorEstadoPluviometroB = 0;
    if (contadorEstadoPluviometroA == 0) {
      contadorCiclosPluv++;
      acumuladorMmCaidos = (contadorCiclosPluv - 1) * factorMM;
    }
    contadorEstadoPluviometroA++;
  } else {
    contadorEstadoPluviometroA = 0;
    if (contadorEstadoPluviometroB == 0) {
      contadorCiclosPluv++;
      acumuladorMmCaidos = (contadorCiclosPluv - 1) * factorMM;
    }
    contadorEstadoPluviometroB++;
  }
  return acumuladorMmCaidos;
}

// Lectura del anemómetro
float anemometroV2() {
  lecturaAnemo = analogRead(39);
  promedioAnemo = promedioAnemo + lecturaAnemo;
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
    promedioAnemo = promedioAnemo / 1000;
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

// Lectura de la veleta
String veleta() {
  float a = 0, b = 0, c = 0, d = 0, a0 = 476, b0 = 480, c0 = 472, d0 = 480, va = 0, vb = 0, vc = 0, vd = 0;
  int muestras = 64;
  for (int i = 0; i < muestras; i++) {
    a += analogRead(32);
  }
  a /= muestras;
  if (a > 4095) {
    a = 4095;
  }

  for (int i = 0; i < muestras; i++) {
    b += analogRead(35);
  }
  b /= muestras;
  if (b > 4095) {
    b = 4095;
  }

  for (int i = 0; i < muestras; i++) {
    c += analogRead(34);
  }
  c /= muestras;
  if (c > 4095) {
    c = 4095;
  }

  for (int i = 0; i < muestras; i++) {
    d += analogRead(33);
  }
  d /= muestras;
  if (d > 4095) {
    d = 4095;
  }

  va = ((a - a0) / a0) * 100;
  vb = ((b - b0) / b0) * 100;
  vc = ((c - c0) / c0) * 100;
  vd = ((d - d0) / d0) * 100;

  if (va > 0.2) {
    if (va > 30) {
      puntoCardinal = "NORTE";
    } else if (vb < -2.5) {
      puntoCardinal = "NORESTE";
    } else if (vd < -2) {
      puntoCardinal = "NOROESTE";
    }
  } else if (vb > 0.2) {
    if (vb > 30) {
      puntoCardinal = "ESTE";
    } else if (va < -2.3) {
      puntoCardinal = "NORESTE";
    } else if (vc < -2.5) {
      puntoCardinal = "SURESTE";
    }
  } else if (vc > 0.2) {
    if (vc > 30) {
      puntoCardinal = "SUR";
    } else if (vb < -2.3) {
      puntoCardinal = "SURESTE";
    } else if (vd < -2.6) {
      puntoCardinal = "SUROESTE";
    }
  } else if (vd > 0.2) {
    if (vd > 30) {
      puntoCardinal = "OESTE";
    } else if (va < -2.6) {
      puntoCardinal = "NOROESTE";
    } else if (vd < -2.5) {
      puntoCardinal = "SUROESTE";
    }
  } else if (va < -2 && vb < -2) {
    puntoCardinal = "NORESTE";
  } else if (vc < -2 && vb < -2) {
    puntoCardinal = "SURESTE";
  } else if (vc < -2 && vd < -2) {
    puntoCardinal = "SUROESTE";
  } else if (va < -2 && vd < -2) {
    puntoCardinal = "NOROESTE";
  }
  return puntoCardinal;
}

void setup() {
  Serial.begin(9600);
  conectarWiFi();
  analogReadResolution(10);
  dht.begin();
  delay(2000);
}

void loop() {
  // Cada 20 minutos se ejecuta el envío de datos
  unsigned long tiempoActual = millis();
  if (tiempoActual - ultimoEnvio >= INTERVALO_ENVIO) {
    ultimoEnvio = tiempoActual; // Actualizar el tiempo del último envío

    float humedad = dht.readHumidity();
    float temperatura = dht.readTemperature();

    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println("°C");

    Serial.print("Humedad: ");
    Serial.print(humedad);
    Serial.println("%");

    Serial.print("Velocidad del viento: ");
    Serial.print(acumuladorVueltas);
    Serial.print(" / analog: ");
    Serial.println(analogRead(39));

    Serial.print("Dirección del viento: ");
    Serial.println(veleta());

    Serial.print("mm de lluvia caída: ");
    Serial.println(pluviometro());

    HTTPClient http;
    http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
    http.addHeader("Content-Type", "application/json");

    // Crear datos en formato JSON
    JSONVar jsonData;
    jsonData["board"] = "esp32_01";
    jsonData["temperature"] = String(temperatura);
    jsonData["humidity"] = String(humedad);
    jsonData["veleta"] = String(veleta());
    jsonData["anemometro"] = String(anemometroV2());
    jsonData["pluviometro"] = String(pluviometro());

    String postData = JSON.stringify(jsonData);

    int httpCode = http.POST(postData);
    String payload = http.getString();

    Serial.print("httpCode: ");
    Serial.println(httpCode);
    Serial.print("payload: ");
    Serial.println(payload);

    http.end();
    Serial.println("--------------");
  }

  // Ejecutar las demás tareas (sensores, etc.)
  pluviometro();
  anemometroV2();
  delay(10);
}