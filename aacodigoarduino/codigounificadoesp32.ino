//codigo sin verificacion de usuario
#include <WiFi.h> // Librería para el wifi.
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "DHT.h" // Librería para el sensor de humedad y temperatura.

#define WIFI_SSID "TP-LINK_8E0D5E" // Red de wifi.
#define WIFI_PASSWORD "delc@mpo4268" // Clave de wifi.

#define DHTPIN 23 // Pin del sensor de humedad y temperatura
#define DHTTYPE DHT11 // Tipo de Sensor de humedad y temperatura

DHT dht(DHTPIN, DHTTYPE); // Declaración del sensor de humedad y temperatura

String puntoCardinal = ""; // Variable de Dirección del Viento

float acumuladorAnemometro = 0, velocidadViento = 0; // Acumulador de lecturas y promedio del anemómetro.
int contadorAnemometro = 0;

int lecturaPluv = 0, contadorCiclosPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0; // Variables auxiliares del Pluviómetro.
float acumuladorMmCaidos = 0; // Acumulador de mm caídos detectados por el pluviómetro.

const char* serverName = "https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32";

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

// Lectura del pluviómetro
float pluviometro() {
  lecturaPluv = analogRead(36);
  float factorMM = 3.4;
  if (lecturaPluv < 2060) {
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
float anemometro() {
  float lecturaViento = analogRead(39);
  float divisor = 1;
  int muestras = 20;

  for (int i = 0; i < muestras; i++) {
    acumuladorAnemometro = acumuladorAnemometro + lecturaViento;
    delay(1);
  }

  velocidadViento = (acumuladorAnemometro / muestras) / divisor;
  if (velocidadViento < 1) {
    velocidadViento = 0.0;
  }
  acumuladorAnemometro = 0;
  return velocidadViento;
}

// Lectura de la veleta
String veleta() {
  float a = 0, b = 0, c = 0, d = 0, a0 = 1937, b0 = 1953, c0 = 1919, d0 = 1955;

  a = analogRead(32);
  b = analogRead(35);
  c = analogRead(34);
  d = analogRead(33);

  if (a < 1000 || b < 1000 || c < 1000 || d < 1000) {
    puntoCardinal = "Error";
  } else if (((a - a0) / a0) > 0.07) {
    puntoCardinal = "NORTE";
  } else if ((b - b0) / b0 > 0.07) {
    puntoCardinal = "ESTE";
  } else if ((c - c0) / c0 > 0.07) {
    puntoCardinal = "SUR";
  } else if ((d - d0) / d0 > 0.07) {
    puntoCardinal = "OESTE";
  } else if ((a - a0) / a0 < -0.025 && (b - b0) / b0 < -0.025) {
    puntoCardinal = "NORESTE";
  } else if ((c - c0) / c0 < -0.025 && (b - b0) / b0 < -0.025) {
    puntoCardinal = "SURESTE";
  } else if ((c - c0) / c0 < -0.025 && (d - d0) / d0 < -0.025) {
    puntoCardinal = "SUROESTE";
  } else if ((a - a0) / a0 < -0.025 && (d - d0) / d0 < -0.025) {
    puntoCardinal = "NOROESTE";
  } else if (a < 1000 || b < 1000 || c < 1000 || d < 1000) {
    puntoCardinal = "Error";
  }
  return puntoCardinal;
}

void setup() {
  Serial.begin(9600);
  conectarWiFi();
  dht.begin();
  delay(2000);
}

void loop() {
  for (int i = 0; i < 200; i++) {
    pluviometro();
    anemometro();
    delay(10);
  }

  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.println("°C");

  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.println("%");

  Serial.print("Velocidad del viento: ");
  Serial.println(anemometro());

  Serial.print("Dirección del viento: ");
  Serial.println(veleta());

  Serial.print("mm de lluvia caída: ");
  Serial.println(pluviometro());

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"board\":\"esp32_01\",\"temperature\":\"" + String(temperatura) + "\",\"humidity\":\"" + String(humedad) + "\",\"veleta\":\"" + String(veleta()) + "\",\"anemometro\":\"" + String(velocidadViento) + "\",\"pluviometro\":\"" + String(acumuladorMmCaidos) + "\"}";
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error al enviar POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }

  delay(60000); // Enviar datos cada 60 segundos
}

// //codigo con verificacion de usaurio y contraseña
// #include <WiFi.h> //Librería para el wifi.
// #include <HTTPClient.h>
// #include <Arduino_JSON.h>
// #include "DHT.h" //Librería para el sensor de humedad y temperatura.

// #define WIFI_SSID "TP-LINK_8E0D5E" //Red de wifi.
// #define WIFI_PASSWORD "delc@mpo4268" //Clave de wifi.

// #define DHTPIN 23 //Pin del sensor de humedad y temperatura
// #define DHTTYPE DHT11 //Tipo de Sensor de humedad y temperatura

// DHT dht(DHTPIN, DHTTYPE); //Declaración del sensor de humedad y temperatura

// String puntoCardinal = ""; //Variable de Dirección del Viento

// float acumuladorAnemometro = 0, velocidadViento = 0; //Acumulador de lecturas y promedio del anemómetro.
// int contadorAnemometro = 0;

// int lecturaPluv = 0, contadorCiclosPluv = 0, contadorEstadoPluviometroA = 0, contadorEstadoPluviometroB = 0; //Variables auxiliares del Pluviómetro.
// float acumuladorMmCaidos = 0; //Acumulador de mm caídos detectados por el pluviómetro.

// const char* serverName = "https://next-prisma-nextauth-eight.vercel.app/api/getandpushdataesp32";
// const char* userEmail = "marcos1@gmail.com";
// const char* userPass = "marcos1";

// // Conexión WiFi
// void conectarWiFi() {
//   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//   Serial.print("Conectando a Wi-Fi");
//   while (WiFi.status() != WL_CONNECTED) {
//     Serial.print(".");
//     delay(300);
//   }
//   Serial.println();
//   Serial.print("Conectado con IP: ");
//   Serial.println(WiFi.localIP());
//   Serial.println();
// }

// // Lectura del pluviómetro
// float pluviometro() {
//   lecturaPluv = analogRead(36);
//   float factorMM = 3.4;
//   if (lecturaPluv < 2060) {
//     contadorEstadoPluviometroB = 0;
//     if (contadorEstadoPluviometroA == 0) {
//       contadorCiclosPluv++;
//       acumuladorMmCaidos = (contadorCiclosPluv - 1) * factorMM;
//     }
//     contadorEstadoPluviometroA++;
//   } else {
//     contadorEstadoPluviometroA = 0;
//     if (contadorEstadoPluviometroB == 0) {
//       contadorCiclosPluv++;
//       acumuladorMmCaidos = (contadorCiclosPluv - 1) * factorMM;
//     }
//     contadorEstadoPluviometroB++;
//   }
//   return acumuladorMmCaidos;
// }

// // Lectura del anemómetro
// float anemometro() {
//   float lecturaViento = analogRead(39);
//   float divisor = 1;
//   int muestras = 20;

//   for (int i = 0; i < muestras; i++) {
//     acumuladorAnemometro = acumuladorAnemometro + lecturaViento;
//     delay(1);
//   }

//   velocidadViento = (acumuladorAnemometro / muestras) / divisor;
//   if (velocidadViento < 1) {
//     velocidadViento = 0.0;
//   }
//   acumuladorAnemometro = 0;
//   return velocidadViento;
// }

// // Lectura de la veleta
// String veleta() {
//   float a = 0, b = 0, c = 0, d = 0, a0 = 1937, b0 = 1953, c0 = 1919, d0 = 1955;

//   a = analogRead(32);
//   b = analogRead(35);
//   c = analogRead(34);
//   d = analogRead(33);

//   if (a < 1000 || b < 1000 || c < 1000 || d < 1000) {
//     puntoCardinal = "Error";
//   } else if (((a - a0) / a0) > 0.07) {
//     puntoCardinal = "NORTE";
//   } else if ((b - b0) / b0 > 0.07) {
//     puntoCardinal = "ESTE";
//   } else if ((c - c0) / c0 > 0.07) {
//     puntoCardinal = "SUR";
//   } else if ((d - d0) / d0 > 0.07) {
//     puntoCardinal = "OESTE";
//   } else if ((a - a0) / a0 < -0.025 && (b - b0) / b0 < -0.025) {
//     puntoCardinal = "NORESTE";
//   } else if ((c - c0) / c0 < -0.025 && (b - b0) / b0 < -0.025) {
//     puntoCardinal = "SURESTE";
//   } else if ((c - c0) / c0 < -0.025 && (d - d0) / d0 < -0.025) {
//     puntoCardinal = "SUROESTE";
//   } else if ((a - a0) / a0 < -0.025 && (d - d0) / d0 < -0.025) {
//     puntoCardinal = "NOROESTE";
//   } else if (a < 1000 || b < 1000 || c < 1000 || d < 1000) {
//     puntoCardinal = "Error";
//   }
//   return puntoCardinal;
// }

// void setup() {
//   Serial.begin(9600);
//   conectarWiFi();
//   dht.begin();
//   delay(2000);
// }

// void loop() {
//   for (int i = 0; i < 200; i++) {
//     pluviometro();
//     anemometro();
//     delay(10);
//   }

//   float humedad = dht.readHumidity();
//   float temperatura = dht.readTemperature();

//   Serial.print("Temperatura: ");
//   Serial.print(temperatura);
//   Serial.println("°C");

//   Serial.print("Humedad: ");
//   Serial.print(humedad);
//   Serial.println("%");

//   Serial.print("Velocidad del viento: ");
//   Serial.println(anemometro());

//   Serial.print("Dirección del viento: ");
//   Serial.println(veleta());

//   Serial.print("mm de lluvia caída: ");
//   Serial.println(pluviometro());

//   if (WiFi.status() == WL_CONNECTED) {
//     HTTPClient http;
//     http.begin(serverName);
//     http.addHeader("Content-Type", "application/json");
//     http.addHeader("Email", userEmail);
//     http.addHeader("Password", userPass);

// String jsonData = "{\"board\":\"esp32_01\",\"temperature\":\"" + String(temperatura) + "\",\"humidity\":\"" + String(humedad) + "\",\"veleta\":\"" + String(veleta()) + "\",\"anemometro\":\"" + String(velocidadViento) + "\",\"pluviometro\":\"" + String(acumuladorMmCaidos) + "\"}";
//     int httpResponseCode = http.POST(jsonData);

//     if (httpResponseCode > 0) {
//       String response = http.getString();
//       Serial.println(httpResponseCode);
//       Serial.println(response);
//     } else {
//       Serial.print("Error al enviar POST: ");
//       Serial.println(httpResponseCode);
//     }

//     http.end();
//   }

//   delay(60000); // Enviar datos cada 60 segundos
// }
