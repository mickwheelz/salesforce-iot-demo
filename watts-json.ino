#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include "ACS712.h"

ACS712 sensor(ACS712_05B, A0);
const long interval = 5000;
unsigned long previousMillis = 0;
float P;

void setup() {  
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  sensor.calibrate();
}
void loop() {

  readSerialJson();
  float U = 240;
  float I = sensor.getCurrentAC();
  P = U * I;
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    Serial.println(P);
  }
  
}

void readSerialJson() {
  DynamicJsonBuffer jsonBuffer(256);
  JsonObject& root = jsonBuffer.parseObject(Serial);

  if(root["pin"] == "1") {
      digitalWrite(2, root["value"]);
  }
  if(root["pin"] == "2") {
      digitalWrite(3, root["value"]);
  }
}


