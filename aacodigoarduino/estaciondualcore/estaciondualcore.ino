#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "DHT.h"

// Configuración del WiFi
#define WIFI_SSID "PB02"
#define WIFI_PASSWORD "12345678"

// Configuración del sensor DHT
#define DHTPIN 23
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Variables para la veleta y anemómetro
String puntoCardinal = "";
int lecturaAnemo, vueltasAnemo = 0, contadorEstadoAnemoA = 0, tiempoAnemo = 0, acumuladorVueltas = 0, promedioAnemo = 0;

// Variables para el pluviometro
int lecturaPluv = 0, contadorCiclosPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0;
float acumuladorMmCaidos = 0;

// Intervalo de envío de datos (15 minutos)
const unsigned long INTERVALO_ENVIO = 300000;
unsigned long ultimoEnvio = 0;

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

// Función para leer el pluviometro
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

// Función para leer el anemómetro
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

// Función para leer la veleta
String veleta() {
  float a = 0, b = 0, c = 0, d = 0;
  float a0 = 476, b0 = 480, c0 = 472, d0 = 480;
  float va = 0, vb = 0, vc = 0, vd = 0;
  int muestras = 64;
  
  for (int i = 0; i < muestras; i++) {
    a += analogRead(32);
  }
  a /= muestras;
  if (a > 4095) { a = 4095; }
  
  for (int i = 0; i < muestras; i++) {
    b += analogRead(35);
  }
  b /= muestras;
  if (b > 4095) { b = 4095; }
  
  for (int i = 0; i < muestras; i++) {
    c += analogRead(34);
  }
  c /= muestras;
  if (c > 4095) { c = 4095; }
  
  for (int i = 0; i < muestras; i++) {
    d += analogRead(33);
  }
  d /= muestras;
  if (d > 4095) { d = 4095; }
  
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

// Tarea encargada de las lecturas de sensores (se ejecuta en un núcleo)
void tareaSensores(void * parameter) {
  for (;;) {
    // Llamamos a las funciones de sensores sin modificar su programación original
    pluviometro();
    anemometroV2();
    // Se puede incluir alguna otra función de lectura si es necesario
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

// Tarea encargada de gestionar el envío de datos (se ejecuta en el otro núcleo)
void tareaEnvio(void * parameter) {
  for (;;) {
    unsigned long tiempoActual = millis();
    if (tiempoActual - ultimoEnvio >= INTERVALO_ENVIO) {
      ultimoEnvio = tiempoActual;

      float humedad = dht.readHumidity();
      float temperatura = dht.readTemperature();

      Serial.print("Temperatura: ");
      Serial.print(temperatura);
      Serial.println("°C");

      Serial.print("Humedad: ");
      Serial.print(humedad);
      Serial.println("%");

      Serial.print("Velocidad del viento: ");
      Serial.print(anemometroV2());
      Serial.println();

      Serial.print("Dirección del viento: ");
      Serial.println(veleta());

      Serial.print("mm de lluvia caída: ");
      Serial.println(pluviometro());

      HTTPClient http;
      http.begin("https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32");
      http.addHeader("Content-Type", "application/json");

      // Creación del objeto JSON con los datos a enviar
      JSONVar jsonData;
      jsonData["board"] = "esp32_01";
      jsonData["temperature"] = String(temperatura);
      jsonData["humidity"] = String(humedad);
      jsonData["veleta"] = veleta();
      jsonData["anemometro"] = String(anemometroV2());
      jsonData["pluviometro"] = String(pluviometro());

      String postData = JSON.stringify(jsonData);

      int httpCode = http.POST(postData);
      // String payload = http.getString();

      Serial.print("httpCode: ");
      Serial.println(httpCode);
      // Serial.print("payload: ");
      // Serial.println(payload);
      Serial.println("--------------");

      http.end();
    }
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);
  conectarWiFi();
  analogReadResolution(10);
  dht.begin();
  delay(2000);

  // Crear la tarea de sensores en el núcleo 1
  xTaskCreatePinnedToCore(
    tareaSensores,      // Función de la tarea
    "TareaSensores",    // Nombre de la tarea
    10000,              // Tamaño de la pila
    NULL,               // Parámetros
    1,                  // Prioridad
    NULL,               // Handle de la tarea
    1                   // Núcleo (1)
  );

  // Crear la tarea de envío en el núcleo 0
  xTaskCreatePinnedToCore(
    tareaEnvio,         // Función de la tarea
    "TareaEnvio",       // Nombre de la tarea
    10000,              // Tamaño de la pila
    NULL,               // Parámetros
    1,                  // Prioridad
    NULL,               // Handle de la tarea
    0                   // Núcleo (0)
  );
}

void loop() {
  // El loop se mantiene vacío; todas las funciones se ejecutan a través de las tareas.
  // Serial.printf("memoria libre %u btyes/n", ESP.getFreeSketchSpace());
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}
